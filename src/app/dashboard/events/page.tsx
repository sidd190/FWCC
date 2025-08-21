"use client";

import { Calendar, Clock, MapPin, Users, Plus } from "lucide-react";

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "React Workshop: Advanced Patterns",
      description: "Deep dive into advanced React patterns including hooks, context, and performance optimization",
      date: "2025-08-25",
      time: "18:00",
      location: "Tech Hub Room 101",
      attendees: 24,
      maxAttendees: 30,
      status: "upcoming",
      type: "workshop"
    },
    {
      id: 2,
      title: "Open Source Contribution Day",
      description: "Collaborative session to contribute to open source projects and learn Git workflows",
      date: "2025-08-28",
      time: "14:00",
      location: "Online",
      attendees: 18,
      maxAttendees: 25,
      status: "upcoming",
      type: "hackathon"
    },
    {
      id: 3,
      title: "JavaScript Fundamentals",
      description: "Introduction to JavaScript for beginners covering ES6+ features and modern development",
      date: "2025-08-18",
      time: "19:00",
      location: "Main Auditorium",
      attendees: 35,
      maxAttendees: 35,
      status: "completed",
      type: "workshop"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#0B874F';
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
      default: return '#0B874F';
    }
  };

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
              Join workshops, hackathons, and meetups to level up your skills
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-[#0B874F] text-black font-medium rounded-lg hover:bg-[#0B874F]/80 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span 
                    className="px-2 py-1 text-xs rounded border"
                    style={{ 
                      backgroundColor: `${getTypeColor(event.type)}20`,
                      color: getTypeColor(event.type),
                      borderColor: `${getTypeColor(event.type)}50`
                    }}
                  >
                    {event.type}
                  </span>
                  <span 
                    className="px-2 py-1 text-xs rounded border"
                    style={{ 
                      backgroundColor: `${getStatusColor(event.status)}20`,
                      color: getStatusColor(event.status),
                      borderColor: `${getStatusColor(event.status)}50`
                    }}
                  >
                    {event.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm">{event.description}</p>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-300">
                <Calendar className="w-4 h-4 mr-2 text-[#0B874F]" />
                {new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <div className="flex items-center text-sm text-gray-300">
                <Clock className="w-4 h-4 mr-2 text-[#0B874F]" />
                {event.time}
              </div>
              
              <div className="flex items-center text-sm text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-[#0B874F]" />
                {event.location}
              </div>
              
              <div className="flex items-center text-sm text-gray-300">
                <Users className="w-4 h-4 mr-2 text-[#0B874F]" />
                {event.attendees}/{event.maxAttendees} attendees
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(event.attendees / event.maxAttendees) * 100}%`,
                    backgroundColor: event.attendees >= event.maxAttendees ? '#EF4444' : '#0B874F'
                  }}
                ></div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              className={`w-full py-2 rounded font-medium transition-colors ${
                event.status === 'completed' 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : event.attendees >= event.maxAttendees
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400 cursor-not-allowed'
                  : 'bg-[#0B874F]/10 border border-[#0B874F]/30 text-[#0B874F] hover:bg-[#0B874F]/20'
              }`}
              disabled={event.status === 'completed' || event.attendees >= event.maxAttendees}
            >
              {event.status === 'completed' 
                ? 'Event Completed' 
                : event.attendees >= event.maxAttendees 
                ? 'Event Full' 
                : 'Join Event'
              }
            </button>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <Calendar className="w-8 h-8 text-[#0B874F] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {events.filter(e => e.status === 'upcoming').length}
          </div>
          <div className="text-gray-400 text-sm">Upcoming Events</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <Users className="w-8 h-8 text-[#F5A623] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {events.reduce((sum, event) => sum + event.attendees, 0)}
          </div>
          <div className="text-gray-400 text-sm">Total Attendees</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <Clock className="w-8 h-8 text-[#9B59B6] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {events.filter(e => e.status === 'completed').length}
          </div>
          <div className="text-gray-400 text-sm">Events Completed</div>
        </div>
      </div>
    </div>
  );
}