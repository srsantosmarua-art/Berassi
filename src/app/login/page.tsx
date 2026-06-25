'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
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

    const { data, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (authError || !data.user) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    const { data: professional } = await supabase
      .from('professionals')
      .select('id')
      .eq('email', email)
      .single()

    if (professional) {
      router.push('/painel')
    } else {
      setError('Acesso não autorizado.')
      await supabase.auth.signOut()
    }

    setLoading(false)
  }

  return (
  <main className="marble-bg min-h-screen flex items-center justify-center px-6">
    <div
      className="fade-up flex flex-col items-center"
      style={{
        width: '520px',
        maxWidth: '95vw'
      }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-16">
        <Image
          src="/logo.png"
          alt="BERASSI"
          width={140}
          height={140}
          priority
        />

        <div className="gold-divider w-32 mt-8 mb-8" />

        <p
          className="text-center uppercase tracking-[0.45em]"
          style={{
            color: '#F5F0E8',
            fontFamily: 'Cormorant Garamond',
            fontSize: '1.1rem'
          }}
        >
          Área do Profissional
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full"
      >
        <h1
          className="text-center mb-12"
          style={{
            fontSize: '3.5rem',
            fontFamily: 'Cormorant Garamond',
            color: '#F5F0E8',
            fontWeight: 300
          }}
        >
          Entrar
        </h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-center text-red-400">
              {error}
            </p>
          </div>
        )}

        <div className="mb-6">
          <label
            className="block mb-3"
            style={{
              color: '#C8BFA8',
              fontSize: '16px'
            }}
          >
            Email
          </label>

          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-gold w-full"
            style={{
              height: '62px',
              fontSize: '17px'
            }}
            required
          />
        </div>

        <div className="mb-8">
          <label
            className="block mb-3"
            style={{
              color: '#C8BFA8',
              fontSize: '16px'
            }}
          >
            Senha
          </label>

          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-gold w-full"
              style={{
                height: '62px',
                fontSize: '17px',
                paddingRight: '55px'
              }}
              required
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C9A84C] hover:text-[#E4C96A] transition-colors"
            >
              {showPass ? (
                <EyeOff size={22} color="#C9A84C" />
              ) : (
                <Eye size={22} color="#C9A84C" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full"
          style={{
            height: '64px',
            fontSize: '18px'
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  </main>
)
}