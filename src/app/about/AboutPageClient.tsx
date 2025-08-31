"use client"

import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google"
import Link from "next/link"
import { Suspense } from "react"
import { cn } from "@/lib/utils"
import { Home } from "lucide-react"
// import FlowLines from "./components/flow-lines"
import SmoothScrollProvider from "./components/lenis-provider"
import PhilosophyReveal from "./components/philosophy-reveal"
import TeamScroller from "./components/team-scroller"
import ContributorsWall from "./components/contributors-wall"
import { Button } from "@/components/ui/button"
import ShortTrailCursor from "./components/short-trail-cursor"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-mono",
})

export default function AboutPageClient() {
  return (
    <main className={cn(spaceGrotesk.variable, plexMono.variable, "relative min-h-screen bg-black text-white")}>
      <style>{`
        html,
        body {
          background: #000;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        *::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
          background: transparent;
        }
        .spark-underline {
          position: relative;
          background-image: linear-gradient(currentColor, currentColor);
          background-repeat: no-repeat;
          background-position: 0 100%;
          background-size: 0% 2px;
          transition: background-size 160ms ease-out, color 160ms ease-out;
        }
        .spark-underline:hover {
          background-size: 100% 2px;
        }
      `}</style>

      <SmoothScrollProvider>
        {/* Back to Home Button */}
        <div className="fixed top-6 right-6 z-50">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200 group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-mono">HOME</span>
          </Link>
        </div>

        <div className="relative">
          {/* Background centered neon lines */}
          {/* <FlowLines /> */}
          {/* <ShortTrailCursor /> */}
          {/* Sharp multicolor cursor trail */}
          {/* Magnetic hover for cards/buttons (optional, kept subtle) */}

          <div className="relative z-10">
            {/* Intro */}
            <section
              aria-labelledby="intro-heading"
              className="relative flex min-h-[100svh] items-center px-6 md:px-12 lg:px-16"
            >
              <style>{`
                @keyframes floatY {
                  0%,
                  100% {
                    transform: translateY(0px);
                  }
                  50% {
                    transform: translateY(-10px);
                  }
                }
                .float {
                  animation: floatY 6s ease-in-out infinite;
                }
                .float-delay {
                  animation-delay: 1.2s;
                }
                .float-delay-2 {
                  animation-delay: 2.2s;
                }
              `}</style>
              <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-2">
                <div className="text-left">
                  <h1
                    id="intro-heading"
                    className="font-[var(--font-space-grotesk)] text-balance text-4xl sm:text-5xl md:text-7xl tracking-tight"
                  >
                    <span className="text-white">Open Source,</span>{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent">
                      Open Minds
                    </span>
                  </h1>
                  <p className="mt-6 text-pretty text-base sm:text-lg md:text-xl font-[var(--font-plex-mono)] text-emerald-200/90">
                    We are a college community of maintainers, designers, and tinkerers. We ship in public, learn
                    together, and choose growth and free will over gatekeeping. If you can imagine it, you can fork it.
                  </p>
                  <p className="mt-4 text-emerald-100/90 font-[var(--font-plex-mono)]">
                    From first PRs to core maintainers—our projects span docs, design systems, DX tooling, and campus
                    infrastructure. We mentor, pair, and publish so everyone can climb faster.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      asChild
                      variant="default"
                      className="bg-emerald-500 text-black hover:bg-emerald-400"
                      data-magnetic
                    >
                      <Link href="https://github.com" target="_blank" rel="noreferrer" className="spark-underline">
                        View GitHub
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-emerald-400/50 text-emerald-200 hover:bg-white/5 bg-transparent"
                      data-magnetic
                    >
                      <Link href="https://discord.gg/7HrTYAUpdd" target="_blank" rel="noreferrer" className="spark-underline">
                        Join Discord
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-10 grid grid-cols-3 gap-4">
                    {[
                      { k: "Members", v: "800+" },
                      { k: "Repos", v: "45" },
                      { k: "Contributors", v: "1.2k+" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-emerald-500/20 bg-white/[0.02] p-4 text-center"
                        data-magnetic
                      >
                        <div className="font-[var(--font-space-grotesk)] text-2xl">{s.v}</div>
                        <div className="text-xs font-[var(--font-plex-mono)] text-emerald-200/80">{s.k}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media mosaic */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="float">
                    <div
                      className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-emerald-500/30"
                      data-magnetic
                    >
                      <img
                        src="/about-images/students_collab.jpg"
                        alt="Students collaborating on open-source code"
                        className="h-full w-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div
                      className="float-delay relative aspect-video overflow-hidden rounded-2xl ring-1 ring-emerald-500/30"
                      data-magnetic
                    >
                      <img
                        src="/about-images/terminal_run.jpg"
                        alt="Terminal running tests and builds"
                        className="h-full w-full object-cover"
                      />
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* What is FOSS? */}
            <section
              aria-labelledby="what-is-foss-heading"
              className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-[12vh] md:py-[15vh]"
            >
              <div className="grid gap-10 md:grid-cols-2 md:gap-14 items-center">
                <div>
                  <h2
                    id="what-is-foss-heading"
                    className="font-[var(--font-space-grotesk)] text-3xl sm:text-4xl md:text-5xl"
                  >
                    <span className="spark-underline">What is FOSS?</span>
                  </h2>
                  <p className="mt-4 text-emerald-100/90 font-[var(--font-plex-mono)] leading-relaxed">
                    Free and Open Source Software (FOSS) means anyone can view, use, modify, and share code. It’s a
                    permissionless ecosystem where ideas compound, ownership is distributed, and learning is accelerated
                    through transparency.
                  </p>
                  <ul className="mt-6 grid gap-3 text-emerald-200/90 font-[var(--font-plex-mono)]">
                    <li className="rounded-md border border-emerald-500/20 bg-white/[0.02] px-4 py-3" data-magnetic>
                      • Open licenses empower contribution and remixing.
                    </li>
                    <li className="rounded-md border border-emerald-500/20 bg-white/[0.02] px-4 py-3" data-magnetic>
                      • Transparent roadmaps foster trust and shared purpose.
                    </li>
                    <li className="rounded-md border border-emerald-500/20 bg-white/[0.02] px-4 py-3" data-magnetic>
                      • Community governance and merit-based leadership.
                    </li>
                  </ul>
                </div>
                <div>
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-emerald-500/30"
                    data-magnetic
                  >
                    <img
                      src="/about-images/foss.jpg"
                      alt="Creative depiction of FOSS collaboration and open source principles"
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </section>

            {/* Meet the Team (pinned grid) */}
            <section aria-labelledby="team-heading" className="relative w-full py-[12vh] md:py-[15vh]">
              <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-16">
                <h2
                  id="team-heading"
                  className="font-[var(--font-space-grotesk)] text-3xl sm:text-4xl md:text-5xl mb-8 md:mb-12 spark-underline"
                >
                  Meet the Team
                </h2>
              </div>
              <TeamScroller />
            </section>

            {/* Contributors Wall */}
            <section
              aria-labelledby="contributors-heading"
              className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-[6vh] md:py-[8vh]"
            >
              <h2
                id="contributors-heading"
                className="font-[var(--font-space-grotesk)] text-3xl sm:text-4xl md:text-5xl mb-6 spark-underline"
              >
                Contributors Wall
              </h2>
              <p className="text-emerald-100/80 font-[var(--font-plex-mono)] mb-6">
                Live GitHub contributors from our ecosystem.
              </p>
              <Suspense fallback={<div className="h-40 w-full rounded-xl bg-emerald-900/20" />}>
                <ContributorsWall />
              </Suspense>
            </section>

            {/* Philosophy of FOSS */}
            <section
              aria-labelledby="philosophy-heading"
              className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-[12vh] md:py-[15vh]"
            >
              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  <h2
                    id="philosophy-heading"
                    className="font-[var(--font-space-grotesk)] text-3xl sm:text-4xl md:text-5xl spark-underline"
                  >
                    Philosophy of FOSS
                  </h2>
                  <p className="mt-5 text-emerald-100/90 font-[var(--font-plex-mono)] leading-relaxed">
                    We believe in growth and free will. FOSS is our practice: contribute openly, share generously, and
                    own your learning journey. Code is a commons—our responsibility is to keep it healthy, welcoming,
                    and future‑proof.
                  </p>
                  <p className="mt-4 text-emerald-100/85 font-[var(--font-plex-mono)] leading-relaxed">
                    We align incentives with impact: instead of hoarding knowledge, we ship repeatable patterns, write
                    public docs, and mentor the next generation. We prize clarity, kindness, and momentum.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] p-4" data-magnetic>
                      <h3 className="font-[var(--font-space-grotesk)] text-xl">Agency</h3>
                      <p className="mt-2 text-emerald-200/80 font-[var(--font-plex-mono)]">Fork your path.</p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] p-4" data-magnetic>
                      <h3 className="font-[var(--font-space-grotesk)] text-xl">Mastery</h3>
                      <p className="mt-2 text-emerald-200/80 font-[var(--font-plex-mono)]">Learn by shipping.</p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] p-4" data-magnetic>
                      <h3 className="font-[var(--font-space-grotesk)] text-xl">Community</h3>
                      <p className="mt-2 text-emerald-200/80 font-[var(--font-plex-mono)]">Build in public.</p>
                    </div>
                  </div>
                </div>

                {/* Media column */}
                <div className="grid gap-4">
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-emerald-500/30"
                    data-magnetic
                  >
                    <img
                      src="/about-images/team.jpg"
                      alt="Team collaboration and development in open source"
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </section>

            <div className="h-[12vh]" />
          </div>
        </div>
      </SmoothScrollProvider>
    </main>
  )
}
