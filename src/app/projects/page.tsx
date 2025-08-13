"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Github, ExternalLink, Star, Plus, Users, GitPullRequest } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import EnhancedButton from "@/components/enhanced-button"
import PageTransition from "@/components/page-transition"

const projects = [
  {
    id: 1,
    title: "DevFlow",
    description: "A comprehensive developer workflow automation tool built with React and Node.js",
    longDescription:
      "DevFlow streamlines the entire development process from code commit to deployment. Features include automated testing, code review assistance, deployment pipelines, and team collaboration tools.",
    category: "Web Development",
    status: "ongoing",
    difficulty: "Advanced",
    tech: ["React", "Node.js", "TypeScript", "Docker", "AWS"],
    github: "https://github.com/ufc/devflow",
    demo: "https://devflow-demo.vercel.app",
    image: "/devflow-dashboard-interface.png",
    contributors: 12,
    stars: 245,
    forks: 67,
    lastUpdate: "2024-02-28",
    featured: true,
    hologramData: {
      components: ["Frontend UI", "Backend API", "Database Layer", "CI/CD Pipeline", "Authentication"],
      connections: [
        { from: "Frontend UI", to: "Backend API" },
        { from: "Backend API", to: "Database Layer" },
        { from: "CI/CD Pipeline", to: "Backend API" },
        { from: "Authentication", to: "Frontend UI" },
      ],
    },
  },
  {
    id: 2,
    title: "EcoTracker",
    description: "Mobile app for tracking personal carbon footprint and environmental impact",
    longDescription:
      "EcoTracker helps users monitor their daily environmental impact through intuitive tracking features, personalized recommendations, and community challenges.",
    category: "Mobile Development",
    status: "ongoing",
    difficulty: "Intermediate",
    tech: ["React Native", "Firebase", "Python", "TensorFlow"],
    github: "https://github.com/ufc/ecotracker",
    demo: "https://ecotracker-app.com",
    image: "/ecotracker-mobile-app.png",
    contributors: 8,
    stars: 189,
    forks: 34,
    lastUpdate: "2024-03-01",
    featured: false,
    hologramData: {
      components: ["Mobile App", "ML Engine", "Data Analytics", "User Dashboard", "Notification System"],
      connections: [
        { from: "Mobile App", to: "ML Engine" },
        { from: "ML Engine", to: "Data Analytics" },
        { from: "Data Analytics", to: "User Dashboard" },
        { from: "Notification System", to: "Mobile App" },
      ],
    },
  },
  {
    id: 3,
    title: "CodeMentor AI",
    description: "AI-powered code review and mentoring assistant for new developers",
    longDescription:
      "CodeMentor AI provides intelligent code reviews, suggests improvements, and offers personalized learning paths for developers at all skill levels.",
    category: "AI/ML",
    status: "completed",
    difficulty: "Advanced",
    tech: ["Python", "OpenAI", "FastAPI", "React", "PostgreSQL"],
    github: "https://github.com/ufc/codementor-ai",
    demo: "https://codementor-ai.dev",
    image: "/ai-code-review-assistant.png",
    contributors: 15,
    stars: 412,
    forks: 89,
    lastUpdate: "2024-03-05",
    featured: true,
    hologramData: {
      components: ["AI Engine", "Code Parser", "Review System", "Learning Path", "User Interface"],
      connections: [
        { from: "Code Parser", to: "AI Engine" },
        { from: "AI Engine", to: "Review System" },
        { from: "Review System", to: "Learning Path" },
        { from: "Learning Path", to: "User Interface" },
      ],
    },
  },
  {
    id: 4,
    title: "OpenLibrary",
    description: "Digital library management system for educational institutions",
    longDescription:
      "OpenLibrary is a comprehensive library management system that digitizes book catalogs, manages lending, and provides advanced search capabilities.",
    category: "Education",
    status: "completed",
    difficulty: "Intermediate",
    tech: ["Vue.js", "Django", "PostgreSQL", "Redis"],
    github: "https://github.com/ufc/openlibrary",
    demo: "https://openlibrary-demo.edu",
    image: "/digital-library-system.png",
    contributors: 6,
    stars: 156,
    forks: 23,
    lastUpdate: "2024-02-25",
    featured: false,
    hologramData: {
      components: ["Web Interface", "Search Engine", "Database", "Cache Layer", "Admin Panel"],
      connections: [
        { from: "Web Interface", to: "Search Engine" },
        { from: "Search Engine", to: "Database" },
        { from: "Database", to: "Cache Layer" },
        { from: "Admin Panel", to: "Database" },
      ],
    },
  },
  {
    id: 5,
    title: "CryptoWallet",
    description: "Secure cryptocurrency wallet with multi-chain support",
    longDescription:
      "A secure, open-source cryptocurrency wallet supporting multiple blockchains with advanced security features and intuitive user interface.",
    category: "Blockchain",
    status: "ongoing",
    difficulty: "Advanced",
    tech: ["Rust", "React", "Web3", "Solidity"],
    github: "https://github.com/ufc/cryptowallet",
    demo: null,
    image: "/crypto-wallet-security.png",
    contributors: 9,
    stars: 78,
    forks: 12,
    lastUpdate: "2024-03-03",
    featured: false,
    hologramData: {
      components: ["Wallet Core", "Blockchain Interface", "Security Layer", "UI Components", "Transaction Engine"],
      connections: [
        { from: "UI Components", to: "Wallet Core" },
        { from: "Wallet Core", to: "Security Layer" },
        { from: "Security Layer", to: "Blockchain Interface" },
        { from: "Transaction Engine", to: "Blockchain Interface" },
      ],
    },
  },
  {
    id: 6,
    title: "GameEngine2D",
    description: "Lightweight 2D game engine built with modern C++ and OpenGL",
    longDescription:
      "A performant 2D game engine designed for indie developers, featuring modern C++ architecture, comprehensive tooling, and cross-platform support.",
    category: "Game Development",
    status: "completed",
    difficulty: "Expert",
    tech: ["C++", "OpenGL", "CMake", "Lua"],
    github: "https://github.com/ufc/gameengine2d",
    demo: "https://gameengine2d-showcase.com",
    image: "/2d-game-engine-development.png",
    contributors: 11,
    stars: 334,
    forks: 56,
    lastUpdate: "2024-02-29",
    featured: true,
    hologramData: {
      components: ["Rendering Engine", "Physics System", "Audio Manager", "Input Handler", "Scene Manager"],
      connections: [
        { from: "Scene Manager", to: "Rendering Engine" },
        { from: "Physics System", to: "Rendering Engine" },
        { from: "Input Handler", to: "Scene Manager" },
        { from: "Audio Manager", to: "Scene Manager" },
      ],
    },
  },
]

const categories = [
  "All",
  "Web Development",
  "Mobile Development",
  "AI/ML",
  "Education",
  "Blockchain",
  "Game Development",
]

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [hologramActive, setHologramActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const filteredProjects = projects.filter((project) => {
    return selectedCategory === "All" || project.category === selectedCategory
  })

  const ongoingProjects = projects.filter((project) => project.status === "ongoing")
  const completedProjects = projects.filter((project) => project.status === "completed")

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white overflow-hidden" ref={containerRef}>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center">
          <motion.div
            className="absolute inset-0 z-0"
            style={{
              background: "radial-gradient(circle at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)",
              y: backgroundY,
            }}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-xl text-gray-400 mb-8">Build the Future with Open Source</p>
              <Link href="/submit/project">
                <EnhancedButton
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold px-8 py-4"
                >
                  <Plus className="w-5 h-5" />
                  Propose Project
                </EnhancedButton>
              </Link>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className={`px-6 py-2 rounded-full border transition-all ${
                    selectedCategory === category
                      ? "bg-green-500 text-black border-green-500"
                      : "bg-transparent text-green-400 border-green-500/30 hover:border-green-500/60"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-green-400"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ongoing Projects
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-12">
              {ongoingProjects.map((project, index) => (
                <HologramProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isSelected={selectedProject === project.id}
                  onSelect={setSelectedProject}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-green-400"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Completed Projects
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/projects/${project.id}`}>
                    <HologramProjectCard
                      project={project}
                      index={index}
                      isSelected={selectedProject === project.id}
                      onSelect={setSelectedProject}
                      isCompact={true}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

interface HologramProjectCardProps {
  project: (typeof projects)[0]
  index: number
  isSelected: boolean
  onSelect: (id: number | null) => void
  isCompact?: boolean
}

function HologramProjectCard({ project, index, isSelected, onSelect, isCompact = false }: HologramProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [assemblyPhase, setAssemblyPhase] = useState(0)

  useEffect(() => {
    if (isHovered) {
      const timer = setInterval(() => {
        setAssemblyPhase((prev) => (prev + 1) % 4)
      }, 800)
      return () => clearInterval(timer)
    } else {
      setAssemblyPhase(0)
    }
  }, [isHovered])

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/projects/${project.id}`}>
        <motion.div
          className={`relative ${isCompact ? "h-80" : "h-96"} bg-black border border-green-500/30 rounded-xl overflow-hidden`}
          whileHover={{ scale: 1.02 }}
          style={{
            boxShadow: isHovered
              ? "0 0 50px rgba(34, 197, 94, 0.3), inset 0 0 50px rgba(34, 197, 94, 0.1)"
              : "0 0 20px rgba(34, 197, 94, 0.1)",
          }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 opacity-30">
            <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          {/* Hologram Grid */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {/* Hologram Components */}
          <AnimatePresence>
            {isHovered && (
              <div className="absolute inset-0 p-6">"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Github, ExternalLink, Star, Plus, Users, GitPullRequest } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import EnhancedButton from "@/components/enhanced-button"
import PageTransition from "@/components/page-transition"

const projects = [
…      </Link>
    </motion.div>
  )
}

                {project.hologramData.components.map((component, compIndex) => (
                  <motion.div
                    key={component}
                    className="absolute"
                    style={{
                      left: `${20 + (compIndex % 3) * 30}%`,
                      top: `${20 + Math.floor(compIndex / 3) * 25}%`,
                    }}
                    initial={{
                      opacity: 0,
                      scale: 0,
                      rotateX: 90,
                      z: -100,
                    }}
                    animate={{
                      opacity: assemblyPhase >= compIndex % 4 ? 1 : 0.3,
                      scale: assemblyPhase >= compIndex % 4 ? 1 : 0.5,
                      rotateX: assemblyPhase >= compIndex % 4 ? 0 : 45,
                      z: assemblyPhase >= compIndex % 4 ? 0 : -50,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: compIndex * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <div className="relative">
                      {/* Component Box */}
                      <motion.div
                        className="px-3 py-2 bg-green-500/20 border border-green-400/50 rounded text-xs text-green-300 backdrop-blur-sm"
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(34, 197, 94, 0.3)",
                            "0 0 20px rgba(34, 197, 94, 0.6)",
                            "0 0 10px rgba(34, 197, 94, 0.3)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {component}
                      </motion.div>

                      {/* Connection Lines */}
                      {project.hologramData.connections
                        .filter((conn) => conn.from === component)
                        .map((connection, connIndex) => {
                          const targetIndex = project.hologramData.components.indexOf(connection.to)
                          const targetLeft = 20 + (targetIndex % 3) * 30
                          const targetTop = 20 + Math.floor(targetIndex / 3) * 25
                          const currentLeft = 20 + (compIndex % 3) * 30
                          const currentTop = 20 + Math.floor(compIndex / 3) * 25

                          return (
                            <motion.div
                              key={connIndex}
                              className="absolute top-1/2 left-1/2 origin-left h-px bg-gradient-to-r from-green-400/60 to-transparent"
                              style={{
                                width: `${
                                  Math.sqrt(
                                    Math.pow(targetLeft - currentLeft, 2) + Math.pow(targetTop - currentTop, 2),
                                  ) * 3
                                }px`,
                                transform: `rotate(${
                                  Math.atan2(targetTop - currentTop, targetLeft - currentLeft) * (180 / Math.PI)
                                }deg)`,
                              }}
                              initial={{ scaleX: 0, opacity: 0 }}
                              animate={{
                                scaleX: assemblyPhase >= 2 ? 1 : 0,
                                opacity: assemblyPhase >= 2 ? 0.8 : 0,
                              }}
                              transition={{ duration: 0.8, delay: connIndex * 0.2 }}
                            />
                          )
                        })}
                    </div>
                  </motion.div>
                ))}

                {/* Central Hub */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                  animate={{
                    opacity: assemblyPhase >= 3 ? 1 : 0,
                    scale: assemblyPhase >= 3 ? 1 : 0,
                    rotateY: assemblyPhase >= 3 ? 0 : 180,
                  }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <div className="w-8 h-8 bg-green-500/30 border-2 border-green-400 rounded-full flex items-center justify-center">
                    <motion.div
                      className="w-3 h-3 bg-green-400 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Project Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/50">
                  {project.category}
                </span>
                <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">{project.difficulty}</span>
                <span
                  className={`px-2 py-1 rounded text-xs border ${
                    project.status === "ongoing"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                      : "bg-green-500/20 text-green-400 border-green-500/50"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <h3
                className={`${isCompact ? "text-xl" : "text-2xl"} font-bold mb-2 text-white group-hover:text-green-400 transition-colors`}
              >
                {project.title}
              </h3>
              <p className="text-gray-300 text-sm mb-4">{project.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-green-400" />
                    {project.stars}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-green-400" />
                    {project.contributors}
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/50 hover:bg-green-500/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault()
                      window.open(project.github, "_blank")
                    }}
                  >
                    <GitPullRequest className="w-3 h-3" />
                    Contribute
                  </motion.button>
                  <Github className="w-4 h-4 text-gray-400 hover:text-green-400 transition-colors" />
                  {project.demo && (
                    <ExternalLink className="w-4 h-4 text-gray-400 hover:text-green-400 transition-colors" />
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hologram Scan Lines */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "linear-gradient(0deg, transparent 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)",
                "linear-gradient(0deg, transparent 20%, rgba(34, 197, 94, 0.1) 70%, transparent 100%)",
                "linear-gradient(0deg, transparent 40%, rgba(34, 197, 94, 0.1) 90%, transparent 100%)",
                "linear-gradient(0deg, transparent 60%, rgba(34, 197, 94, 0.1) 100%, transparent 100%)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ opacity: isHovered ? 0.3 : 0 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}
