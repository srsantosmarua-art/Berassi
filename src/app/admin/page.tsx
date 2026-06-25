'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase, Appointment, Professional } from '@/lib/supabase'
import { LogOut, XCircle, ToggleLeft, ToggleRight } from 'lucide-react'

const ADMIN_EMAIL = 'admin@berassi.com'

export default function AdminPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState<'appointments' | 'professionals'>('appointments')
  const [appointments, setAppointments] = useState<(Appointment & { professional?: Professional })[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        router.replace('/admin/login')
        return
      }
      setChecking(false)
    }
    checkAdmin()
  }, [router])

  const loadData = useCallback(async () => {
    setLoading(true)
    const [{ data: appts }, { data: pros }] = await Promise.all([
      supabase
        .from('appointments')
        .select('*, professional:professionals(*)')
        .order('scheduled_at', { ascending: false })
        .limit(100),
      supabase
        .from('professionals')
        .select('*')
        .order('display_order'),
    ])
    if (appts) setAppointments(appts as any)
    if (pros) setProfessionals(pros)
    setLoading(false)
  }, [])

  useEffect(() => { if (!checking) loadData() }, [checking, loadData])

  async function cancelAppointment(id: string) {
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id)
    loadData()
  }

  async function toggleProfessional(id: string, current: boolean) {
    await supabase.from('professionals').update({ active: !current }).eq('id', id)
    loadData()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <header className="border-b border-gold/10 bg-obsidian/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="BERASSI" width={36} height={36} />
            <p className="text-cream text-sm font-display font-light">Admin</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-cream-muted hover:text-gold text-xs uppercase tracking-wider transition-colors">
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {['appointments', 'professionals'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-5 py-3 rounded-lg text-xs uppercase tracking-wider transition-all border ${
                tab === t ? 'bg-gold/20 border-gold text-gold' : 'border-gold/20 text-cream-muted hover:border-gold/40'
              }`}
            >
              {t === 'appointments' ? 'Agendamentos' : 'Profissionais'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : tab === 'appointments' ? (
          <div className="space-y-4">
            <h1 className="font-display text-2xl text-cream font-light mb-6">Todos os Agendamentos</h1>
            {appointments.map(appt => (
              <div key={appt.id} className="card-gold-border p-5 flex justify-between items-start gap-4">
                <div>
                  <p className="text-cream font-display text-lg font-light">{appt.client_name}</p>
                  <p className="text-cream-muted text-xs mt-1 opacity-60">
                    {appt.professional?.name} · {new Date(appt.scheduled_at).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-gold text-sm mt-2 font-display font-light">{fmt(appt.amount)}</p>
                  <span className={`text-[10px] uppercase tracking-wider mt-1 block ${
                    appt.status === 'cancelled' ? 'text-red-400' :
                    appt.status === 'confirmed' ? 'text-green-400' : 'text-cream-muted'
                  }`}>
                    {appt.status}
                  </span>
                </div>
                {appt.status !== 'cancelled' && (
                  <button
                    onClick={() => cancelAppointment(appt.id)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs"
                  >
                    <XCircle size={13} />
                    Cancelar
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="font-display text-2xl text-cream font-light mb-6">Profissionais</h1>
            {professionals.map(pro => (
              <div key={pro.id} className="card-gold-border p-5 flex justify-between items-center">
                <div>
                  <p className="text-cream font-display text-lg font-light">{pro.name}</p>
                  <p className="text-cream-muted text-xs opacity-60">{pro.email}</p>
                </div>
                <button
                  onClick={() => toggleProfessional(pro.id, pro.active)}
                  className="flex items-center gap-2 text-sm transition-colors"
                >
                  {pro.active ? (
                    <>
                      <ToggleRight size={24} className="text-gold" />
                      <span className="text-gold text-xs uppercase tracking-wider">Ativo</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={24} className="text-cream-muted opacity-40" />
                      <span className="text-cream-muted text-xs uppercase tracking-wider opacity-40">Inativo</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}