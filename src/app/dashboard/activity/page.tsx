"use client";

import { Activity, GitCommit, GitPullRequest, Calendar, Users, MessageSquare, Star } from "lucide-react";

export default function ActivityPage() {
  const activities = [
    {
      id: 1,
      type: "commit",
      user: "Admin User",
      avatar: "https://github.com/github.png",
      action: "pushed 3 commits to",
      target: "fosser-website",
      description: "Fixed authentication bug and updated dashboard components",
      timestamp: "2 hours ago",
      details: {
        commits: 3,
        additions: 45,
        deletions: 12
      }
    },
    {
      id: 2,
      type: "pr",
      user: "Jane Developer",
      avatar: "https://github.com/github.png",
      action: "opened pull request in",
      target: "discord-bot",
      description: "Add new command for event notifications",
      timestamp: "4 hours ago",
      details: {
        files: 5,
        additions: 89,
        deletions: 23
      }
    },
    {
      id: 3,
      type: "event",
      user: "John Coder",
      avatar: "https://github.com/github.png",
      action: "joined event",
      target: "React Workshop",
      description: "Advanced React patterns and performance optimization",
      timestamp: "6 hours ago",
      details: {
        attendees: 24
      }
    },
    {
      id: 4,
      type: "member",
      user: "Sarah Wilson",
      avatar: "https://github.com/github.png",
      action: "became a moderator",
      target: "FOSSER Club",
      description: "Promoted to moderator role for outstanding contributions",
      timestamp: "1 day ago",
      details: {}
    },
    {
      id: 5,
      type: "issue",
      user: "Admin User",
      avatar: "https://github.com/github.png",
      action: "closed issue in",
      target: "fosser-website",
      description: "Login form validation not working properly",
      timestamp: "1 day ago",
      details: {
        issueNumber: 42
      }
    },
    {
      id: 6,
      type: "star",
      user: "Jane Developer",
      avatar: "https://github.com/github.png",
      action: "starred repository",
      target: "event-tracker",
      description: "Event management system for workshops and meetups",
      timestamp: "2 days ago",
      details: {
        stars: 6
      }
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="w-5 h-5 text-[#0B874F]" />;
      case 'pr':
        return <GitPullRequest className="w-5 h-5 text-[#F5A623]" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-[#9B59B6]" />;
      case 'member':
        return <Users className="w-5 h-5 text-[#E74C3C]" />;
      case 'issue':
        return <MessageSquare className="w-5 h-5 text-[#6B7280]" />;
      case 'star':
        return <Star className="w-5 h-5 text-[#FFD700]" />;
      default:
        return <Activity className="w-5 h-5 text-[#0B874F]" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'commit': return '#0B874F';
      case 'pr': return '#F5A623';
      case 'event': return '#9B59B6';
      case 'member': return '#E74C3C';
      case 'issue': return '#6B7280';
      case 'star': return '#FFD700';
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
              <Activity className="w-8 h-8 mr-3" />
              Activity Feed
            </h1>
            <p className="text-gray-400">
              Stay updated with the latest activities and contributions
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{activities.length}</div>
            <div className="text-sm text-gray-400">Recent Activities</div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#0B874F]/30">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        </div>
        
        <div className="divide-y divide-[#0B874F]/20">
          {activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-[#0B874F]/5 transition-colors">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <img
                  src={activity.avatar}
                  alt={activity.user}
                  className="w-10 h-10 rounded-full border-2 border-[#0B874F]/30 flex-shrink-0"
                />
                
                {/* Activity Icon */}
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${getActivityColor(activity.type)}20` }}
                >
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium">{activity.user}</span>
                    <span className="text-gray-400">{activity.action}</span>
                    <span 
                      className="font-medium"
                      style={{ color: getActivityColor(activity.type) }}
                    >
                      {activity.target}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2">{activity.description}</p>
                  
                  {/* Activity Details */}
                  {Object.keys(activity.details).length > 0 && (
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                      {activity.details.commits && (
                        <span>{activity.details.commits} commits</span>
                      )}
                      {activity.details.additions && (
                        <span className="text-green-400">+{activity.details.additions}</span>
                      )}
                      {activity.details.deletions && (
                        <span className="text-red-400">-{activity.details.deletions}</span>
                      )}
                      {activity.details.files && (
                        <span>{activity.details.files} files changed</span>
                      )}
                      {activity.details.attendees && (
                        <span>{activity.details.attendees} attendees</span>
                      )}
                      {activity.details.issueNumber && (
                        <span>#{activity.details.issueNumber}</span>
                      )}
                      {activity.details.stars && (
                        <span>{activity.details.stars} stars</span>
                      )}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">{activity.timestamp}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-4 text-center">
          <GitCommit className="w-6 h-6 text-[#0B874F] mx-auto mb-2" />
          <div className="text-lg font-bold text-white">
            {activities.filter(a => a.type === 'commit').length}
          </div>
          <div className="text-xs text-gray-400">Commits</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-4 text-center">
          <GitPullRequest className="w-6 h-6 text-[#F5A623] mx-auto mb-2" />
          <div className="text-lg font-bold text-white">
            {activities.filter(a => a.type === 'pr').length}
          </div>
          <div className="text-xs text-gray-400">Pull Requests</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-4 text-center">
          <Calendar className="w-6 h-6 text-[#9B59B6] mx-auto mb-2" />
          <div className="text-lg font-bold text-white">
            {activities.filter(a => a.type === 'event').length}
          </div>
          <div className="text-xs text-gray-400">Events</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-4 text-center">
          <MessageSquare className="w-6 h-6 text-[#6B7280] mx-auto mb-2" />
          <div className="text-lg font-bold text-white">
            {activities.filter(a => a.type === 'issue').length}
          </div>
          <div className="text-xs text-gray-400">Issues</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-[#E74C3C] mx-auto mb-2" />
          <div className="text-lg font-bold text-white">
            {activities.filter(a => a.type === 'member').length}
          </div>
          <div className="text-xs text-gray-400">Members</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-4 text-center">
          <Star className="w-6 h-6 text-[#FFD700] mx-auto mb-2" />
          <div className="text-lg font-bold text-white">
            {activities.filter(a => a.type === 'star').length}
          </div>
          <div className="text-xs text-gray-400">Stars</div>
        </div>
      </div>
    </div>
  );
}