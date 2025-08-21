"use client";

import { useAuth } from "@/lib/auth-context";
import { 
  GitCommit, 
  GitPullRequest, 
  Users, 
  Calendar,
  TrendingUp,
  Star,
  Activity,
  Trophy
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Commits",
      value: "247",
      change: "+12%",
      icon: GitCommit,
      color: "#0B874F"
    },
    {
      title: "Pull Requests",
      value: "18",
      change: "+5%",
      icon: GitPullRequest,
      color: "#F5A623"
    },
    {
      title: "Leaderboard Rank",
      value: "#3",
      change: "↑2",
      icon: Trophy,
      color: "#E74C3C"
    },
    {
      title: "Active Projects",
      value: "5",
      change: "+1",
      icon: Star,
      color: "#9B59B6"
    }
  ];

  const recentActivity = [
    {
      type: "commit",
      message: "Fixed authentication bug in login system",
      repo: "fosser-website",
      time: "2 hours ago"
    },
    {
      type: "pr",
      message: "Added new dashboard components",
      repo: "fosser-website", 
      time: "5 hours ago"
    },
    {
      type: "event",
      message: "Attended React Workshop",
      repo: "events",
      time: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-[#0B874F] mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Developer'}!
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your projects and contributions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <span
                  className="text-sm font-medium px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: `${stat.color}20`,
                    color: stat.color
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[#0B874F]" />
              Recent Activity
            </h2>
            <button className="text-[#0B874F] hover:text-[#0B874F]/80 text-sm">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-black/30 rounded-lg border border-[#0B874F]/20"
              >
                <div className="flex-shrink-0">
                  {activity.type === "commit" && (
                    <div className="w-8 h-8 bg-[#0B874F]/20 rounded-full flex items-center justify-center">
                      <GitCommit className="w-4 h-4 text-[#0B874F]" />
                    </div>
                  )}
                  {activity.type === "pr" && (
                    <div className="w-8 h-8 bg-[#F5A623]/20 rounded-full flex items-center justify-center">
                      <GitPullRequest className="w-4 h-4 text-[#F5A623]" />
                    </div>
                  )}
                  {activity.type === "event" && (
                    <div className="w-8 h-8 bg-[#9B59B6]/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-[#9B59B6]" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[#0B874F] text-xs">{activity.repo}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#0B874F]" />
            Quick Actions
          </h2>
          
          <div className="space-y-3">
            <button className="w-full p-4 bg-[#0B874F]/10 border border-[#0B874F]/30 rounded-lg text-left hover:bg-[#0B874F]/20 transition-colors">
              <div className="text-[#0B874F] font-medium">View Leaderboard</div>
              <div className="text-gray-400 text-sm">Check your ranking</div>
            </button>
            
            <button className="w-full p-4 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg text-left hover:bg-[#F5A623]/20 transition-colors">
              <div className="text-[#F5A623] font-medium">Join Event</div>
              <div className="text-gray-400 text-sm">Upcoming workshops</div>
            </button>
            
            <button className="w-full p-4 bg-[#9B59B6]/10 border border-[#9B59B6]/30 rounded-lg text-left hover:bg-[#9B59B6]/20 transition-colors">
              <div className="text-[#9B59B6] font-medium">New Project</div>
              <div className="text-gray-400 text-sm">Start contributing</div>
            </button>
          </div>

          {/* GitHub Stats Preview */}
          <div className="mt-6 p-4 bg-black/30 rounded-lg border border-[#0B874F]/20">
            <h3 className="text-white font-medium mb-3">GitHub This Week</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Commits</span>
                <span className="text-[#0B874F]">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">PRs Merged</span>
                <span className="text-[#0B874F]">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Issues Closed</span>
                <span className="text-[#0B874F]">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}