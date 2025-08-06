'use client'

import { useEffect, useState } from 'react'

interface TrailPoint {
  x: number
  y: number
  id: number
}

export function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([])

  useEffect(() => {
    let animationId: number

    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      }

      setTrail(prev => [...prev.slice(-8), newPoint])
    }

    const animate = () => {
      setTrail(prev => prev.filter(point => Date.now() - point.id < 1000))
      animationId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((point, index) => {
        const age = Date.now() - point.id
        const opacity = Math.max(0, 1 - age / 1000)
        const scale = Math.max(0.1, 1 - age / 1000)
        const colors = ['#0B874F', '#4A90E2', '#E94B3C', '#F5A623']
        const color = colors[index % colors.length]

        return (
          <div
            key={point.id}
            className="absolute w-3 h-3 rounded-full blur-sm"
            style={{
              left: point.x - 6,
              top: point.y - 6,
              backgroundColor: color,
              opacity: opacity * 0.6,
              transform: `scale(${scale})`,
              transition: 'opacity 0.1s ease-out'
            }}
          />
        )
      })}
    </div>
  )
}
