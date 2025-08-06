'use client'

import { useState } from 'react'

export function TerminalOverlay() {
  const [input, setInput] = useState('')
  const [lines] = useState([
    '> Initializing OSDC Coreverse...',
    '> Connection established',
    '> Loading global OSC data...',
    '> System ready. Type commands below:'
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Command:', input)
    setInput('')
  }

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-6xl px-8">
      <div 
        className="rounded-xl p-8 font-mono backdrop-blur-xl border-2"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.4)', 
          borderColor: '#0B874F',
          boxShadow: '0 0 50px rgba(11, 135, 79, 0.3), inset 0 0 30px rgba(11, 135, 79, 0.05)'
        }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2" style={{ borderColor: '#0B874F' }}>
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#E94B3C' }}></div>
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F5A623' }}></div>
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#0B874F' }}></div>
          </div>
          <span className="ml-4 text-base font-bold" style={{ color: '#4A90E2' }}>
            /osdc/community/activity_feed
          </span>
        </div>
        
        {/* Terminal content */}
        <div className="space-y-3 mb-6">
          {lines.map((line, index) => (
            <div key={index} className="text-base" style={{ color: '#0B874F' }}>
              {line}
            </div>
          ))}
        </div>

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-base mr-3 font-bold" style={{ color: '#F5A623' }}>{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-base font-mono border-b-2 pb-1 transition-colors duration-300"
            style={{ 
              color: '#FFFFFF',
              borderColor: '#333333'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4A90E2'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#333333'
            }}
            placeholder="Enter command..."
            autoFocus
          />
        </form>
      </div>
    </div>
  )
}
