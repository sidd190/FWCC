import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token for registration status
    const token = request.cookies.get('auth-token')?.value;
    let userId: string | null = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        userId = decoded.userId;
      } catch (error) {
        // Continue without user ID if token is invalid
      }
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch events with attendee count and creator info
    const events = await prisma.event.findMany({
      take: limit,
      skip: offset,
      orderBy: { date: 'asc' },
      include: {
        creator: {
          select: {
            name: true,
            githubUsername: true
          }
        },
        attendees: userId ? {
          where: { userId }
        } : false,
        _count: {
          select: {
            attendees: true
          }
        }
      }
    });

    // Format events for frontend
    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      location: event.location,
      maxAttendees: event.maxAttendees,
      currentAttendees: event._count.attendees,
      type: event.type.toLowerCase(),
      status: event.status.toLowerCase(),
      creator: {
        name: event.creator.name || 'Unknown',
        githubUsername: event.creator.githubUsername
      },
      isRegistered: userId ? (event.attendees as any[]).length > 0 : false
    }));

    return NextResponse.json({
      success: true,
      events: formattedEvents,
      total: formattedEvents.length,
      hasMore: formattedEvents.length === limit
    });

  } catch (error) {
    console.error('Events fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}