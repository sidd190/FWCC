'use client'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 p-8">
      <style jsx>{`
        @keyframes glowPulse {
          0%, 100% {
            text-shadow: 
              0 0 5px #ffffff,
              0 0 10px #ffffff,
              0 0 15px #ffffff,
              0 0 20px #ffffff,
              0 0 25px #ffffff,
              0 0 30px #ffffff,
              0 0 35px #ffffff,
              0 0 40px #ffffff,
              0 0 45px #ffffff,
              0 0 50px #ffffff;
          }
          50% {
            text-shadow: 
              0 0 10px #ffffff,
              0 0 20px #ffffff,
              0 0 30px #ffffff,
              0 0 40px #ffffff,
              0 0 50px #ffffff,
              0 0 60px #ffffff,
              0 0 70px #ffffff,
              0 0 80px #ffffff,
              0 0 90px #ffffff,
              0 0 100px #ffffff;
          }
        }
        
        .ufc-glow {
          animation: glowPulse 3s ease-in-out infinite;
          -webkit-text-stroke: 2px #ffffff;
          text-stroke: 2px #ffffff;
        }
      `}</style>
      <div className="text-center">
        {/* Main Title */}
        <h1 className="text-6xl font-black mb-4 tracking-widest ufc-glow" style={{ 
          color: '#0B874F',
          fontFamily: '"IBM Plex Mono", monospace',
          letterSpacing: '0.2em'
        }}>
          UFC
        </h1>
        <p className="text-xl font-mono font-medium" style={{ 
          color: '#FFFFFF',
          textShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.4)',
          opacity: 1
        }}>
          We serve no proprietary material, only the flow of free information.
        </p>
        
        {/* GitHub Feed and Join button - top right */}
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <span className="text-sm font-mono" style={{ color: '#F5A623' }}>GitHub Feed</span>
          <button 
            className="px-6 py-2 rounded font-mono text-sm font-medium transition-all duration-300 border-2 hover:scale-105"
            style={{ 
              backgroundColor: '#0B874F', 
              color: '#000000',
              borderColor: '#0B874F',
              boxShadow: '0 0 10px rgba(11, 135, 79, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#000000'
              e.target.style.color = '#0B874F'
              e.target.style.boxShadow = '0 0 20px rgba(11, 135, 79, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#0B874F'
              e.target.style.color = '#000000'
              e.target.style.boxShadow = '0 0 10px rgba(11, 135, 79, 0.3)'
            }}
          >
            Join the Flow
          </button>
        </div>
      </div>
    </header>
  )
}
