'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TeaserMatrixPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [matrixReady, setMatrixReady] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalText, setTerminalText] = useState('')
  const [showStats, setShowStats] = useState(false)
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Matrix rain effect
    const canvas = document.getElementById('matrix') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const matrixChars = 'НЕБАЧИВСТАТИСТИКАМОТОЦИКЛБЕЗПЕКА0123456789НЕБАЧИВ'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    function drawMatrix() {
      if (!ctx) return
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#00ff41'
      ctx.font = fontSize + 'px Courier New'

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(drawMatrix, 35)
    setTimeout(() => setMatrixReady(true), 1000)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (showTerminal) {
      const text = `> Initializing NEBACHIV.exe...
> Loading safety protocols...
> Analyzing 921 crash patterns...
> Calculating survival probability...
> WARNING: 37% of drivers don't see you
> STATUS: Ready for training
> ENTER EMAIL TO CONTINUE_`
      
      let index = 0
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setTerminalText(text.substring(0, index + 1))
          index++
        } else {
          clearInterval(typeInterval)
          setTimeout(() => setShowStats(true), 500)
        }
      }, 30)

      return () => clearInterval(typeInterval)
    }
  }, [showTerminal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'teaser_matrix',
          metadata: { 
            page: 'teaser_matrix',
            timestamp: new Date().toISOString()
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setWaitlistPosition(data.position || 127)
        setSubmitted(true)
      }
    } catch (err) {
      } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      {/* Matrix background */}
      <canvas id="matrix" className="fixed top-0 left-0 w-full h-full z-0"></canvas>

      {/* Main Content */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center px-4 transition-opacity duration-2000 ${matrixReady ? 'opacity-100' : 'opacity-0'}`}>
        
        {!showTerminal ? (
          // Initial screen
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-black mb-8 glitch-text">
              NEBACHIV
            </h1>
            <p className="text-2xl mb-12 text-green-300">
              СИСТЕМА ВИЖИВАННЯ ДЛЯ МОТОЦИКЛІСТІВ
            </p>
            <button
              onClick={() => setShowTerminal(true)}
              className="bg-green-400 text-black px-8 py-4 font-bold text-xl hover:bg-green-300 transition-colors animate-pulse"
            >
              &gt; ENTER_
            </button>
          </div>
        ) : (
          // Terminal screen
          <div className="w-full max-w-2xl">
            <div className="bg-black/80 border border-green-400 p-8 font-mono backdrop-blur-sm">
              {/* Terminal header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-green-400">
                <span className="text-green-400">&gt; nebachiv_v2.exe</span>
                <span className="text-green-400 text-sm">SYSTEM ACTIVE</span>
              </div>

              {/* Terminal output */}
              <div className="mb-8 text-green-300 text-sm whitespace-pre-wrap">
                {terminalText}
              </div>

              {/* Stats */}
              {showStats && !submitted && (
                <div className="mb-8 grid grid-cols-3 gap-4 text-center opacity-0 animate-fade-in">
                  <div className="border border-green-400 p-4">
                    <div className="text-2xl font-bold">698</div>
                    <div className="text-xs text-green-300">RIDERS_SAVED</div>
                  </div>
                  <div className="border border-green-400 p-4">
                    <div className="text-2xl font-bold">89%</div>
                    <div className="text-xs text-green-300">RISK_REDUCED</div>
                  </div>
                  <div className="border border-green-400 p-4">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-green-300">FATAL_CRASHES</div>
                  </div>
                </div>
              )}

              {/* Email form */}
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="text-green-400 text-sm block mb-2">
                      &gt; ENTER_EMAIL:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="_"
                      className="w-full p-3 bg-black border border-green-400 text-green-400 font-mono focus:outline-none focus:border-green-300"
                      autoFocus
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-4 bg-green-400 text-black font-bold hover:bg-green-300 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'PROCESSING...' : 'EXECUTE'}
                  </button>
                </form>
              ) : (
                // Success state
                <div className="text-center">
                  <div className="text-green-400 text-6xl mb-4">✓</div>
                  <p className="text-green-400 text-xl mb-2">ACCESS_GRANTED</p>
                  <p className="text-green-300 mb-4">Position in queue: #{waitlistPosition}</p>
                  <p className="text-green-300 text-sm mb-6">Check your email for activation link</p>
                  <button
                    onClick={() => router.push('/register')}
                    className="text-green-400 hover:text-green-300 underline"
                  >
                    &gt; PROCEED_TO_FULL_ACCESS
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-green-400 text-green-300 text-xs">
                <p>НЕ СТАНЬ СТАТИСТИКОЮ. НЕ ПОКЛАДАЙСЯ НА ВДАЧУ.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        @keyframes glitch {
          0%, 100% { 
            text-shadow: 
              0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          25% {
            text-shadow: 
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 0, 255, 0.75),
              0.025em 0.05em 0 rgba(255, 0, 0, 0.75);
          }
        }
        
        .glitch-text {
          animation: glitch 1s linear infinite;
        }
      `}</style>
    </div>
  )
}