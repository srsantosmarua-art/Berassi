'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Professional } from '@/lib/supabase'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const GOLD = '#C9A84C'
const GOLD_DIM = 'rgba(201,168,76,0.22)'
const GOLD_MID = 'rgba(201,168,76,0.55)'
const GOLD_BRIGHT = 'rgba(201,168,76,0.9)'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface CardProps {
  pro: Professional
  onClick: () => void
}

// ─────────────────────────────────────────────
// ProfessionalCard
// ─────────────────────────────────────────────
function ProfessionalCard({ pro, onClick }: CardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        // Sizing – responsive via container query / clamp
        flex: '0 0 clamp(220px, 28vw, 300px)',
        height: 'clamp(320px, 45vw, 460px)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 14,
        cursor: 'pointer',
        border: hovered
          ? `1px solid ${GOLD_BRIGHT}`
          : `1px solid rgba(201,168,76,0.18)`,
        background: 'linear-gradient(170deg, #18150e 0%, #0a0800 100%)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        transition:
          'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered
          ? `0 32px 72px rgba(0,0,0,0.75), 0 0 0 1px rgba(201,168,76,0.28), 0 0 40px rgba(201,168,76,0.12)`
          : '0 8px 32px rgba(0,0,0,0.55)',
        // Ensure last card never gets clipped in scroll container
        scrollSnapAlign: 'start',
      }}
    >
      {/* Photo */}
      {pro.photo_url && (
        <Image
          src={pro.photo_url}
          alt={pro.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover"
          style={{
            opacity: hovered ? 0.7 : 0.5,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}

      {/* Ambient golden radial */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hovered
            ? 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.16) 0%, transparent 65%)'
            : 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 65%)',
          transition: 'background 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.12) 52%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Initial watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(80px, 14vw, 120px)',
            fontWeight: 300,
            lineHeight: 1,
            color: hovered ? 'rgba(201,168,76,0.48)' : GOLD_DIM,
            transition: 'color 0.4s ease',
            userSelect: 'none',
          }}
        >
          {pro.name[0]}
        </span>
      </div>

      {/* Bottom shimmer on hover */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: hovered
            ? 'linear-gradient(90deg, transparent, rgba(201,168,76,0.85), transparent)'
            : 'transparent',
          transition: 'background 0.4s ease',
        }}
      />

      {/* Text content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '0 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          height: '100%',
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: 600,
            lineHeight: 1.2,
            color: hovered ? '#E8CF72' : '#F0EBE0',
            transition: 'color 0.4s ease',
            margin: 0,
            marginBottom: 10,
            letterSpacing: '0.02em',
          }}
        >
          {pro.name}
        </h2>
        <div
          style={{
            height: 1,
            width: hovered ? 52 : 30,
            background: hovered ? GOLD_BRIGHT : GOLD_MID,
            transition: 'width 0.4s ease, background 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Arrow Button
// ─────────────────────────────────────────────
function ArrowButton({
  direction,
  onClick,
  hidden,
}: {
  direction: 'left' | 'right'
  onClick: () => void
  hidden: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Anterior' : 'Próximo'}
      style={{
        position: 'absolute',
        top: '50%',
        [direction === 'left' ? 'left' : 'right']: -20,
        transform: 'translateY(-50%)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: `1px solid ${GOLD_MID}`,
        background: 'rgba(8,6,2,0.75)',
        color: GOLD,
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
        transition: 'opacity 0.3s ease, background 0.25s ease, border-color 0.25s ease',
        outline: 'none',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'rgba(201,168,76,0.15)'
        el.style.borderColor = GOLD_BRIGHT
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'rgba(8,6,2,0.75)'
        el.style.borderColor = GOLD_MID
      }}
    >
      {direction === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  )
}

// ─────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────
function GoldDivider() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        margin: '18px 0',
      }}
    >
      <div style={{ height: 1, width: 60, background: GOLD_MID }} />
      <div
        style={{
          width: 7,
          height: 7,
          transform: 'rotate(45deg)',
          background: GOLD,
          boxShadow: `0 0 8px ${GOLD_MID}`,
          flexShrink: 0,
        }}
      />
      <div style={{ height: 1, width: 60, background: GOLD_MID }} />
    </div>
  )
}

// ─────────────────────────────────────────────
// Loading spinner
// ─────────────────────────────────────────────
function GoldSpinner() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: `2px solid rgba(201,168,76,0.2)`,
        borderTopColor: GOLD,
        animation: 'spin 0.9s linear infinite',
        marginTop: 80,
      }}
    />
  )
}

// ─────────────────────────────────────────────
// Home
// ─────────────────────────────────────────────
export default function Home() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const router = useRouter()
  const trackRef = useRef<HTMLDivElement>(null)

  // ── Fetch ──
  useEffect(() => {
    async function fetchProfessionals() {
      const { data, error } = await supabase.from('professionals').select('*')
      console.log('DATA:', data)
      console.log('ERROR:', error)
      if (data) setProfessionals(data)
      setLoading(false)
    }
    fetchProfessionals()
  }, [])

  // ── Sync arrow visibility with scroll position ──
  const syncArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const threshold = 8
    setAtStart(el.scrollLeft <= threshold)
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - threshold)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    syncArrows()
    el.addEventListener('scroll', syncArrows, { passive: true })
    return () => el.removeEventListener('scroll', syncArrows)
  }, [professionals, syncArrows])

  // ── Arrow scroll ──
  const scrollBy = useCallback((dir: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    const amount = el.clientWidth * 0.75
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }, [])

  // ── Wheel → horizontal scroll (desktop) ──
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return // let natural horizontal pass
      e.preventDefault()
      el.scrollBy({ left: e.deltaY * 1.2, behavior: 'auto' })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // ── Mouse drag (desktop) ──
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let dragging = false
    let startX = 0
    let scrollStart = 0

    const down = (e: MouseEvent) => {
      dragging = true
      startX = e.pageX
      scrollStart = el.scrollLeft
      el.style.cursor = 'grabbing'
      el.style.userSelect = 'none'
    }
    const move = (e: MouseEvent) => {
      if (!dragging) return
      const delta = startX - e.pageX
      el.scrollLeft = scrollStart + delta
    }
    const up = () => {
      dragging = false
      el.style.cursor = 'grab'
      el.style.userSelect = ''
    }

    el.addEventListener('mousedown', down)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => {
      el.removeEventListener('mousedown', down)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Hide scrollbar cross-browser */
        .berassi-track {
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          overflow-x: auto;
          scroll-behavior: smooth;
          cursor: grab;
        }
        .berassi-track::-webkit-scrollbar { display: none; }
        .berassi-track { -ms-overflow-style: none; scrollbar-width: none; }

        /* Responsive card column count via gap */
        @media (max-width: 600px) {
          .berassi-track { scroll-snap-type: x mandatory; }
        }
      `}</style>

      <main
        style={{
          minHeight: '100svh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflow: 'hidden',
          userSelect: 'none',
          backgroundImage: "url('/marble-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.72)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Content wrapper */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* ── Logo ── */}
          <div
            style={{
              marginTop: 'clamp(48px, 8vw, 96px)',
              marginBottom: 0,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'fadeInUp 0.8s ease both',
            }}
          >
            {/* Glow behind logo */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 320,
                height: 220,
                background:
                  'radial-gradient(ellipse at center, rgba(201,168,76,0.32) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Logo box */}
            <div
              style={{
                position: 'relative',
                padding: 18,
                background: 'rgba(36,33,28,0.92)',
                border: `1px solid rgba(201,168,76,0.3)`,
                boxShadow: '0 0 64px 12px rgba(201,168,76,0.15)',
              }}
            >
              <Image
                src="/logo.png"
                alt="BERASSI"
                width={110}
                height={110}
                priority
                style={{ display: 'block', position: 'relative', zIndex: 1 }}
              />
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{ animation: 'fadeInUp 0.8s 0.15s ease both' }}>
            <GoldDivider />
          </div>

          {/* ── Subtitle ── */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(10px, 1.4vw, 13px)',
              fontWeight: 300,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#C0B89A',
              margin: 0,
              marginBottom: 'clamp(40px, 6vw, 72px)',
              animation: 'fadeInUp 0.8s 0.25s ease both',
            }}
          >
            Escolha o profissional
          </p>

          {/* ── Carousel section ── */}
          {loading ? (
            <GoldSpinner />
          ) : (
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '100vw',
                animation: 'fadeInUp 0.9s 0.35s ease both',
              }}
            >
              {/* Left arrow */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 'clamp(4px, 2vw, 24px)',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  // Hide on mobile
                  display: 'flex',
                }}
              >
                <button
                  onClick={() => scrollBy('left')}
                  aria-label="Anterior"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    border: `1px solid ${GOLD_MID}`,
                    background: 'rgba(8,6,2,0.75)',
                    color: GOLD,
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    opacity: atStart ? 0 : 1,
                    pointerEvents: atStart ? 'none' : 'auto',
                    transition: 'opacity 0.35s ease',
                    outline: 'none',
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
              </div>

              {/* Track */}
              <div
                ref={trackRef}
                className="berassi-track"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 'clamp(12px, 2vw, 22px)',
                  // Padding creates breathing room; last card fully visible
                  paddingLeft: 'clamp(16px, 7vw, 80px)',
                  paddingRight: 'clamp(16px, 7vw, 80px)',
                  paddingBottom: 24,
                  paddingTop: 8,
                }}
              >
                {professionals.map((pro) => (
                  <ProfessionalCard
                    key={pro.id}
                    pro={pro}
                    onClick={() => router.push(`/profissional/${pro.id}`)}
                  />
                ))}
              </div>

              {/* Right arrow */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 'clamp(4px, 2vw, 24px)',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  display: 'flex',
                }}
              >
                <button
                  onClick={() => scrollBy('right')}
                  aria-label="Próximo"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    border: `1px solid ${GOLD_MID}`,
                    background: 'rgba(8,6,2,0.75)',
                    color: GOLD,
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    opacity: atEnd ? 0 : 1,
                    pointerEvents: atEnd ? 'none' : 'auto',
                    transition: 'opacity 0.35s ease',
                    outline: 'none',
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ── Dot indicators ── */}
          {!loading && professionals.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 32,
                marginBottom: 48,
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeInUp 0.9s 0.45s ease both',
              }}
            >
              {professionals.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Ir para profissional ${i + 1}`}
                  onClick={() => {
                    const el = trackRef.current
                    if (!el) return
                    const card = el.children[i] as HTMLElement | undefined
                    if (card) {
                      el.scrollTo({ left: card.offsetLeft - 80, behavior: 'smooth' })
                    }
                  }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: GOLD_MID,
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'background 0.3s ease, transform 0.3s ease',
                    outline: 'none',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = GOLD
                    el.style.transform = 'scale(1.5)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = GOLD_MID
                    el.style.transform = 'scale(1)'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
