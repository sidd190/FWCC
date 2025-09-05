"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Medal, Award, TrendingUp, GitCommit, GitPullRequest, Star } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  githubUsername?: string;
  avatar?: string;
  stats: {
    commits: number;
    pullRequests: number;
    issues: number;
    contributions: number;
  };
  rank: number;
  points: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'contributions' | 'commits' | 'pullRequests'>('contributions');

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/leaderboard?sortBy=${sortBy}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        2: 'bg-gray-400/20 text-gray-400 border-gray-400/30',
        3: 'bg-amber-600/20 text-amber-600 border-amber-600/30'
      };
      return colors[rank as keyof typeof colors];
    }
    return 'bg-[#0B874F]/20 text-[#0B874F] border-[#0B874F]/30';
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
              <div className="animate-pulse flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/3"></div>
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
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Leaderboard</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={fetchLeaderboard}
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
              <Trophy className="w-8 h-8 mr-3" />
              Leaderboard
            </h1>
            <p className="text-gray-400">
              Top contributors in our community
            </p>
          </div>
          
          {/* Sort Options */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSortBy('contributions')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'contributions'
                  ? 'bg-[#0B874F]/20 text-[#0B874F] border border-[#0B874F]/50'
                  : 'bg-black/30 text-gray-400 hover:text-[#0B874F]'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Total
            </button>
            <button
              onClick={() => setSortBy('commits')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'commits'
                  ? 'bg-[#0B874F]/20 text-[#0B874F] border border-[#0B874F]/50'
                  : 'bg-black/30 text-gray-400 hover:text-[#0B874F]'
              }`}
            >
              <GitCommit className="w-4 h-4 inline mr-2" />
              Commits
            </button>
            <button
              onClick={() => setSortBy('pullRequests')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'pullRequests'
                  ? 'bg-[#0B874F]/20 text-[#0B874F] border border-[#0B874F]/50'
                  : 'bg-black/30 text-gray-400 hover:text-[#0B874F]'
              }`}
            >
              <GitPullRequest className="w-4 h-4 inline mr-2" />
              PRs
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div
              key={user.id}
              className={`bg-black/40 backdrop-blur-sm border rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200 ${getRankBadge(user.rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankIcon(user.rank)}
                  </div>
                  
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-[#0B874F]/20 rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#0B874F] font-bold text-lg">
                        {user.name?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div>
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    {user.githubUsername && (
                      <p className="text-sm text-gray-400">@{user.githubUsername}</p>
                    )}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#0B874F]">{user.stats.commits}</div>
                    <div className="text-xs text-gray-400">Commits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#F5A623]">{user.stats.pullRequests}</div>
                    <div className="text-xs text-gray-400">PRs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#E74C3C]">{user.stats.issues}</div>
                    <div className="text-xs text-gray-400">Issues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{user.points}</div>
                    <div className="text-xs text-gray-400">Points</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Data Available</h3>
            <p className="text-gray-500">Start contributing to see the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
}