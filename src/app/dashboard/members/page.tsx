"use client";

import { Users, Mail, Github, MapPin, Calendar, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  githubUsername: string;
  avatar: string;
  joinDate: string;
  location: string;
  contributions: number;
  status: string;
  stats: {
    commits: number;
    pullRequests: number;
    issues: number;
    repositories: number;
    followers: number;
    level: number;
    experience: number;
    streak: number;
  };
  activity: {
    activeProjects: number;
    upcomingEvents: number;
    recentActivity: number;
  };
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchMembers();
  }, [filter]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = filter === 'all' 
        ? '/api/dashboard/members?limit=50'
        : `/api/dashboard/members?limit=50&role=${filter}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await response.json();
      setMembers(data.members);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

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

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.githubUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Members</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={fetchMembers}
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
              Club Members
            </h1>
            <p className="text-gray-400">
              Connect with fellow developers and contributors in the FOSSER community.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{members.length}</div>
            <div className="text-sm text-gray-400">Total Members</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search members by name, username, or email..."
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
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="moderator">Moderators</option>
              <option value="member">Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200"
            >
              {/* Member Header */}
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full border-2 border-[#0B874F]/30"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${getRoleColor(member.role)}20`,
                        color: getRoleColor(member.role)
                      }}
                    >
                      {member.role}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${getStatusColor(member.status)}20`,
                        color: getStatusColor(member.status)
                      }}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
                {member.githubUsername && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Github className="w-4 h-4" />
                    <span>@{member.githubUsername}</span>
                  </div>
                )}
                {member.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{member.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-black/20 rounded-lg">
                  <div className="text-lg font-bold text-[#0B874F]">{member.contributions}</div>
                  <div className="text-xs text-gray-400">Contributions</div>
                </div>
                <div className="text-center p-3 bg-black/20 rounded-lg">
                  <div className="text-lg font-bold text-[#F5A623]">{member.stats.level}</div>
                  <div className="text-xs text-gray-400">Level</div>
                </div>
              </div>

              {/* Activity */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Active Projects</span>
                  <span className="text-white">{member.activity.activeProjects}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Upcoming Events</span>
                  <span className="text-white">{member.activity.upcomingEvents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Recent Activity</span>
                  <span className="text-white">{member.activity.recentActivity}</span>
                </div>
              </div>

              {/* GitHub Stats */}
              <div className="mt-4 pt-4 border-t border-[#0B874F]/20">
                <h4 className="text-sm font-medium text-white mb-2">GitHub Stats</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Commits:</span>
                    <span className="text-white ml-1">{member.stats.commits}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">PRs:</span>
                    <span className="text-white ml-1">{member.stats.pullRequests}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Issues:</span>
                    <span className="text-white ml-1">{member.stats.issues}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No Members Found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms.' : 'No members available.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}