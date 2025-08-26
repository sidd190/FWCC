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
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build where clause
    const whereClause: any = {};
    if (status) {
      whereClause.status = status.toUpperCase();
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        creator: {
          select: {
            name: true,
            avatar: true,
            githubUsername: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
                githubUsername: true
              }
            }
          }
        },
        activities: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    const transformedProjects = projects.map(project => {
      const totalMembers = project.members.length + 1; // +1 for creator
      const recentCommits = project.activities.filter(a => a.type === 'COMMIT').length;
      const recentPRs = project.activities.filter(a => a.type === 'PULL_REQUEST').length;
      
      // Calculate last update based on most recent activity
      const lastActivity = project.activities[0]?.createdAt || project.updatedAt;
      const lastUpdate = getTimeAgo(lastActivity);

      // Mock stars and commits for now (could be enhanced with GitHub API)
      const stars = Math.floor(Math.random() * 20) + 1;
      const commits = recentCommits + Math.floor(Math.random() * 50) + 10;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        language: project.language,
        status: project.status.toLowerCase(),
        repoUrl: project.repoUrl,
        stars,
        commits,
        lastUpdate,
        creator: {
          name: project.creator.name || 'Unknown',
          avatar: project.creator.avatar || `https://github.com/${project.creator.githubUsername}.png`,
          githubUsername: project.creator.githubUsername
        },
        members: project.members.map(member => ({
          name: member.user.name || 'Unknown',
          avatar: member.user.avatar || `https://github.com/${member.user.githubUsername}.png`,
          role: member.role,
          joinedAt: member.joinedAt
        })),
        stats: {
          totalMembers,
          recentCommits,
          recentPRs,
          totalActivities: project.activities.length
        },
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      projects: transformedProjects,
      total: transformedProjects.length,
      stats: {
        totalProjects: transformedProjects.length,
        activeProjects: transformedProjects.filter(p => p.status === 'active').length,
        planningProjects: transformedProjects.filter(p => p.status === 'planning').length,
        completedProjects: transformedProjects.filter(p => p.status === 'completed').length
      }
    });

  } catch (error) {
    console.error('Projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
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