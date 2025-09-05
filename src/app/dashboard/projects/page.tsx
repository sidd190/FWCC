"use client";

import React, { useEffect, useState } from "react";
import { GitBranch, Plus, ExternalLink, Users, Calendar, Code } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  repoUrl?: string;
  language: string;
  status: string;
  createdAt: string;
  memberCount: number;
  creator: {
    name: string;
    githubUsername?: string;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/projects');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#0B874F]/20 text-[#0B874F] border-[#0B874F]/30';
      case 'planning':
        return 'bg-[#F5A623]/20 text-[#F5A623] border-[#F5A623]/30';
      case 'completed':
        return 'bg-[#9B59B6]/20 text-[#9B59B6] border-[#9B59B6]/30';
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
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
            <h1 className="text-3xl font-bold text-[#0B874F] mb-2 flex items-center">
              <GitBranch className="w-8 h-8 mr-3" />
              Projects
            </h1>
            <p className="text-gray-400">
              Explore and contribute to open source projects
            </p>
          </div>
          
          <button className="flex items-center px-4 py-2 bg-[#0B874F] text-black rounded-lg hover:bg-[#0B874F]/80 transition-colors font-medium">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#0B874F] transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Project Info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <Code className="w-4 h-4 mr-2" />
                  <span>{project.language}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{project.memberCount} member{project.memberCount !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Creator */}
              <div className="mt-4 pt-4 border-t border-[#0B874F]/20">
                <div className="flex items-center text-sm">
                  <div className="w-6 h-6 bg-[#0B874F]/20 rounded-full flex items-center justify-center mr-2">
                    <span className="text-[#0B874F] text-xs font-bold">
                      {project.creator.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <span className="text-gray-400">
                    by <span className="text-white">{project.creator.name}</span>
                    {project.creator.githubUsername && (
                      <span className="text-gray-500"> (@{project.creator.githubUsername})</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full mt-4 px-4 py-2 bg-[#0B874F]/10 border border-[#0B874F]/30 rounded-lg text-[#0B874F] hover:bg-[#0B874F]/20 transition-colors font-medium">
                View Project
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-12 text-center">
          <GitBranch className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Projects Yet</h3>
          <p className="text-gray-500 mb-6">Start your first project and begin contributing!</p>
          <button className="px-6 py-3 bg-[#0B874F] text-black rounded-lg hover:bg-[#0B874F]/80 transition-colors font-medium">
            <Plus className="w-4 h-4 inline mr-2" />
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}