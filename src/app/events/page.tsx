"use client"

import { motion } from "framer-motion"
import { Home } from "lucide-react"
import Link from "next/link"
import PageTransition from "../Components/page-transition"

export default function EventsPage() {
  return (
    <PageTransition>
      <div className="bg-black text-white min-h-screen">
        {/* Back to Home Button */}
        <div className="fixed top-6 left-6 z-50">
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:text-green-400 transition-colors font-bold rounded-lg"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              HOME
            </motion.div>
          </Link>
        </div>

        {/* Coming Soon Section */}
        <section className="relative h-screen flex items-center justify-center">
          <motion.div
            className="absolute inset-0 z-0"
            style={{
              background: "radial-gradient(circle at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent px-8 overflow-visible tracking-wider" style={{ fontFamily: "var(--font-orbitron)" }}>
                EVENTS
              </h1>
              <p className="text-4xl md:text-6xl font-bold text-white mb-8">
                Coming Soon...
              </p>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                We're working on something amazing. Stay tuned for exciting events and community gatherings.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
