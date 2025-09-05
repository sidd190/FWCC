import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch projects with member count and creator info
    const projects = await prisma.project.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: {
            name: true,
            githubUsername: true
          }
        },
        members: true,
        _count: {
          select: {
            members: true
          }
        }
      }
    });

    // Format projects for frontend
    const formattedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      repoUrl: project.repoUrl,
      language: project.language,
      status: project.status.toLowerCase(),
      createdAt: project.createdAt.toISOString(),
      memberCount: project._count.members,
      creator: {
        name: project.creator.name || 'Unknown',
        githubUsername: project.creator.githubUsername
      }
    }));

    return NextResponse.json({
      success: true,
      projects: formattedProjects,
      total: formattedProjects.length,
      hasMore: formattedProjects.length === limit
    });

  } catch (error) {
    console.error('Projects fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}