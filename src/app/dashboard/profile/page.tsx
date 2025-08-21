"use client";

import { useAuth } from "@/lib/auth-context";
import { User, Mail, Github, MapPin, Calendar, Edit, Save, X } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    githubUsername: user?.githubUsername || '',
    location: 'San Francisco, CA',
    bio: 'Full-stack developer passionate about open source and community building.'
  });

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      githubUsername: user?.githubUsername || '',
      location: 'San Francisco, CA',
      bio: 'Full-stack developer passionate about open source and community building.'
    });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Contributions', value: '247', color: '#0B874F' },
    { label: 'Pull Requests', value: '18', color: '#F5A623' },
    { label: 'Issues Closed', value: '12', color: '#E74C3C' },
    { label: 'Repositories', value: '8', color: '#9B59B6' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0B874F] mb-2 flex items-center">
              <User className="w-8 h-8 mr-3" />
              Profile
            </h1>
            <p className="text-gray-400">
              Manage your profile information and preferences
            </p>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-[#0B874F] text-black font-medium rounded-lg hover:bg-[#0B874F]/80 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-[#0B874F] text-black font-medium rounded-lg hover:bg-[#0B874F]/80 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 font-medium rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#0B874F]/30 rounded-lg text-white focus:outline-none focus:border-[#0B874F]"
                  />
                ) : (
                  <div className="text-white">{formData.name}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#0B874F]/30 rounded-lg text-white focus:outline-none focus:border-[#0B874F]"
                  />
                ) : (
                  <div className="text-white">{formData.email}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">GitHub Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.githubUsername}
                    onChange={(e) => setFormData({...formData, githubUsername: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#0B874F]/30 rounded-lg text-white focus:outline-none focus:border-[#0B874F]"
                  />
                ) : (
                  <div className="text-white">@{formData.githubUsername}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#0B874F]/30 rounded-lg text-white focus:outline-none focus:border-[#0B874F]"
                  />
                ) : (
                  <div className="text-white">{formData.location}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 bg-black/50 border border-[#0B874F]/30 rounded-lg text-white focus:outline-none focus:border-[#0B874F] resize-none"
                  />
                ) : (
                  <div className="text-white">{formData.bio}</div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                <div className="w-8 h-8 bg-[#0B874F]/20 rounded-full flex items-center justify-center">
                  <Github className="w-4 h-4 text-[#0B874F]" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">Pushed 3 commits to fosser-website</div>
                  <div className="text-gray-400 text-xs">2 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                <div className="w-8 h-8 bg-[#F5A623]/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-[#F5A623]" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">Joined React Workshop event</div>
                  <div className="text-gray-400 text-xs">1 day ago</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                <div className="w-8 h-8 bg-[#9B59B6]/20 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#9B59B6]" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">Updated profile information</div>
                  <div className="text-gray-400 text-xs">3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
            <img
              src="https://github.com/github.png"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-[#0B874F]/30 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-white mb-1">{formData.name}</h3>
            <p className="text-[#0B874F] text-sm mb-2">@{formData.githubUsername}</p>
            <p className="text-gray-400 text-sm mb-4">{user?.role}</p>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {formData.location}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
            
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{stat.label}</span>
                  <span 
                    className="font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              <button className="w-full p-3 bg-[#0B874F]/10 border border-[#0B874F]/30 text-[#0B874F] rounded-lg hover:bg-[#0B874F]/20 transition-colors text-sm">
                View GitHub Profile
              </button>
              <button className="w-full p-3 bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] rounded-lg hover:bg-[#F5A623]/20 transition-colors text-sm">
                Export Data
              </button>
              <button className="w-full p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}