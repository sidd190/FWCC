"use client";

import { Activity, GitCommit, GitPullRequest, Calendar, Users, MessageSquare, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface ActivityItem {
  id: string;
  type: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  description: string;
  timestamp: string;
  details: any;
  metadata: {
    projectName?: string;
    eventTitle?: string;
    repoUrl?: string;
  };
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchActivities();
  }, [filter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = filter === 'all' 
        ? '/api/dashboard/activities?limit=50'
        : `/api/dashboard/activities?limit=50&type=${filter}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.activities);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="w-4 h-4 text-[#0B874F]" />;
      case 'pull_request':
        return <GitPullRequest className="w-4 h-4 text-[#F5A623]" />;
      case 'issue':
        return <MessageSquare className="w-4 h-4 text-[#E74C3C]" />;
      case 'event_join':
      case 'event_create':
        return <Calendar className="w-4 h-4 text-[#9B59B6]" />;
      case 'project_join':
      case 'project_create':
        return <Star className="w-4 h-4 text-[#3498DB]" />;
      case 'member_join':
        return <Users className="w-4 h-4 text-[#2ECC71]" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'commit':
        return 'bg-[#0B874F]/20 border-[#0B874F]/30';
      case 'pull_request':
        return 'bg-[#F5A623]/20 border-[#F5A623]/30';
      case 'issue':
        return 'bg-[#E74C3C]/20 border-[#E74C3C]/30';
      case 'event_join':
      case 'event_create':
        return 'bg-[#9B59B6]/20 border-[#9B59B6]/30';
      case 'project_join':
      case 'project_create':
        return 'bg-[#3498DB]/20 border-[#3498DB]/30';
      case 'member_join':
        return 'bg-[#2ECC71]/20 border-[#2ECC71]/30';
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
          {[...Array(5)].map((_, i) => (
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
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Activities</h2>
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
            <h1 className="text-3xl font-bold text-[#0B874F] mb-2">
              Activity Feed
            </h1>
            <p className="text-gray-400">
              Track all your contributions and activities across projects and events.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-black/40 border border-[#0B874F]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#0B874F]/50"
            >
              <option value="all">All Activities</option>
              <option value="commit">Commits</option>
              <option value="pull_request">Pull Requests</option>
              <option value="issue">Issues</option>
              <option value="event_join">Event Joins</option>
              <option value="project_join">Project Joins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`bg-black/40 backdrop-blur-sm border rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200 ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-white font-medium">{activity.user}</span>
                    <span className="text-gray-400">{activity.action}</span>
                    <span className="text-[#0B874F] font-medium">{activity.target}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-2">{activity.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{activity.timestamp}</span>
                      {activity.metadata.projectName && (
                        <>
                          <span>•</span>
                          <span className="text-[#0B874F]">{activity.metadata.projectName}</span>
                        </>
                      )}
                      {activity.metadata.eventTitle && (
                        <>
                          <span>•</span>
                          <span className="text-[#9B59B6]">{activity.metadata.eventTitle}</span>
                        </>
                      )}
                    </div>
                    
                    {activity.metadata.repoUrl && (
                      <a
                        href={activity.metadata.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0B874F] hover:text-[#0B874F]/80 text-sm"
                      >
                        View Repository →
                      </a>
                    )}
                  </div>
                  
                  {Object.keys(activity.details).length > 0 && (
                    <div className="mt-3 p-3 bg-black/20 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {activity.details.commits && (
                          <div>
                            <span className="text-gray-400">Commits:</span>
                            <span className="text-white ml-2">{activity.details.commits}</span>
                          </div>
                        )}
                        {activity.details.additions && (
                          <div>
                            <span className="text-gray-400">Additions:</span>
                            <span className="text-green-400 ml-2">+{activity.details.additions}</span>
                          </div>
                        )}
                        {activity.details.deletions && (
                          <div>
                            <span className="text-gray-400">Deletions:</span>
                            <span className="text-red-400 ml-2">-{activity.details.deletions}</span>
                          </div>
                        )}
                        {activity.details.files && (
                          <div>
                            <span className="text-gray-400">Files:</span>
                            <span className="text-white ml-2">{activity.details.files}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No Activities Found</h3>
            <p>Start contributing to projects and joining events to see your activity here!</p>
          </div>
        )}
      </div>
    </div>
  );
}