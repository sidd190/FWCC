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
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const whereClause: any = {};
    if (role) {
      whereClause.role = role.toUpperCase();
    }
    if (status) {
      whereClause.lastActive = status === 'active' 
        ? { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Active in last 7 days
        : { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    }

    const members = await prisma.user.findMany({
      where: whereClause,
      take: limit,
      orderBy: { joinedAt: 'desc' },
      include: {
        githubStats: true,
        activities: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        projects: {
          include: {
            project: true
          }
        },
        events: {
          include: {
            event: true
          }
        }
      }
    });

    const transformedMembers = members.map(member => {
      const activeProjects = member.projects.filter(pm => pm.project.status === 'ACTIVE').length;
      const upcomingEvents = member.events.filter(ea => ea.event.status === 'UPCOMING').length;
      const recentActivity = member.activities.length;
      
      // Calculate status based on last activity
      const lastActivity = member.activities[0]?.createdAt || member.lastActive;
      const isActive = new Date().getTime() - new Date(lastActivity).getTime() < 7 * 24 * 60 * 60 * 1000;

      return {
        id: member.id,
        name: member.name || 'Unknown User',
        email: member.email,
        role: member.role.toLowerCase(),
        githubUsername: member.githubUsername,
        avatar: member.avatar || `https://github.com/${member.githubUsername}.png`,
        joinDate: member.joinedAt.toISOString().split('T')[0],
        location: member.location || 'Unknown',
        contributions: member.githubStats?.contributions || 0,
        status: isActive ? 'active' : 'inactive',
        stats: {
          commits: member.githubStats?.commits || 0,
          pullRequests: member.githubStats?.pullRequests || 0,
          issues: member.githubStats?.issues || 0,
          repositories: member.githubStats?.repositories || 0,
          followers: member.githubStats?.followers || 0,
          level: member.level,
          experience: member.experience,
          streak: member.streak
        },
        activity: {
          activeProjects,
          upcomingEvents,
          recentActivity
        }
      };
    });

    // Sort by contributions (most active first)
    transformedMembers.sort((a, b) => b.contributions - a.contributions);

    return NextResponse.json({
      success: true,
      members: transformedMembers,
      total: transformedMembers.length,
      stats: {
        totalMembers: transformedMembers.length,
        activeMembers: transformedMembers.filter(m => m.status === 'active').length,
        admins: transformedMembers.filter(m => m.role === 'admin').length,
        moderators: transformedMembers.filter(m => m.role === 'moderator').length
      }
    });

  } catch (error) {
    console.error('Members error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
} 