'use client'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 p-8">
      <div className="text-center">
        {/* Main Title */}
        <h1 className="text-6xl font-bold mb-4 tracking-wider font-mono" style={{ color: '#0B874F' }}>
          UFC
        </h1>
        <p className="text-xl opacity-90 font-mono" style={{ color: '#4A90E2' }}>
          We serve no proprietary material, only the flow of free information.
        </p>
        
        {/* GitHub Feed and Join button - top right */}
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <span className="text-sm font-mono" style={{ color: '#F5A623' }}>GitHub Feed</span>
          <button 
            className="px-6 py-2 rounded font-mono text-sm font-medium transition-all duration-300 border-2 hover:scale-105"
            style={{ 
              backgroundColor: '#E94B3C', 
              color: '#000000',
              borderColor: '#E94B3C',
              boxShadow: '0 0 10px rgba(233, 75, 60, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#000000'
              e.target.style.color = '#E94B3C'
              e.target.style.boxShadow = '0 0 20px rgba(233, 75, 60, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#E94B3C'
              e.target.style.color = '#000000'
              e.target.style.boxShadow = '0 0 10px rgba(233, 75, 60, 0.3)'
            }}
          >
            Join the Flow
          </button>
        </div>
      </div>
    </header>
  )
}
