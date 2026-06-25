'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff } from 'lucide-react'

const ADMIN_EMAIL = 'admin@berassi.com'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (email !== ADMIN_EMAIL) {
      setError('Acesso restrito.')
      setLoading(false)
      return
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError || !data.user) {
      setError('Credenciais inválidas.')
      setLoading(false)
      return
    }

    router.push('/admin')
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm fade-up">
        <div className="flex flex-col items-center mb-10">
          <Image src="/logo.png" alt="BERASSI" width={90} height={90} />
          <div className="gold-divider w-16 mt-5 mb-3" />
          <p className="text-cream-muted text-xs tracking-[0.25em] uppercase">Acesso Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="card-gold-border p-8 space-y-5">
          <h1 className="font-display text-2xl text-cream font-light text-center mb-6">Admin</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-400 text-xs text-center">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-cream-muted text-xs tracking-wider uppercase opacity-70">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-gold"
              placeholder="admin@berassi.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-cream-muted text-xs tracking-wider uppercase opacity-70">Senha</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-gold pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-muted hover:text-gold transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}