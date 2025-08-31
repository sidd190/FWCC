"use client";

import { Calendar, Clock, MapPin, Users, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  status: string;
  type: string;
  timeStatus: string;
  daysUntilEvent: number;
  creator: {
    name: string;
    avatar: string;
    githubUsername: string;
  };
  attendeesList: Array<{
    name: string;
    avatar: string;
    joinedAt: string;
  }>;
  userParticipation: {
    isAttending: boolean;
    isCreator: boolean;
    canJoin: boolean;
  };
  stats: {
    attendanceRate: number;
    totalActivities: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = filter === 'all' 
        ? '/api/dashboard/events?limit=50'
        : `/api/dashboard/events?limit=50&status=${filter}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#0B874F';
      case 'ongoing': return '#F5A623';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#0B874F';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return '#F5A623';
      case 'hackathon': return '#9B59B6';
      case 'meetup': return '#E74C3C';
      case 'conference': return '#3498DB';
      default: return '#0B874F';
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Events</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={fetchEvents}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0B874F] mb-2">
              Events
            </h1>
            <p className="text-gray-400">
              Join workshops, hackathons, and meetups to learn and connect with the community.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{events.length}</div>
            <div className="text-sm text-gray-400">Total Events</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-[#0B874F]/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#0B874F]/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-black/40 border border-[#0B874F]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#0B874F]/50"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            <button className="px-4 py-2 bg-[#0B874F] text-white rounded-lg hover:bg-[#0B874F]/80 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                </div>
                <div className="flex flex-col items-end space-y-1 ml-4">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${getStatusColor(event.status)}20`,
                      color: getStatusColor(event.status)
                    }}
                  >
                    {event.status}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${getTypeColor(event.type)}20`,
                      color: getTypeColor(event.type)
                    }}
                  >
                    {event.type}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                                          <span>{new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees}/{event.maxAttendees} attendees</span>
                </div>
              </div>

              {/* Time Status */}
              <div className="mb-4">
                <span className="text-sm font-medium text-[#0B874F]">{event.timeStatus}</span>
              </div>

              {/* Attendance Rate */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Attendance Rate</span>
                  <span className="text-white">{event.stats.attendanceRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-[#0B874F] h-2 rounded-full"
                    style={{ width: `${event.stats.attendanceRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src={event.creator.avatar}
                  alt={event.creator.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-400">Organized by {event.creator.name}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {event.userParticipation.isAttending ? (
                  <button className="flex-1 py-2 bg-[#0B874F]/20 border border-[#0B874F]/30 text-[#0B874F] rounded text-sm">
                    ✓ Attending
                  </button>
                ) : event.userParticipation.canJoin ? (
                  <button className="flex-1 py-2 bg-[#0B874F]/10 border border-[#0B874F]/30 text-[#0B874F] rounded hover:bg-[#0B874F]/20 transition-colors text-sm">
                    Join Event
                  </button>
                ) : (
                  <button className="flex-1 py-2 bg-gray-600/20 border border-gray-600/30 text-gray-400 rounded text-sm" disabled>
                    Event Full
                  </button>
                )}
                <button className="flex-1 py-2 bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] rounded hover:bg-[#F5A623]/20 transition-colors text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No Events Found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms.' : 'No events available.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}