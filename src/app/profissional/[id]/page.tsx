'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, Professional, Service } from '@/lib/supabase'
import { Clock } from 'lucide-react'

export default function ProfessionalPage() {
  const { id } = useParams()
  const router = useRouter()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const [{ data: pro }, { data: svcs }] = await Promise.all([
        supabase.from('professionals').select('*').eq('id', id).single(),
        supabase.from('services').select('*').eq('professional_id', id).eq('active', true).order('price'),
      ])
      if (pro) setProfessional(pro)
      if (svcs) setServices(svcs)
      setLoading(false)
      setTimeout(() => setVisible(true), 50)
    }
    fetchData()
  }, [id])

  const bgStyle = {
    backgroundImage: "url('/marble-bg.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  }

  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center" style={bgStyle}>
        <div className="fixed inset-0 bg-black/72 z-0" />
        <div className="relative z-10 w-8 h-8 rounded-full animate-spin"
          style={{ border: '2px solid rgba(201,168,76,0.3)', borderTopColor: '#C9A84C' }} />
      </main>
    )
  }

  if (!professional) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center" style={bgStyle}>
        <div className="fixed inset-0 bg-black/72 z-0" />
        <p className="relative z-10" style={{ color: '#C8BFA8' }}>Profissional não encontrado.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center" style={bgStyle}>

      {/* Overlays */}
      <div className="fixed inset-0 z-0" style={{ background: 'rgba(0,0,0,0.82)' }} />
      <div className="fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
      }} />

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center">

        {/* Voltar */}
        <div className="w-full pt-8 pb-2">
          <button
            onClick={() => router.push('/')}
            className="text-xs tracking-widest uppercase transition-colors"
            style={{ color: '#C9A84C' }}
          >
            ‹ Voltar para profissionais
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 20px' }}>
          <div style={{ height: 1, width: 56, background: 'rgba(201,168,76,0.6)' }} />
          <div style={{
            width: 8, height: 8,
            transform: 'rotate(45deg)',
            background: '#C9A84C',
            boxShadow: '0 0 6px rgba(201,168,76,0.8)',
          }} />
          <div style={{ height: 1, width: 56, background: 'rgba(201,168,76,0.6)' }} />
        </div>

        {/* Nome */}
        <p
          className="tracking-[0.4em] uppercase text-sm font-light text-center"
          style={{
            color: '#C8BFA8',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            letterSpacing: '0.38em',
            marginBottom: 8,
          }}
        >
          {professional.name}
        </p>

        {/* Bio */}
        {professional.bio && (
          <p
            className="text-center font-light"
            style={{
              color: 'rgba(200,191,168,0.7)',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 17,
              marginBottom: 40,
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            {professional.bio}
          </p>
        )}

        {/* Serviços */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 60, width: '520px', maxWidth: '100%' }}>
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => router.push(`/contato/${professional.id}?service=${service.id}`)}
              className="w-full text-left"
              style={{
                background: 'rgba(20,18,14,0.85)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 12,
                padding: '20px 24px',
                position: 'relative',
                overflow: 'hidden',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(18px)',
                transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s, border 0.3s ease, background 0.3s ease, box-shadow 0.3s ease`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.border = '1px solid rgba(201,168,76,0.8)'
                el.style.background = 'rgba(30,26,18,0.95)'
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 8px 24px rgba(201,168,76,0.15)'
                const glow = el.querySelector('.bottom-glow') as HTMLElement
                if (glow) glow.style.opacity = '1'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.border = '1px solid rgba(201,168,76,0.2)'
                el.style.background = 'rgba(20,18,14,0.85)'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
                const glow = el.querySelector('.bottom-glow') as HTMLElement
                if (glow) glow.style.opacity = '0'
              }}
            >
              {/* Brilho dourado inferior */}
              <div
                className="bottom-glow"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '10%',
                  right: '10%',
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.9), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              />

              <div className="flex items-center justify-between">
                <div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 20,
                    fontWeight: 400,
                    color: '#F5F0E8',
                    marginBottom: 6,
                  }}>
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Clock size={12} style={{ color: 'rgba(201,168,76,0.7)' }} />
                    <span style={{ color: 'rgba(200,191,168,0.6)', fontSize: 12 }}>
                      {service.duration_minutes < 60
                        ? `${service.duration_minutes} minutos`
                        : `${Math.floor(service.duration_minutes / 60)}h${service.duration_minutes % 60 > 0 ? service.duration_minutes % 60 + 'min' : ''}`}
                    </span>
                  </div>
                </div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 300,
                  color: '#C9A84C',
                }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </main>
  )
}