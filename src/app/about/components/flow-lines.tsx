"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type FlowLinesProps = {
  count?: number
}

/**
 * Right-strip (10vw) neon lines:
 * - Constrained to the rightmost 10vw via clipPath and amplitude limits.
 * - Slower top-down reveal.
 * - Continuous traveling motion synchronized with scroll across the entire page.
 * - About one rotation per viewport/page.
 * - All four lines take distinct paths (no strict pairing), with subtle per-line differences.
 * - Keeps existing opacity.
 */
export default function FlowLines({ count = 4 }: FlowLinesProps = { count: 4 }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [docHeight, setDocHeight] = useState<number>(1000)
  const [width, setWidth] = useState<number>(1200)
  const [vh, setVh] = useState<number>(800)
  const morphST = useRef<any>(null) // Declare morphST variable

  // Track total document height and viewport width/height
  useEffect(() => {
    const update = () => {
      const h = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight,
      )
      setDocHeight(h)
      setWidth(window.innerWidth || 1200)
      setVh(window.innerHeight || 800)
      ScrollTrigger.refresh()
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(document.documentElement)
    window.addEventListener("resize", update)
    window.addEventListener("load", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
      window.removeEventListener("load", update)
    }
  }, [])

  // Helper: compute N paths for given phase (for traveling wave morph)
  const computePaths = (phase: number) => {
    const H = Math.max(docHeight, vh, 1000)
    const W = Math.max(width, 1200)

    // Right strip geometry (10vw)
    const stripLeft = W * 0.9
    const stripWidth = Math.max(80, W * 0.1) // ensure a minimum width for tiny viewports
    const cx = stripLeft + stripWidth / 2

    // amplitude limited to the strip
    const maxAmp = stripWidth / 2 - 6 // leave a few px margin for stroke
    const baseAmp = Math.max(10, Math.min(maxAmp, stripWidth * 0.45))

    // sampling resolution along height
    const steps = Math.max(220, Math.floor(H / 12))
    const dy = H / steps

    const makePath = (idx: number) => {
      // Distinct per-line phase/frequency/twist (no strict mirroring)
      const phaseShift = (idx * Math.PI) / 3.2 // distribute around ~180-220°
      const amp = Math.min(maxAmp, baseAmp * (0.88 + 0.1 * idx))
      const freq = 0.98 + idx * 0.08 // main oscillation
      const twist = 1.55 + idx * 0.12 // secondary harmonic (adds "helix" feel)

      let y = 0
      const t0 = 0
      const x0 =
        cx +
        amp * 0.68 * Math.sin(2 * Math.PI * freq * t0 + phase + phaseShift) +
        amp * 0.34 * Math.sin(2 * Math.PI * twist * t0 - 0.6 * phase + phaseShift * 0.7)

      let d = `M ${x0},0`
      for (let i = 1; i <= steps; i++) {
        y = i * dy
        const t = y / H
        // Traveling wave: phase advances with scroll (phase), producing continuous up/down motion
        const x =
          cx +
          amp * 0.68 * Math.sin(2 * Math.PI * freq * t + phase + phaseShift) +
          amp * 0.34 * Math.sin(2 * Math.PI * twist * t - 0.6 * phase + phaseShift * 0.7)
        d += ` L ${x},${y}`
      }
      return d
    }

    return Array.from({ length: count }, (_, i) => makePath(i))
  }

  // Initial paths (phase = 0)
  const initialPaths = useMemo(() => computePaths(0), [docHeight, width, vh, count])

  useEffect(() => {
    if (!svgRef.current) return
    const ctx = gsap.context(() => {
      const pathEls = gsap.utils.toArray<SVGPathElement>(".dna-line")

      // 1) Slower reveal from the top — over ~1.6 viewports
      pathEls.forEach((p, i) => {
        const len = p.getTotalLength()
        p.style.strokeDasharray = `${len}`
        p.style.strokeDashoffset = `${len}`
        gsap.to(p, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "+=160%", // slower growth span
            scrub: true,
          },
          delay: i * 0.04,
        })
      })

      // 2) Continuous traveling motion across the entire page
      // Roughly one full rotation per viewport/page
      const state = { ph: 0 }
      const setters = pathEls.map((el) => (d: string) => el.setAttribute("d", d))

      // Drive phase from total scroll distance so pins are included.
      const rotationsPerViewport = 1 // ≈ one full rotation per viewport height
      morphST.current = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "max", // include extra scroll from pinned sections
        scrub: true,
        onUpdate: (self) => {
          const max = ScrollTrigger.maxScroll(window)
          const vhLocal = Math.max(1, window.innerHeight || 1)
          const totalRotations = (max / vhLocal) * rotationsPerViewport
          state.ph = self.progress * totalRotations * Math.PI * 2
          const newDs = computePaths(state.ph)
          for (let i = 0; i < setters.length; i++) setters[i](newDs[i])
        },
      })

      // Ensure we re-render immediately after refresh (layout changes, pins, etc.)
      ScrollTrigger.addEventListener("refresh", () => {
        morphST.current?.update()
      })
    }, svgRef)
    return () => {
      morphST.current?.kill()
      ctx.revert()
    }
  }, [docHeight, width, vh, count])

  // Subtle pointer parallax (kept very small so it stays inside 10vw band)
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    let targetX = 0,
      targetY = 0
    let curX = 0,
      curY = 0
    const onMove = (e: PointerEvent) => {
      const vw = window.innerWidth
      const vhLocal = window.innerHeight
      // tiny parallax range to avoid leaving the strip
      targetX = (e.clientX / vw - 0.5) * 2
      targetY = (e.clientY / vhLocal - 0.5) * 2
    }
    const tick = () => {
      curX += (targetX - curX) * 0.06
      curY += (targetY - curY) * 0.06
      wrapper.style.transform = `translate3d(${curX}px, ${curY}px, 0)`
      requestAnimationFrame(tick)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    const id = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(id)
    }
  }, [])

  const H = Math.max(docHeight, vh, 1000)
  const W = Math.max(width, 1200)
  const clipX = W * 0.9
  const clipW = Math.max(80, W * 0.1)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] select-none"
      style={{ height: docHeight }}
    >
      <div ref={wrapperRef} className="h-full w-full will-change-transform">
        <svg ref={svgRef} className="h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <clipPath id="right-10vw-clip">
              <rect x={clipX} y={0} width={clipW} height={H} />
            </clipPath>
            <filter id="glow-dna" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur1" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="neon-dna" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="35%" stopColor="#2dd4bf" />
              <stop offset="70%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          <g clipPath="url(#right-10vw-clip)">
            {initialPaths.map((d, i) => (
              <g key={i} filter="url(#glow-dna)">
                <path
                  className="dna-line"
                  d={d}
                  fill="none"
                  stroke="url(#neon-dna)"
                  strokeWidth={i === 0 ? 8 : 6}
                  opacity={i === 0 ? 0.9 : 0.75} // keep existing opacity
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
