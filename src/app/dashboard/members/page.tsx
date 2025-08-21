"use client";

import { Users, Mail, Github, MapPin, Calendar, Star } from "lucide-react";

export default function MembersPage() {
  const members = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@fosser.com",
      role: "admin",
      githubUsername: "admin",
      avatar: "https://github.com/github.png",
      joinDate: "2024-01-15",
      location: "San Francisco, CA",
      contributions: 247,
      status: "active"
    },
    {
      id: 2,
      name: "Jane Developer",
      email: "jane@example.com",
      role: "member",
      githubUsername: "developer1",
      avatar: "https://github.com/github.png",
      joinDate: "2024-03-20",
      location: "New York, NY",
      contributions: 189,
      status: "active"
    },
    {
      id: 3,
      name: "John Coder",
      email: "john@example.com",
      role: "member",
      githubUsername: "coder2",
      avatar: "https://github.com/github.png",
      joinDate: "2024-05-10",
      location: "Austin, TX",
      contributions: 156,
      status: "active"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "moderator",
      githubUsername: "sarahw",
      avatar: "https://github.com/github.png",
      joinDate: "2024-02-28",
      location: "Seattle, WA",
      contributions: 203,
      status: "active"
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#E74C3C';
      case 'moderator': return '#F5A623';
      case 'member': return '#0B874F';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#0B874F';
      case 'inactive': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0B874F] mb-2 flex items-center">
              <Users className="w-8 h-8 mr-3" />
              Members
            </h1>
            <p className="text-gray-400">
              Connect with fellow developers and contributors
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{members.length}</div>
            <div className="text-sm text-gray-400">Total Members</div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full border-2 border-[#0B874F]/30"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="px-2 py-1 text-xs rounded border capitalize"
                      style={{ 
                        backgroundColor: `${getRoleColor(member.role)}20`,
                        color: getRoleColor(member.role),
                        borderColor: `${getRoleColor(member.role)}50`
                      }}
                    >
                      {member.role}
                    </span>
                    <span 
                      className="px-2 py-1 text-xs rounded border"
                      style={{ 
                        backgroundColor: `${getStatusColor(member.status)}20`,
                        color: getStatusColor(member.status),
                        borderColor: `${getStatusColor(member.status)}50`
                      }}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Member Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-[#0B874F]" />
                {member.email}
              </div>
              
              {member.githubUsername && (
                <div className="flex items-center text-sm text-gray-300">
                  <Github className="w-4 h-4 mr-2 text-[#0B874F]" />
                  @{member.githubUsername}
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-[#0B874F]" />
                {member.location}
              </div>
              
              <div className="flex items-center text-sm text-gray-300">
                <Calendar className="w-4 h-4 mr-2 text-[#0B874F]" />
                Joined {new Date(member.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </div>

            {/* Contributions */}
            <div className="bg-black/30 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Contributions</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-[#F5A623]" />
                  <span className="text-white font-bold">{member.contributions}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="flex-1 py-2 bg-[#0B874F]/10 border border-[#0B874F]/30 text-[#0B874F] rounded hover:bg-[#0B874F]/20 transition-colors text-sm">
                View Profile
              </button>
              <button className="flex-1 py-2 bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] rounded hover:bg-[#F5A623]/20 transition-colors text-sm">
                Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Member Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <Users className="w-8 h-8 text-[#0B874F] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {members.filter(m => m.status === 'active').length}
          </div>
          <div className="text-gray-400 text-sm">Active Members</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <Star className="w-8 h-8 text-[#E74C3C] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {members.filter(m => m.role === 'admin').length}
          </div>
          <div className="text-gray-400 text-sm">Admins</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <Github className="w-8 h-8 text-[#F5A623] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {members.reduce((sum, member) => sum + member.contributions, 0).toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">Total Contributions</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <Calendar className="w-8 h-8 text-[#9B59B6] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {new Date().getFullYear() - new Date(Math.min(...members.map(m => new Date(m.joinDate).getTime()))).getFullYear()}
          </div>
          <div className="text-gray-400 text-sm">Years Active</div>
        </div>
      </div>
    </div>
  );
}