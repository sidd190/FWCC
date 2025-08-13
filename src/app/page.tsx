import GlobeComponent from "./Components/Globe";
import { Header } from "./Components/header";
import { TerminalOverlay } from "./Components/terminalOverlay";
import { BackgroundElements } from "./Components/backgroundElements";
import { CursorTrail } from "./Components/cursorTrail";
import AboutPageClient from "./about/AboutPageClient";

export default function Page() {
  return (
    <>
      <div 
        className="relative w-full h-screen overflow-hidden font-mono"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Cursor Trail Effect */}
        <CursorTrail />

        {/* Background Elements */}
        <BackgroundElements />

        {/* Globe Container - 25% Larger */}
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="relative">
            {/* Constant Glow Effect - Adjusted for larger globe */}
            <div 
              className="absolute w-[900px] h-[900px] rounded-full blur-3xl opacity-25"
              style={{ 
                backgroundColor: '#0B874F',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            ></div>
            {/* Globe Container - 25% increase: 600px -> 750px */}
            <div className="relative w-[750px] h-[750px] flex items-center justify-center">
              <GlobeComponent />
            </div>
          </div>
        </div>

        {/* UI Components */}
        <Header />
        <TerminalOverlay />

        {/* Legend - Updated with new color scheme */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-20">
          <div 
            className="rounded-lg p-4 font-mono backdrop-blur-md border"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.3)', 
              borderColor: '#0B874F',
              boxShadow: '0 0 20px rgba(11, 135, 79, 0.2)'
            }}
          >
            <h4 className="text-sm font-bold mb-3" style={{ color: '#F5A623' }}>
              OSC Levels
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#0B874F' }}></div>
                <span style={{ color: '#FFFFFF' }}>Very High (500k+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#2D8F5A' }}></div>
                <span style={{ color: '#FFFFFF' }}>High (200k-500k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#4A6741' }}></div>
                <span style={{ color: '#FFFFFF' }}>Medium (80k-200k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#F5A623' }}></div>
                <span style={{ color: '#FFFFFF' }}>Low-Med (30k-80k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#E94B3C' }}></div>
                <span style={{ color: '#FFFFFF' }}>Low (&lt;30k)</span>
              </div>  
            </div>
          </div>
        </div>
      </div>
      {/* <AboutPageClient></AboutPageClient>  */}
    </>
  );
}
