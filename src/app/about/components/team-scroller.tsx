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
  description: string
}

const defaultMembers: Member[] = [
  { 
    name: "Siddharth Bansal", 
    role: "President", 
    img: "/team-images/siddharth.jpg",
    description: "Leading the vision and strategic direction of our open source community with passion and innovation."
  },
  { 
    name: "Dhruv Sharma", 
    role: "Tech Lead", 
    img: "/team-images/dhruv.jpg",
    description: "Overseeing technical direction and ensuring high-quality development standards across all projects."
  },
  { 
    name: "Manandeep Singh", 
    role: "Co Tech Lead", 
    img: "/team-images/manandeep.jpg",
    description: "Supporting technical leadership and mentoring developers in cutting-edge technologies."
  },
  { 
    name: "Avish", 
    role: "Co Tech Lead", 
    img: "/team-images/avish.jpg",
    description: "Contributing technical expertise and helping shape the future of our development practices."
  },
  { 
    name: "Ojaswini Fauzdar", 
    role: "PR Lead", 
    img: "/team-images/ojaswini.jpg",
    description: "Managing public relations and building strong connections with the broader developer community."
  },
  { 
    name: "Ananya Sharma", 
    role: "External Affairs Lead", 
    img: "/team-images/ananya.jpg",
    description: "Forging partnerships and representing our community in external collaborations and events."
  },
  { 
    name: "Trisha Verma", 
    role: "Core Member", 
    img: "/team-images/trisha.jpg",
    description: "Contributing to core development initiatives and supporting community growth through active participation."
  },
  { 
    name: "Prithvi Kaushik", 
    role: "Core Member", 
    img: "/team-images/prithvi .jpg",
    description: "Playing a vital role in core project development and helping maintain high standards across the community."
  },
  { 
    name: "Moksh", 
    role: "Core Member", 
    img: "/team-images/moksh.jpg",
    description: "Supporting core initiatives and contributing to the technical foundation of our open source projects."
  },
  { 
    name: "Piyush Bansal", 
    role: "Core Member", 
    img: "/team-images/piyush.jpg",
    description: "Collaborating closely with the President to drive community initiatives and foster collaboration."
  },
  { 
    name: "Vikram Aditya Verma", 
    role: "Anonymous Member", 
    img: "/team-images/vikram.jpg",
    description: "A digital phantom who exists in the shadows of code. Some say they've seen traces of his work in the commit history, but his true identity remains shrouded in mystery. The legend grows with each bug fix."
  },
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
            <article 
              key={i} 
              className={cardClass} 
              aria-label={`${m.name}, ${m.role}`} 
              data-magnetic
              onClick={() => {
                
                if (m.name === "Vikram Aditya Verma") {
                  window.open("https://x.com/ViXkrm", "_blank", "noopener,noreferrer")
                }
                
                if (m.name === "Siddharth Bansal") {
                  window.open("https://x.com/Sidd190b", "_blank", "noopener,noreferrer")
                }
              }}
              style={{ cursor: (m.name === "Vikram Aditya Verma" || m.name === "Siddharth Bansal") ? "pointer" : "default" }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={m.img}
                  alt={`${m.name} — ${m.role}`}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 3}
                  unoptimized
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
              </div>
              <div className="p-5">
                <h3 
                  className={`font-[var(--font-space-grotesk)] text-xl md:text-2xl font-semibold transition-colors duration-300 ${
                    (m.name === "Vikram Aditya Verma" || m.name === "Siddharth Bansal")
                      ? "group-hover:text-emerald-400 cursor-pointer" 
                      : ""
                  }`}
                >
                  {m.name}
                </h3>
                <p className="font-[var(--font-plex-mono)] text-emerald-200/90 text-sm md:text-base mb-2">{m.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{m.description}</p>
                {(m.name === "Vikram Aditya Verma" || m.name === "Siddharth Bansal") && (
                  <p className="text-emerald-400/40 text-xs mt-2 font-[var(--font-plex-mono)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    click here...
                  </p>
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-emerald-400/0 transition-colors duration-300 group-hover:ring-emerald-400/40" />
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
