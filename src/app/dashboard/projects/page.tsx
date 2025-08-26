"use client";

import { GitBranch, Plus, Star, GitCommit } from "lucide-react";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  status: string;
  repoUrl: string;
  stars: number;
  commits: number;
  lastUpdate: string;
  creator: {
    name: string;
    avatar: string;
    githubUsername: string;
  };
  members: Array<{
    name: string;
    avatar: string;
    role: string;
    joinedAt: string;
  }>;
  stats: {
    totalMembers: number;
    recentCommits: number;
    recentPRs: number;
    totalActivities: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = filter === 'all' 
        ? '/api/dashboard/projects?limit=50'
        : `/api/dashboard/projects?limit=50&status=${filter}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#0B874F';
      case 'planning': return '#F5A623';
      case 'completed': return '#9B59B6';
      case 'archived': return '#6B7280';
      default: return '#0B874F';
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#F7DF1E',
      'TypeScript': '#3178C6',
      'Python': '#3776AB',
      'Java': '#ED8B00',
      'C++': '#00599C',
      'Go': '#00ADD8',
      'Rust': '#DEA584',
      'PHP': '#777BB4',
      'Ruby': '#CC342D',
      'C#': '#239120',
      'Swift': '#FA7343',
      'Kotlin': '#7F52FF',
      'Dart': '#00D4AA',
      'R': '#276DC3',
      'Scala': '#DC322F',
      'Elixir': '#4B275F',
      'Clojure': '#5881D8',
      'Haskell': '#5D4F85',
      'OCaml': '#EC6813',
      'F#': '#378BBA'
    };
    return colors[language] || '#6B7280';
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.language.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Projects</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={fetchProjects}
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
              Projects
            </h1>
            <p className="text-gray-400">
              Explore and contribute to open source projects in the FOSSER community.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <div className="text-sm text-gray-400">Total Projects</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects by name, description, or language..."
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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
            <button className="px-4 py-2 bg-[#0B874F] text-white rounded-lg hover:bg-[#0B874F]/80 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${getStatusColor(project.status)}20`,
                      color: getStatusColor(project.status)
                    }}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Language and Creator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getLanguageColor(project.language) }}
                  ></div>
                  <span className="text-sm text-gray-300">{project.language}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src={project.creator.avatar}
                    alt={project.creator.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-400">{project.creator.name}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 text-[#F5A623]" />
                    <span className="text-white font-medium">{project.stars}</span>
                  </div>
                  <div className="text-xs text-gray-400">Stars</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <GitCommit className="w-4 h-4 text-[#0B874F]" />
                    <span className="text-white font-medium">{project.commits}</span>
                  </div>
                  <div className="text-xs text-gray-400">Commits</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <GitBranch className="w-4 h-4 text-[#9B59B6]" />
                    <span className="text-white font-medium">{project.stats.totalMembers}</span>
                  </div>
                  <div className="text-xs text-gray-400">Members</div>
                </div>
              </div>

              {/* Activity */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Recent Commits</span>
                  <span className="text-white">{project.stats.recentCommits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Recent PRs</span>
                  <span className="text-white">{project.stats.recentPRs}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Activities</span>
                  <span className="text-white">{project.stats.totalActivities}</span>
                </div>
              </div>

              {/* Last Update */}
              <div className="text-xs text-gray-500 mb-4">
                Last updated: {project.lastUpdate}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-[#0B874F]/10 border border-[#0B874F]/30 text-[#0B874F] rounded hover:bg-[#0B874F]/20 transition-colors text-sm text-center"
                  >
                    View Repository
                  </a>
                )}
                <button className="flex-1 py-2 bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] rounded hover:bg-[#F5A623]/20 transition-colors text-sm">
                  Join Project
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No Projects Found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms.' : 'No projects available.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}