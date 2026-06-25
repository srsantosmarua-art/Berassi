'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Professional } from '@/lib/supabase'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  useEffect(() => {
    async function fetchProfessionals() {
      const { data, error } = await supabase
  .from('professionals')
  .select('*')

console.log('DATA:', data)
console.log('ERROR:', error)
      if (data) setProfessionals(data)
      setLoading(false)
    }
    fetchProfessionals()
  }, [])
 useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY > 0) next()
      else prev()
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [current, professionals.length])

  const CARD_WIDTH = 260
  const GAP = 20
  const visible = 3

  const prev = () => setCurrent(c => Math.max(0, c - 1))
  const next = () => setCurrent(c => Math.min(professionals.length - visible, c + 1))

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.pageX
    scrollLeft.current = current
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const diff = startX.current - e.pageX
    if (Math.abs(diff) > 30) {
      if (diff > 0) next()
      else prev()
      isDragging.current = false
    }
  }
  const onMouseUp = () => { isDragging.current = false }

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].pageX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].pageX
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
  }

  const shown = professionals.slice(current, current + visible)

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-start overflow-hidden select-none"
      style={{
        backgroundImage: "url('/marble-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/72 z-0" />

      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Logo */}
        <div
          className="flex flex-col items-center"
          style={{ marginTop: '80px', marginBottom: '8px', position: 'relative' }}
        >
          {/* Glow radial atrás */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 340,
            height: 240,
            background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          {/* Box da logo */}
          <div
            className="relative p-4"
            style={{
              background: 'rgba(40,38,35,0.92)',
              border: '1px solid rgba(201,168,76,0.35)',
              zIndex: 1,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                boxShadow: '0 0 60px 10px rgba(201,168,76,0.18)',
                pointerEvents: 'none',
              }}
            />
            <Image src="/logo.png" alt="BERASSI" width={120} height={120} className="relative z-10" />
          </div>
        </div>

        {/* Divider with diamond */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
          <div style={{ height: 1, width: 56, background: 'rgba(201,168,76,0.6)' }} />
          <div style={{
            width: 8, height: 8,
            transform: 'rotate(45deg)',
            background: '#C9A84C',
            boxShadow: '0 0 6px rgba(201,168,76,0.8)',
          }} />
          <div style={{ height: 1, width: 56, background: 'rgba(201,168,76,0.6)' }} />
        </div>

        {/* Title */}
        <p
          className="tracking-[0.4em] uppercase text-sm font-light"
          style={{
            marginBottom: '60px',
            color: '#C8BFA8',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            letterSpacing: '0.38em',
          }}
        >
          Escolha o profissional
        </p>

        {/* Carousel */}
        {loading ? (
          <div className="w-8 h-8 border-2 border-t-gold rounded-full animate-spin mt-20"
            style={{ borderColor: 'rgba(201,168,76,0.3)', borderTopColor: '#C9A84C' }} />
        ) : (
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', padding: '0 24px' }}>

            {/* Prev arrow */}
            <button
              onClick={prev}
              disabled={current === 0}
              className="flex items-center justify-center rounded-full transition-all duration-200 flex-shrink-0"
              style={{
                width: 36, height: 36,
                border: '1px solid rgba(201,168,76,0.5)',
                color: '#C9A84C',
                background: 'rgba(0,0,0,0.3)',
                opacity: current === 0 ? 0 : 1,
                pointerEvents: current === 0 ? 'none' : 'auto',
                marginRight: 12,
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Cards */}
            <div
              ref={scrollRef}
              className="flex justify-center cursor-grab active:cursor-grabbing"
              style={{ gap: '20px', overflow: 'hidden', maxWidth: `${(CARD_WIDTH + GAP) * visible - GAP}px` }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={() => { isDragging.current = false }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {shown.map((pro) => {
                const isHovered = hoveredId === pro.id
                return (
                  <div
                    key={pro.id}
                    onClick={() => router.push(`/profissional/${pro.id}`)}
                    onMouseEnter={() => setHoveredId(pro.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="relative flex flex-col justify-end cursor-pointer overflow-hidden"
                    style={{
                      width: CARD_WIDTH,
                      height: 420,
                      borderRadius: 16,
                      border: isHovered
                        ? '1px solid rgba(201,168,76,0.9)'
                        : '1px solid rgba(201,168,76,0.2)',
                      background: 'linear-gradient(170deg, #1a1710 0%, #0a0800 100%)',
                      transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                      transition: 'transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
                      boxShadow: isHovered
                        ? '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.3), inset 0 -1px 0 rgba(201,168,76,0.4)'
                        : '0 8px 30px rgba(0,0,0,0.5)',
                    }}
                  >
                    {pro.photo_url && (
                      <Image
                        src={pro.photo_url}
                        alt={pro.name}
                        fill
                        className="object-cover"
                        style={{ opacity: isHovered ? 0.65 : 0.5, transition: 'opacity 0.35s ease' }}
                      />
                    )}
                    <div className="absolute inset-0" style={{
                      background: isHovered
                        ? 'radial-gradient(ellipse at 50% 45%, rgba(201,168,76,0.13) 0%, transparent 65%)'
                        : 'radial-gradient(ellipse at 50% 45%, rgba(201,168,76,0.06) 0%, transparent 65%)',
                      transition: 'background 0.35s ease',
                    }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 100, fontWeight: 300, lineHeight: 1,
                        color: isHovered ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.22)',
                        transition: 'color 0.35s ease', userSelect: 'none',
                      }}>
                        {pro.name[0]}
                      </span>
                    </div>
                    {isHovered && (
                      <div className="absolute bottom-0 left-0 right-0" style={{
                        height: 2,
                        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.8), transparent)',
                      }} />
                    )}
                    <div className="relative z-10 px-6 pb-6">
                      <h2 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 22, fontWeight: 600,
                        color: isHovered ? '#E4C96A' : '#F5F0E8',
                        transition: 'color 0.35s ease', marginBottom: 8,
                      }}>
                        {pro.name}
                      </h2>
                      <div style={{
                        height: 1, width: isHovered ? 48 : 32,
                        background: isHovered ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.5)',
                        transition: 'width 0.35s ease, background 0.35s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Next arrow */}
            <button
              onClick={next}
              disabled={current >= professionals.length - visible}
              className="flex items-center justify-center rounded-full transition-all duration-200 flex-shrink-0"
              style={{
                width: 36, height: 36,
                border: '1px solid rgba(201,168,76,0.5)',
                color: '#C9A84C',
                background: 'rgba(0,0,0,0.3)',
                opacity: current >= professionals.length - visible ? 0 : 1,
                pointerEvents: current >= professionals.length - visible ? 'none' : 'auto',
                marginLeft: 12,
              }}
            >
              <ChevronRight size={16} />
            </button>

          </div>
        )}
      </div>
    </main>
  )
}