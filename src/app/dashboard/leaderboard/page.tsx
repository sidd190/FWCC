"use client";

import { useState, useEffect } from "react";
import { Trophy, GitCommit, GitPullRequest, AlertCircle, Star, TrendingUp, Filter } from "lucide-react";

interface GitHubUser {
  id: string;
  username: string;
  name: string;
  avatar: string;
  rank: number;
  points: number;
  stats: {
    commits: number;
    pullRequests: number;
    issues: number;
    repositories: number;
    followers: number;
    contributions: number;
  };
  weeklyStats: {
    commits: number;
    pullRequests: number;
    issues: number;
  };
  languages: Record<string, number>;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('contributions');
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    fetchLeaderboardData();
  }, [sortBy, period]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/github/stats?sortBy=${sortBy}&period=${period}`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "#FFD700"; // Gold
      case 2: return "#C0C0C0"; // Silver  
      case 3: return "#CD7F32"; // Bronze
      default: return "#0B874F";
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Trophy className="w-5 h-5" style={{ color: getRankColor(rank) }} />;
    }
    return <span className="text-[#0B874F] font-bold">#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-[#0B874F] text-xl font-mono">Loading leaderboard...</div>
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
              <Trophy className="w-8 h-8 mr-3" />
              GitHub Leaderboard
            </h1>
            <p className="text-gray-400">
              Track contributions and compete with fellow developers
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-black/50 border border-[#0B874F]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0B874F]"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/50 border border-[#0B874F]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0B874F]"
            >
              <option value="contributions">Total Contributions</option>
              <option value="commits">Commits</option>
              <option value="pullRequests">Pull Requests</option>
              <option value="issues">Issues</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {users.slice(0, 3).map((user, index) => (
          <div
            key={user.id}
            className={`bg-black/40 backdrop-blur-sm border rounded-lg p-6 text-center relative overflow-hidden ${
              index === 0 ? 'border-yellow-500/50 md:order-2' : 
              index === 1 ? 'border-gray-400/50 md:order-1' : 
              'border-orange-500/50 md:order-3'
            }`}
          >
            {/* Rank Badge */}
            <div className="absolute top-4 right-4">
              {getRankIcon(user.rank)}
            </div>
            
            {/* Avatar */}
            <div className="relative mx-auto mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 mx-auto"
                style={{ borderColor: getRankColor(user.rank) }}
              />
              {index === 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
            
            {/* User Info */}
            <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
            <p className="text-[#0B874F] text-sm mb-4">@{user.username}</p>
            
            {/* Stats */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Points</span>
                <span className="text-white font-bold">{user.points.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Contributions</span>
                <span className="text-[#0B874F]">{user.stats.contributions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#0B874F]/30">
          <h2 className="text-xl font-bold text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#0B874F]" />
            Full Rankings
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Developer</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">Points</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">Commits</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">PRs</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">Issues</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">Repos</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Languages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B874F]/20">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#0B874F]/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-[#0B874F]/30"
                      />
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-[#0B874F] text-sm">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-white font-bold">{user.points.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <GitCommit className="w-4 h-4 mr-1 text-[#0B874F]" />
                      <span className="text-white">{user.stats.commits}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <GitPullRequest className="w-4 h-4 mr-1 text-[#F5A623]" />
                      <span className="text-white">{user.stats.pullRequests}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-[#E74C3C]" />
                      <span className="text-white">{user.stats.issues}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <Star className="w-4 h-4 mr-1 text-[#9B59B6]" />
                      <span className="text-white">{user.stats.repositories}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(user.languages).slice(0, 3).map(([lang, percentage]) => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-[#0B874F]/20 text-[#0B874F] text-xs rounded border border-[#0B874F]/30"
                        >
                          {lang} {percentage}%
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <GitCommit className="w-8 h-8 text-[#0B874F] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {users.reduce((sum, user) => sum + user.stats.commits, 0).toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">Total Commits</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <GitPullRequest className="w-8 h-8 text-[#F5A623] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {users.reduce((sum, user) => sum + user.stats.pullRequests, 0)}
          </div>
          <div className="text-gray-400 text-sm">Pull Requests</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-[#E74C3C] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {users.reduce((sum, user) => sum + user.stats.issues, 0)}
          </div>
          <div className="text-gray-400 text-sm">Issues Resolved</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 text-center">
          <Star className="w-8 h-8 text-[#9B59B6] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {users.reduce((sum, user) => sum + user.stats.repositories, 0)}
          </div>
          <div className="text-gray-400 text-sm">Active Repositories</div>
        </div>
      </div>
    </div>
  );
}