'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { LogOut } from 'lucide-react'

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data: pro } = await supabase.from('professionals').select('name').eq('email', user.email).single()
      if (!pro) { router.replace('/login'); return }
      setUserName(pro.name)
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
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(201,168,76,0.3)', borderTopColor: '#C9A84C', animation: 'spin 1s linear infinite' }} />
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

        {/* Header */}
        <header style={{ padding: '48px 48px 32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(201,168,76,0.6)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>
              Bem-vindo(a)
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 400, lineHeight: 1, color: '#F5F0E8' }}>
              {userName}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{ color: 'rgba(200,191,168,0.6)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <LogOut size={14} />
            Sair
          </button>
        </header>

        {/* Tabs */}
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

        {/* Content */}
        <main style={{ flex: 1, paddingBottom: 80, padding: '0 48px 80px 48px' }}>
          {children}
        </main>

      </div>
    </div>
  )
}