'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function AcessoPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  const [erro, setErro] = useState(false)
  const [msg, setMsg] = useState('Entrando...')

  useEffect(() => {
    async function login() {
      setMsg('Deslogando...')
      await supabase.auth.signOut()

      setMsg('Buscando profissional...')
      const { data: pro, error: proError } = await supabase
        .from('professionals')
        .select('email')
        .eq('access_token', token)
        .single()

      if (proError || !pro) {
        setMsg('Profissional não encontrada: ' + proError?.message)
        setErro(true)
        return
      }

      setMsg('Fazendo login como ' + pro.email)
      const { error } = await supabase.auth.signInWithPassword({
        email: pro.email,
        password: token,
      })

      if (error) {
        setMsg('Erro no login: ' + error.message)
        setErro(true)
        return
      }

      setMsg('Redirecionando...')
      router.replace('/painel')
    }

    if (token) login()
  }, [token, router])

  return (
    <main className="marble-bg min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <Image src="/logo.png" alt="BERASSI" width={100} height={100} priority />
        <div className="w-10 h-10 rounded-full animate-spin"
          style={{ border: '2px solid rgba(201,168,76,0.3)', borderTopColor: '#C9A84C' }} />
        <p style={{ color: erro ? '#f87171' : 'rgba(245,240,232,0.5)', fontSize: 14, letterSpacing: '0.1em' }}>
          {msg}
        </p>
      </div>
    </main>
  )
}