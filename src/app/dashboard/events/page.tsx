"use client";

import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Clock, Plus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  type: string;
  status: string;
  creator: {
    name: string;
    githubUsername?: string;
  };
  isRegistered: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'workshop':
        return 'bg-[#0B874F]/20 text-[#0B874F] border-[#0B874F]/30';
      case 'hackathon':
        return 'bg-[#E74C3C]/20 text-[#E74C3C] border-[#E74C3C]/30';
      case 'meetup':
        return 'bg-[#F5A623]/20 text-[#F5A623] border-[#F5A623]/30';
      case 'conference':
        return 'bg-[#9B59B6]/20 text-[#9B59B6] border-[#9B59B6]/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-[#0B874F]/20 text-[#0B874F]';
      case 'ongoing':
        return 'bg-[#F5A623]/20 text-[#F5A623]';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400';
      case 'cancelled':
        return 'bg-[#E74C3C]/20 text-[#E74C3C]';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleRegister = async (eventId: string) => {
    try {
      const response = await fetch(`/api/dashboard/events/${eventId}/register`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to register for event');
      }

      // Refresh events to update registration status
      await fetchEvents();
    } catch (err) {
      console.error('Error registering for event:', err);
      alert('Failed to register for event');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
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
            <h1 className="text-3xl font-bold text-[#0B874F] mb-2 flex items-center">
              <Calendar className="w-8 h-8 mr-3" />
              Events
            </h1>
            <p className="text-gray-400">
              Join workshops, hackathons, and community meetups
            </p>
          </div>
          
          <button className="flex items-center px-4 py-2 bg-[#0B874F] text-black rounded-lg hover:bg-[#0B874F]/80 transition-colors font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const { date, time } = formatDate(event.date);
            const spotsLeft = event.maxAttendees - event.currentAttendees;
            
            return (
              <div
                key={event.id}
                className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200"
              >
                {/* Event Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{date}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{time}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>
                      {event.currentAttendees}/{event.maxAttendees} attendees
                      {spotsLeft > 0 && (
                        <span className="text-[#0B874F] ml-1">({spotsLeft} spots left)</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Creator */}
                <div className="mb-4 pb-4 border-t border-[#0B874F]/20 pt-4">
                  <div className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-[#0B874F]/20 rounded-full flex items-center justify-center mr-2">
                      <span className="text-[#0B874F] text-xs font-bold">
                        {event.creator.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <span className="text-gray-400">
                      by <span className="text-white">{event.creator.name}</span>
                      {event.creator.githubUsername && (
                        <span className="text-gray-500"> (@{event.creator.githubUsername})</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                {event.status.toLowerCase() === 'upcoming' && (
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={event.isRegistered || spotsLeft <= 0}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      event.isRegistered
                        ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                        : spotsLeft <= 0
                        ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
                        : 'bg-[#0B874F]/10 border border-[#0B874F]/30 text-[#0B874F] hover:bg-[#0B874F]/20'
                    }`}
                  >
                    {event.isRegistered
                      ? 'Already Registered'
                      : spotsLeft <= 0
                      ? 'Event Full'
                      : 'Register Now'
                    }
                  </button>
                )}
                
                {event.status.toLowerCase() !== 'upcoming' && (
                  <button className="w-full px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg cursor-not-allowed">
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Events Scheduled</h3>
          <p className="text-gray-500 mb-6">Check back later for upcoming workshops and meetups!</p>
          <button className="px-6 py-3 bg-[#0B874F] text-black rounded-lg hover:bg-[#0B874F]/80 transition-colors font-medium">
            <Plus className="w-4 h-4 inline mr-2" />
            Create Event
          </button>
        </div>
      )}
    </div>
  );
}