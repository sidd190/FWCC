"use client";

import { GitBranch, Plus, Star, GitCommit } from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "fosser-website",
      description: "Main club website built with Next.js and TypeScript",
      language: "TypeScript",
      stars: 12,
      commits: 89,
      status: "active",
      lastUpdate: "2 hours ago"
    },
    {
      id: 2,
      name: "discord-bot",
      description: "Discord bot for club management and notifications",
      language: "Python",
      stars: 8,
      commits: 45,
      status: "active",
      lastUpdate: "1 day ago"
    },
    {
      id: 3,
      name: "event-tracker",
      description: "Event management system for workshops and meetups",
      language: "JavaScript",
      stars: 5,
      commits: 23,
      status: "planning",
      lastUpdate: "3 days ago"
    }
  ];

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
              Collaborate on open source projects and build amazing things together
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-[#0B874F] text-black font-medium rounded-lg hover:bg-[#0B874F]/80 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-6 hover:border-[#0B874F]/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{project.name}</h3>
              <span className={`px-2 py-1 text-xs rounded ${
                project.status === 'active' 
                  ? 'bg-[#0B874F]/20 text-[#0B874F] border border-[#0B874F]/30'
                  : 'bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30'
              }`}>
                {project.status}
              </span>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">{project.description}</p>
            
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-[#0B874F]">{project.language}</span>
              <span className="text-gray-400">{project.lastUpdate}</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-gray-400">
                <Star className="w-4 h-4 mr-1" />
                {project.stars}
              </div>
              <div className="flex items-center text-gray-400">
                <GitCommit className="w-4 h-4 mr-1" />
                {project.commits}
              </div>
            </div>
            
            <button className="w-full mt-4 py-2 bg-[#0B874F]/10 border border-[#0B874F]/30 text-[#0B874F] rounded hover:bg-[#0B874F]/20 transition-colors">
              View Project
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}