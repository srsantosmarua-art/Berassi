'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Copy, Check } from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default function LinksPage() {
  const [professionals, setProfessionals] = useState<any[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('professionals').select('id, name, email, access_token').then(({ data }) => {
      if (data) setProfessionals(data)
    })
  }, [])

  function copyLink(token: string, id: string) {
    navigator.clipboard.writeText(`${BASE_URL}/painel/acesso/${token}`)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main style={{ background: '#0d0d0d', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 36, color: '#F5F0E8', fontWeight: 300, marginBottom: 8 }}>
          Links de Acesso
        </h1>
        <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: 14, marginBottom: 40 }}>
          Envie o link para cada profissional. Ao clicar, ela entra direto no painel.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {professionals.map(pro => (
            <div key={pro.id} style={{
              background: 'rgba(255,255,255,.03)',
              border: '1px solid rgba(201,168,76,.12)',
              borderRadius: 16,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}>
              <div>
                <p style={{ color: '#F5F0E8', fontSize: 16, marginBottom: 4 }}>{pro.name}</p>
                <p style={{ color: 'rgba(245,240,232,0.35)', fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {BASE_URL}/painel/acesso/{pro.access_token}
                </p>
              </div>
              <button
                onClick={() => copyLink(pro.access_token, pro.id)}
                style={{
                  flexShrink: 0,
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: '1px solid rgba(201,168,76,.25)',
                  background: copied === pro.id ? 'rgba(74,222,128,.1)' : 'rgba(201,168,76,.05)',
                  color: copied === pro.id ? '#4ade80' : '#C9A84C',
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all .2s',
                }}
              >
                {copied === pro.id ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}