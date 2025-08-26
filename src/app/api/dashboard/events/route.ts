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
    const type = searchParams.get('type');
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
    if (type) {
      whereClause.type = type.toUpperCase();
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      take: limit,
      orderBy: { date: 'asc' },
      include: {
        creator: {
          select: {
            name: true,
            avatar: true,
            githubUsername: true
          }
        },
        attendees: {
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
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    const transformedEvents = events.map(event => {
      const attendees = event.attendees.length;
      const isUserAttending = event.attendees.some(a => a.userId === user.id);
      const isUserCreator = event.creatorId === user.id;
      
      // Calculate time until event
      const now = new Date();
      const eventDate = new Date(event.date);
      const timeUntilEvent = eventDate.getTime() - now.getTime();
      const daysUntilEvent = Math.ceil(timeUntilEvent / (1000 * 60 * 60 * 24));

      let timeStatus = '';
      if (timeUntilEvent < 0) {
        timeStatus = 'Past';
      } else if (daysUntilEvent === 0) {
        timeStatus = 'Today';
      } else if (daysUntilEvent === 1) {
        timeStatus = 'Tomorrow';
      } else if (daysUntilEvent <= 7) {
        timeStatus = `In ${daysUntilEvent} days`;
      } else {
        timeStatus = `In ${Math.ceil(daysUntilEvent / 7)} weeks`;
      }

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date.toISOString().split('T')[0],
        time: event.date.toTimeString().split(' ')[0].substring(0, 5),
        location: event.location,
        attendees,
        maxAttendees: event.maxAttendees,
        status: event.status.toLowerCase(),
        type: event.type.toLowerCase(),
        timeStatus,
        daysUntilEvent,
        creator: {
          name: event.creator.name || 'Unknown',
          avatar: event.creator.avatar || `https://github.com/${event.creator.githubUsername}.png`,
          githubUsername: event.creator.githubUsername
        },
        attendeesList: event.attendees.map(attendee => ({
          name: attendee.user.name || 'Unknown',
          avatar: attendee.user.avatar || `https://github.com/${attendee.user.githubUsername}.png`,
          joinedAt: attendee.joinedAt
        })),
        userParticipation: {
          isAttending: isUserAttending,
          isCreator: isUserCreator,
          canJoin: !isUserAttending && event.status === 'UPCOMING' && attendees < event.maxAttendees
        },
        stats: {
          attendanceRate: Math.round((attendees / event.maxAttendees) * 100),
          totalActivities: event.activities.length
        },
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      events: transformedEvents,
      total: transformedEvents.length,
      stats: {
        totalEvents: transformedEvents.length,
        upcomingEvents: transformedEvents.filter(e => e.status === 'upcoming').length,
        ongoingEvents: transformedEvents.filter(e => e.status === 'ongoing').length,
        completedEvents: transformedEvents.filter(e => e.status === 'completed').length,
        userAttending: transformedEvents.filter(e => e.userParticipation.isAttending).length
      }
    });

  } catch (error) {
    console.error('Events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 