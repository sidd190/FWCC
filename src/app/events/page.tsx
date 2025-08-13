"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Plus, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import EnhancedButton from "../Components/enhanced-button"
import PageTransition from "../Components/page-transition"

const events = [
  {
    id: 1,
    title: "Open Source Hackathon 2024",
    date: "2024-03-15",
    time: "09:00 AM",
    location: "USAR Campus, Tech Hub",
    attendees: 150,
    category: "Hackathon",
    status: "upcoming",
    description:
      "48-hour intensive hackathon focusing on solving real-world problems with open source solutions. Join developers, designers, and innovators in creating impactful projects.",
    image: "/hackathon-coding-event.png",
    tags: ["React", "Python", "AI/ML", "Blockchain"],
    featured: true,
  },
  {
    id: 2,
    title: "Git & GitHub Mastery Workshop",
    date: "2024-03-08",
    time: "02:00 PM",
    location: "Online & USAR Lab 204",
    attendees: 80,
    category: "Workshop",
    status: "upcoming",
    description:
      "Master version control with hands-on Git and GitHub training. Learn branching, merging, pull requests, and collaborative development workflows.",
    image: "/git-github-workshop-coding.png",
    tags: ["Git", "GitHub", "DevOps", "Collaboration"],
    featured: false,
  },
  {
    id: 3,
    title: "AI in Open Source: Future Perspectives",
    date: "2024-02-28",
    time: "06:00 PM",
    location: "USAR Auditorium",
    attendees: 200,
    category: "Tech Talk",
    status: "completed",
    description:
      "Industry experts discuss the intersection of AI and open source development. Explore how AI is transforming software development and community collaboration.",
    image: "/ai-tech-talk.png",
    tags: ["AI", "Machine Learning", "Open Source", "Future Tech"],
    featured: false,
  },
  {
    id: 4,
    title: "Linux System Administration Bootcamp",
    date: "2024-03-22",
    time: "10:00 AM",
    location: "USAR Computer Lab",
    attendees: 60,
    category: "Bootcamp",
    status: "upcoming",
    description:
      "Comprehensive Linux administration training covering server management, automation, security, and performance optimization for production environments.",
    image: "/linux-sysadmin-servers.png",
    tags: ["Linux", "DevOps", "System Admin", "Automation"],
    featured: false,
  },
  {
    id: 5,
    title: "Web3 & Blockchain Development Summit",
    date: "2024-04-05",
    time: "09:00 AM",
    location: "USAR Innovation Center",
    attendees: 120,
    category: "Summit",
    status: "upcoming",
    description:
      "Explore decentralized applications and blockchain technology with hands-on workshops. Build smart contracts, DeFi protocols, and NFT marketplaces.",
    image: "/blockchain-web3-cryptocurrency-development.png",
    tags: ["Blockchain", "Web3", "Smart Contracts", "DeFi"],
    featured: true,
  },
  {
    id: 6,
    title: "Open Source Contribution Drive",
    date: "2024-02-15",
    time: "11:00 AM",
    location: "USAR Library",
    attendees: 90,
    category: "Community",
    status: "completed",
    description:
      "Collaborative session to contribute to major open source projects. Learn best practices for code reviews, documentation, and community engagement.",
    image: "/open-source-collaboration.png",
    tags: ["Open Source", "Contribution", "Community", "Learning"],
    featured: false,
  },
]

export default function EventsPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isSliderPinned, setIsSliderPinned] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  useEffect(() => {
    const handleScroll = () => {
      if (!sliderRef.current) return

      const rect = sliderRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.top <= 0 && rect.bottom > windowHeight) {
        setIsSliderPinned(true)

        const progress = Math.abs(rect.top) / (rect.height - windowHeight)
        const slideIndex = Math.floor(progress * events.length)

        if (slideIndex !== currentSlide && slideIndex < events.length) {
          setDirection(slideIndex > currentSlide ? 1 : -1)
          setCurrentSlide(slideIndex)
        }
      } else {
        setIsSliderPinned(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [currentSlide])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentSlide((prevSlide) => {
      if (newDirection === 1) {
        return prevSlide === events.length - 1 ? 0 : prevSlide + 1
      } else {
        return prevSlide === 0 ? events.length - 1 : prevSlide - 1
      }
    })
  }

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  return (
    <PageTransition>
      <div className="bg-black text-white" ref={containerRef}>
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
                Events
              </h1>
              <p className="text-xl text-gray-400 mb-8">Where Innovation Meets Community</p>
              <Link href="/submit/event">
                <EnhancedButton
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold px-8 py-4"
                >
                  <Plus className="w-5 h-5" />
                  Propose Event
                  <ArrowRight className="w-5 h-5" />
                </EnhancedButton>
              </Link>
            </motion.div>
          </div>
        </section>

        <section ref={sliderRef} className="relative" style={{ height: `${events.length * 100}vh` }}>
          <div
            className={`${isSliderPinned ? "fixed" : "absolute"} top-0 left-0 w-full h-screen flex items-center justify-center z-10`}
          >
            <div className="w-full max-w-7xl mx-auto px-6">
              <div className="relative h-[80vh] overflow-hidden rounded-2xl border border-green-500/20">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.4 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x)
                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1)
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1)
                      }
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  >
                    <Link href={`/events/${events[currentSlide].id}`}>
                      <div className="relative h-full bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-2xl overflow-hidden group">
                        <div className="absolute inset-0">
                          <img
                            src={events[currentSlide].image || "/placeholder.svg"}
                            alt={events[currentSlide].title}
                            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        </div>

                        <div className="relative z-10 h-full flex items-end p-8">
                          <div className="w-full">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/50">
                                {events[currentSlide].category}
                              </span>
                              <span className="px-3 py-1 bg-gray-800/60 text-gray-300 rounded-full text-sm">
                                {events[currentSlide].status}
                              </span>
                            </div>

                            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white group-hover:text-green-400 transition-colors">
                              {events[currentSlide].title}
                            </h3>

                            <p className="text-gray-300 mb-8 text-xl leading-relaxed max-w-4xl">
                              {events[currentSlide].description}
                            </p>

                            <div className="flex flex-wrap gap-8 text-base text-gray-400">
                              <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-green-400" />
                                {new Date(events[currentSlide].date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-green-400" />
                                {events[currentSlide].time}
                              </div>
                              <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-green-400" />
                                {events[currentSlide].location}
                              </div>
                              <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-green-400" />
                                {events[currentSlide].attendees} attendees
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full border border-green-500/30 hover:border-green-500/60 transition-all"
                  onClick={() => paginate(-1)}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full border border-green-500/30 hover:border-green-500/60 transition-all"
                  onClick={() => paginate(1)}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                  {events.map((_, index) => (
                    <button
                      key={index}
                      className={`w-4 h-4 rounded-full transition-all ${
                        index === currentSlide ? "bg-green-500 scale-125" : "bg-gray-600 hover:bg-gray-500"
                      }`}
                      onClick={() => {
                        setDirection(index > currentSlide ? 1 : -1)
                        setCurrentSlide(index)
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center mt-8">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="text-green-400 text-sm"
                >
                  Scroll to navigate through events
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* All Events Grid */}
        <section className="py-20 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-green-400"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              All Events
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/events/${event.id}`}>
                    <motion.div
                      className="group h-full overflow-hidden rounded-xl bg-gray-900/50 border border-green-500/20 hover:border-green-500/50 transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/50">
                            {event.category}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === "upcoming"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-green-400 transition-colors">
                          {event.title}
                        </h3>

                        <div className="space-y-2 text-xs text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-green-400" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-green-400" />
                            {event.location}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {event.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-800/60 text-gray-400 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
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
