'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { LogOut, ChevronDown } from 'lucide-react'

const OWNERS = ['bete@berassi.com', 'simone@berassi.com']

const PROFILES = [
  { name: 'Bete',         token: 'efbf5d3b-9c27-4a7a-91d5-b5759074e6ae' },
  { name: 'Simone',       token: '4bee52ac-115a-4d1c-a87c-467b22f95ae2' },
  { name: 'Tom',          token: 'f0c2c27f-c31d-4317-97c4-631b6a8ccbf8' },
  { name: 'Talita Rosan', token: 'f36bd48b-db15-42c2-be14-12cb209fdd1b' },
  { name: 'Talita',       token: 'a38dcf19-bea4-4965-add7-77085b17f54f' },
  { name: 'Renata',       token: 'e2805de2-8291-4ae6-8132-e2091dba5dda' },
]

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [userName, setUserName] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [showProfiles, setShowProfiles] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data: pro } = await supabase.from('professionals').select('name').eq('email', user.email).single()
      if (!pro) { router.replace('/login'); return }
      setUserName(pro.name)
      setIsOwner(OWNERS.includes(user.email ?? ''))
      setChecking(false)
    }
    checkAuth()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(201,168,76,0.3)', borderTopColor: '#C9A84C' }} />
    </div>
  )

  const tabs = [
    { href: '/painel', label: 'Meus horários' },
    { href: '/painel/agendamentos', label: 'Agendamentos' },
    { href: '/painel/financeiro', label: 'Financeiro' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', backgroundImage: "url('/marble-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <header style={{ padding: '48px 48px 32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(201,168,76,0.6)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>
              Bem-vindo(a)
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 400, lineHeight: 1, color: '#F5F0E8' }}>
              {userName}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

            {isOwner && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowProfiles(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 16px', borderRadius: 12,
                    border: '1px solid rgba(201,168,76,.25)',
                    background: 'rgba(5,5,5,.92)',
                    color: '#C9A84C', fontSize: 13, cursor: 'pointer',
                  }}
                >
                  Acessar como
                  <ChevronDown size={14} />
                </button>

                {showProfiles && (
                  <div style={{
                    position: 'absolute', top: '110%', right: 0, zIndex: 50,
                    background: 'rgba(10,10,10,.98)',
                    border: '1px solid rgba(201,168,76,.2)',
                    borderRadius: 14, overflow: 'hidden',
                    minWidth: 180,
                    boxShadow: '0 8px 32px rgba(0,0,0,.6)',
                  }}>
                    {PROFILES.map((p, i) => (
                      
                      <a
                        key={p.token}
                        href={`/acesso/${p.token}`}
                        style={{
                          display: 'block',
                          padding: '13px 20px',
                          fontSize: 14,
                          color: '#F5F0E8',
                          textDecoration: 'none',
                          borderBottom: i < PROFILES.length - 1 ? '1px solid rgba(201,168,76,.08)' : 'none',
                        }}
                      >
                        {p.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleLogout}
              style={{ color: 'rgba(200,191,168,0.6)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </header>

        <div style={{ padding: '0 48px', marginBottom: 40, display: 'flex', gap: 12 }}>
          {tabs.map(tab => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  width: 156, height: 42,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 12, fontSize: 14, fontWeight: 500,
                  textDecoration: 'none', transition: 'all .2s ease',
                  background: isActive ? '#C9A84C' : 'rgba(255,255,255,.04)',
                  color: isActive ? '#0D0D0D' : 'rgba(240,235,225,.8)',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,.08)',
                }}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        <main style={{ flex: 1, padding: '0 48px 80px 48px' }}>
          {children}
        </main>

      </div>
    </div>
  )
}