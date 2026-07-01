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

  useEffect(() => {
    async function login() {
      // Faz logout primeiro para limpar sessão anterior
      await supabase.auth.signOut()

      const { data: pro } = await supabase
        .from('professionals')
        .select('email')
        .eq('access_token', token)
        .single()

      if (!pro) { setErro(true); return }

      const { error } = await supabase.auth.signInWithPassword({
        email: pro.email,
        password: token,
      })

      if (error) { setErro(true); return }

      router.replace('/painel')
    }

    if (token) login()
  }, [token, router])

  return (
    <main className="marble-bg min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <Image src="/logo.png" alt="BERASSI" width={100} height={100} priority />
        {!erro ? (
          <>
            <div className="w-10 h-10 rounded-full animate-spin"
              style={{ border: '2px solid rgba(201,168,76,0.3)', borderTopColor: '#C9A84C' }} />
            <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 14, letterSpacing: '0.1em' }}>
              Entrando...
            </p>
          </>
        ) : (
          <p style={{ color: '#f87171', fontSize: 15 }}>
            Link inválido. Peça um novo link para a Simone ou Bete.
          </p>
        )}
      </div>
    </main>
  )
}