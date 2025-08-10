"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import Lenis from "@studio-freight/lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Props = {
  children?: React.ReactNode
}

/**
 * Provides smooth scrolling using Lenis and syncs it with GSAP ScrollTrigger.
 * Respects prefers-reduced-motion.
 */
export default function SmoothScrollProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const lenis = new Lenis({
      duration: prefersReduced ? 0.6 : 1.2,
      smoothWheel: !prefersReduced,
      smoothTouch: !prefersReduced,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      syncTouch: true,
      gestureOrientation: "vertical",
    })
    lenisRef.current = lenis

    // tie into GSAP
    function onScroll() {
      ScrollTrigger.update()
    }
    lenis.on("scroll", onScroll)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Refresh on resize/content changes
    const r = () => ScrollTrigger.refresh()
    window.addEventListener("resize", r)

    return () => {
      window.removeEventListener("resize", r)
      lenis.off("scroll", onScroll)
      lenis.destroy()
      gsap.ticker.lagSmoothing(1000, 16)
    }
  }, [])

  return <>{children}</>
}
