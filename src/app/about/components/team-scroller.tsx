"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

type Member = {
  name: string
  role: string
  img: string
}

const defaultMembers: Member[] = [
  { name: "Ava Patel", role: "Lead Maintainer", img: "/placeholder.svg?height=600&width=600" },
  { name: "Liam Chen", role: "DX Engineer", img: "/placeholder.svg?height=600&width=600" },
  { name: "Maya Singh", role: "Community Lead", img: "/placeholder.svg?height=600&width=600" },
  { name: "Noah Kim", role: "UI/UX", img: "/placeholder.svg?height=600&width=600" },
  { name: "Sofia Alvarez", role: "Docs & Education", img: "/placeholder.svg?height=600&width=600" },
  { name: "Ethan Brooks", role: "Infra & CI", img: "/placeholder.svg?height=600&width=600" },
]

type Props = {
  members?: Member[]
}

/**
 * Fixed/pinned grid on desktop; simple grid on mobile.
 */
export default function TeamScroller({ members = defaultMembers }: Props = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [isDesktop, setIsDesktop] = useState<boolean>(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (!isDesktop) return
    const container = containerRef.current
    const grid = gridRef.current
    if (!container || !grid) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom+=120% top",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })
      tl.fromTo(
        grid,
        { opacity: 0.2, scale: 0.98, y: 20 },
        { opacity: 1, scale: 1, y: 0, ease: "power2.out", duration: 0.6 },
        0,
      )
    }, container)

    return () => ctx.revert()
  }, [isDesktop])

  const cardClass =
    "group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-white/[0.02] ring-1 ring-white/[0.02] hover:ring-emerald-400/20 transition-all"

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={gridRef}
        className={cn("mx-auto max-w-7xl px-6 md:px-12 lg:px-16", isDesktop ? "min-h-[80vh] flex items-center" : "")}
      >
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <article key={i} className={cardClass} aria-label={`${m.name}, ${m.role}`} data-magnetic>
              <div className="relative aspect-[4/3]">
                <Image
                  src={m.img || "/placeholder.svg?height=600&width=600"}
                  alt={`${m.name} — ${m.role}`}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 3}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-[var(--font-space-grotesk)] text-xl md:text-2xl font-semibold">{m.name}</h3>
                <p className="font-[var(--font-plex-mono)] text-emerald-200/90 text-sm md:text-base">{m.role}</p>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-emerald-400/0 transition-colors duration-300 group-hover:ring-emerald-400/40" />
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
