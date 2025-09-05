"use client";

import React, { useEffect, useState } from "react";
import { Activity, GitCommit, GitPullRequest, Calendar, Users, Filter } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  repo?: string;
  target?: string;
  time: string;
  timestamp: string;
  user?: {
    name: string;
    githubUsername?: string;
  };
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'commits' | 'pull_requests' | 'issues'>('all');

  useEffect(() => {
    fetchActivities();
  }, [filter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/activity?filter=${filter}&limit=50`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.activities || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'commit':
        return <GitCommit className="w-4 h-4 text-[#0B874F]" />;
      case 'pull_request':
        return <GitPullRequest className="w-4 h-4 text-[#F5A623]" />;
      case 'issue':
        return <Activity className="w-4 h-4 text-[#E74C3C]" />;
      case 'event_join':
        return <Calendar className="w-4 h-4 text-[#9B59B6]" />;
      case 'project_join':
        return <Users className="w-4 h-4 text-[#0B874F]" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'commit':
        return 'bg-[#0B874F]/20 border-[#0B874F]/30';
      case 'pull_request':
        return 'bg-[#F5A623]/20 border-[#F5A623]/30';
      case 'issue':
        return 'bg-[#E74C3C]/20 border-[#E74C3C]/30';
      case 'event_join':
        return 'bg-[#9B59B6]/20 border-[#9B59B6]/30';
      case 'project_join':
        return 'bg-[#0B874F]/20 border-[#0B874F]/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
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
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-4">
              <div className="animate-pulse flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
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
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Activity</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={fetchActivities}
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
              <Activity className="w-8 h-8 mr-3" />
              Activity Feed
            </h1>
            <p className="text-gray-400">
              Recent activity from the community
            </p>
          </div>
          
          {/* Filter Options */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 bg-black/50 border border-[#0B874F]/30 rounded-lg text-white focus:outline-none focus:border-[#0B874F]"
            >
              <option value="all">All Activity</option>
              <option value="commits">Commits</option>
              <option value="pull_requests">Pull Requests</option>
              <option value="issues">Issues</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`bg-black/40 backdrop-blur-sm border rounded-lg p-4 hover:border-[#0B874F]/50 transition-all duration-200 ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start space-x-4">
                {/* Activity Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        {activity.user && (
                          <span className="font-medium text-[#0B874F]">
                            {activity.user.name}
                            {activity.user.githubUsername && (
                              <span className="text-gray-400"> (@{activity.user.githubUsername})</span>
                            )}
                          </span>
                        )}
                        {activity.user && ' '}
                        {activity.message}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        {activity.repo && (
                          <>
                            <span className="text-[#0B874F] text-xs font-medium">{activity.repo}</span>
                            <span className="text-gray-400 text-xs">•</span>
                          </>
                        )}
                        {activity.target && activity.target !== activity.repo && (
                          <>
                            <span className="text-[#0B874F] text-xs font-medium">{activity.target}</span>
                            <span className="text-gray-400 text-xs">•</span>
                          </>
                        )}
                        <span className="text-gray-400 text-xs">{activity.time}</span>
                      </div>
                    </div>
                    
                    {/* Activity Type Badge */}
                    <span className="flex-shrink-0 ml-4 px-2 py-1 bg-black/30 rounded text-xs font-medium text-gray-300 capitalize">
                      {activity.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-12 text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Activity Yet</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Start contributing to see activity here!'
              : `No ${filter.replace('_', ' ')} activity found.`
            }
          </p>
        </div>
      )}
    </div>
  );
}