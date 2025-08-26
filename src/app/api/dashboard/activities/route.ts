import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build where clause
    const whereClause: any = {};
    if (type) {
      whereClause.type = type.toUpperCase();
    }

    const activities = await prisma.activity.findMany({
      where: whereClause,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            githubUsername: true
          }
        },
        project: {
          select: {
            name: true,
            repoUrl: true
          }
        },
        event: {
          select: {
            title: true,
            type: true
          }
        }
      }
    });

    const transformedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.type.toLowerCase(),
      user: activity.user.name || 'Unknown User',
      avatar: activity.user.avatar || `https://github.com/${activity.user.githubUsername}.png`,
      action: getActionText(activity.type),
      target: activity.project?.name || activity.event?.title || 'General',
      description: activity.description,
      timestamp: getTimeAgo(activity.createdAt),
      details: activity.metadata ? JSON.parse(activity.metadata as string) : {},
      metadata: {
        projectName: activity.project?.name,
        eventTitle: activity.event?.title,
        repoUrl: activity.project?.repoUrl
      }
    }));

    return NextResponse.json({
      success: true,
      activities: transformedActivities,
      total: activities.length
    });

  } catch (error) {
    console.error('Activities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

function getActionText(type: string): string {
  switch (type) {
    case 'COMMIT':
      return 'pushed commits to';
    case 'PULL_REQUEST':
      return 'opened pull request in';
    case 'ISSUE':
      return 'closed issue in';
    case 'EVENT_JOIN':
      return 'joined event';
    case 'EVENT_CREATE':
      return 'created event';
    case 'PROJECT_JOIN':
      return 'joined project';
    case 'PROJECT_CREATE':
      return 'created project';
    case 'MEMBER_JOIN':
      return 'became a member';
    case 'ACHIEVEMENT':
      return 'unlocked achievement';
    default:
      return 'performed action in';
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
} 