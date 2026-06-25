'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Professional {
  id: string
  name: string
  whatsapp: string
  instagram: string
}

interface Service {
  id: string
  name: string
  price: number
}

export default function ContatoPage() {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service')

  const [professional, setProfessional] = useState<Professional | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const { data: pro } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', id)
        .single()

      if (pro) setProfessional(pro)

      if (serviceId) {
        const { data: svc } = await supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .single()
        if (svc) setService(svc)
      }

      setLoading(false)
      setTimeout(() => setVisible(true), 50)
    }
    fetchData()
  }, [id, serviceId])

  const bgStyle: React.CSSProperties = {
    backgroundImage: "url('/marble-bg.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  }

  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center" style={bgStyle}>
        <div className="fixed inset-0 z-0" style={{ background: 'rgba(0,0,0,0.82)' }} />
        <div
          className="relative z-10 w-8 h-8 rounded-full animate-spin"
          style={{ border: '2px solid rgba(201,168,76,0.3)', borderTopColor: '#C9A84C' }}
        />
      </main>
    )
  }

  if (!professional) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center" style={bgStyle}>
        <div className="fixed inset-0 z-0" style={{ background: 'rgba(0,0,0,0.82)' }} />
        <p className="relative z-10" style={{ color: '#C8BFA8' }}>Profissional não encontrado.</p>
      </main>
    )
  }

  const whatsappMessage = service
    ? `Olá ${professional.name}! Gostaria de agendar: ${service.name}`
    : `Olá ${professional.name}! Gostaria de agendar um horário.`

  const whatsappUrl = `https://wa.me/55${professional.whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
  const instagramUrl = `https://instagram.com/${professional.instagram?.replace('@', '')}`

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center" style={bgStyle}>

      <div className="fixed inset-0 z-0" style={{ background: 'rgba(0,0,0,0.82)' }} />
      <div className="fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
      }} />

      <div
        className="relative z-10 w-full flex flex-col items-center px-6"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Voltar */}
        <div className="w-full max-w-xs mb-10">
          <button
            onClick={() => router.back()}
            className="text-xs tracking-widest uppercase"
            style={{ color: '#C9A84C' }}
          >
            ‹ Voltar
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ height: 1, width: 56, background: 'rgba(201,168,76,0.6)' }} />
          <div style={{
            width: 8, height: 8,
            transform: 'rotate(45deg)',
            background: '#C9A84C',
            boxShadow: '0 0 6px rgba(201,168,76,0.8)',
          }} />
          <div style={{ height: 1, width: 56, background: 'rgba(201,168,76,0.6)' }} />
        </div>

        {/* Título */}
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 13,
          letterSpacing: '0.38em',
          color: '#C8BFA8',
          textTransform: 'uppercase',
          marginBottom: 8,
          textAlign: 'center',
        }}>
          Falar com {professional.name}
        </p>

        {/* Serviço */}
        {service && (
          <p style={{
            color: 'rgba(201,168,76,0.7)',
            fontSize: 14,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            marginBottom: 48,
            textAlign: 'center',
            letterSpacing: '0.1em',
          }}>
            {service.name} · {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
          </p>
        )}

        {!service && <div style={{ marginBottom: 48 }} />}

        {/* Botões */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 320 }}>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '16px 24px',
              borderRadius: 12,
              background: 'rgba(20,18,14,0.85)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: '#F5F0E8',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 18,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.border = '1px solid rgba(201,168,76,0.8)'
              el.style.background = 'rgba(30,26,18,0.95)'
              el.style.transform = 'translateY(-3px)'
              el.style.boxShadow = '0 8px 24px rgba(201,168,76,0.15)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.border = '1px solid rgba(201,168,76,0.2)'
              el.style.background = 'rgba(20,18,14,0.85)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(201,168,76,0.8)">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>

          {professional.instagram && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '16px 24px',
                borderRadius: 12,
                background: 'rgba(20,18,14,0.85)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#F5F0E8',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 18,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.border = '1px solid rgba(201,168,76,0.8)'
                el.style.background = 'rgba(30,26,18,0.95)'
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 8px 24px rgba(201,168,76,0.15)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.border = '1px solid rgba(201,168,76,0.2)'
                el.style.background = 'rgba(20,18,14,0.85)'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(201,168,76,0.8)">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
          )}
        </div>
      </div>
    </main>
  )
}