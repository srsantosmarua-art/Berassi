'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, Appointment, Service } from '@/lib/supabase'
import { Phone, Scissors, Calendar, CircleDollarSign, UserRound, ChevronRight, CalendarCheck } from 'lucide-react'

type Tab = 'agendar' | 'lista'
type Slot = { id: string; start_time: string }

const OWNERS = ['bete@berassi.com', 'simone@berassi.com']

const card: React.CSSProperties = {
  background: 'rgba(5,5,5,.92)',
  border: '1px solid rgba(201,168,76,.12)',
  borderRadius: 20,
  padding: '24px 28px',
}

const formCard: React.CSSProperties = {
  background: 'rgba(5,5,5,.95)',
  border: '1px solid rgba(201,168,76,.35)',
  borderRadius: 20,
  padding: '32px 28px',
  boxShadow: '0 0 40px rgba(201,168,76,.06)',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.04)',
  border: '1px solid rgba(201,168,76,.2)',
  borderRadius: 10,
  color: '#F5F0E8',
  fontSize: 14,
  padding: '12px 14px 12px 40px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  color: 'rgba(201,168,76,.7)',
  fontSize: 10,
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  marginBottom: 6,
  display: 'block',
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export default function AgendamentosPage() {
  const [tab, setTab] = useState<Tab>('lista')
  const [professionalId, setProfessionalId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [appointments, setAppointments] = useState<(Appointment & { service?: Service })[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [serviceAmount, setServiceAmount] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [savingAppt, setSavingAppt] = useState(false)

  useEffect(() => {
    async function loadPro() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserEmail(user.email ?? '')
      const { data: pro } = await supabase.from('professionals').select('id').eq('email', user.email).single()
      if (pro) setProfessionalId(pro.id)
    }
    loadPro()
  }, [])

  const loadAppointments = useCallback(async () => {
    if (!professionalId) return
    setLoading(true)
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    const { data } = await supabase
      .from('appointments')
      .select('*, service:services(*)')
      .eq('professional_id', professionalId)
      .gte('scheduled_at', twoMonthsAgo.toISOString())
      .order('scheduled_at', { ascending: false })
    if (data) setAppointments(data as any)
    setLoading(false)
  }, [professionalId])

  useEffect(() => { loadAppointments() }, [loadAppointments])

  useEffect(() => {
    async function loadSlots() {
      if (!professionalId || !selectedDate) return
      setLoadingSlots(true)
      setSelectedSlots([])
      const { data } = await supabase
        .from('time_slots')
        .select('*')
        .eq('professional_id', professionalId)
        .eq('date', selectedDate)
        .eq('is_blocked', false)
        .order('start_time')
      const available = (data ?? []).filter((s: any) => !s.appointment_id)
      setSlots(available)
      setLoadingSlots(false)
    }
    loadSlots()
  }, [professionalId, selectedDate])

  function toggleSlot(slot: Slot) {
    setSelectedSlots(prev => {
      const exists = prev.find(s => s.id === slot.id)
      if (exists) return prev.filter(s => s.id !== slot.id)
      return [...prev, slot]
    })
  }

  async function addAppointment() {
    if (!professionalId || !clientName || !clientPhone || !serviceName || !serviceAmount || selectedSlots.length === 0) return
    setSavingAppt(true)
    const sorted = [...selectedSlots].sort((a, b) => a.start_time.localeCompare(b.start_time))
    const scheduledAt = `${selectedDate}T${sorted[0].start_time}`
    const { data: appt } = await supabase.from('appointments').insert({
      professional_id: professionalId,
      client_name: clientName,
      client_phone: clientPhone,
      service_name: serviceName,
      amount: parseFloat(serviceAmount),
      scheduled_at: scheduledAt,
      status: 'pending',
    }).select().single()
    if (appt) {
      for (const slot of sorted) {
        await supabase.from('time_slots').update({ appointment_id: appt.id, is_available: false }).eq('id', slot.id)
      }
    }
    setClientName(''); setClientPhone(''); setServiceName(''); setServiceAmount('')
    setSelectedDate(''); setSelectedSlots([]); setSlots([])
    await loadAppointments()
    setTab('lista')
    setSavingAppt(false)
  }

  async function updateStatus(apptId: string, status: 'confirmed' | 'no_show', amount: number) {
    setSaving(apptId)
    await supabase.from('appointments').update({ status }).eq('id', apptId)

    if (status === 'confirmed') {
      const appt = appointments.find(a => a.id === apptId)
      if (appt) {
        const isOwner = OWNERS.includes(userEmail)
        await supabase.from('financial_records').insert({
          professional_id: professionalId,
          description: `${(appt as any).service_name ?? appt.service?.name ?? 'Serviço'} — ${appt.client_name}`,
          amount: isOwner ? amount : amount * 0.7,
          type: 'appointment',
          recorded_at: appt.scheduled_at,
        })
      }
    }

    if (status === 'no_show') {
      await supabase.from('time_slots')
        .update({ appointment_id: null, is_available: true })
        .eq('appointment_id', apptId)
    }

    await loadAppointments()
    setSaving(null)
  }

  const statusInfo: Record<string, { label: string; color: string }> = {
    pending:   { label: 'Agendado',       color: '#C9A84C' },
    confirmed: { label: 'Compareceu',     color: '#4ade80' },
    no_show:   { label: 'Não compareceu', color: '#f87171' },
    cancelled: { label: 'Cancelado',      color: 'rgba(248,113,113,.5)' },
  }

  const today = new Date().toISOString().split('T')[0]
  const canConfirm = clientName && clientPhone && serviceName && serviceAmount && selectedSlots.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {([['lista', 'Agendamentos'], ['agendar', '+ Novo agendamento']] as const).map(([key, lbl]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '10px 22px', borderRadius: 12, fontSize: 14, cursor: 'pointer',
              transition: 'all .2s',
              background: tab === key ? '#C9A84C' : 'rgba(5,5,5,.92)',
              color: tab === key ? '#0d0d0d' : 'rgba(245,240,232,.7)',
              border: tab === key ? 'none' : '1px solid rgba(201,168,76,.15)',
              fontWeight: tab === key ? 500 : 400,
            }}
          >
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'agendar' && (
        <div style={formCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <UserRound size={18} style={{ color: 'rgba(201,168,76,.7)' }} />
            <p style={{ color: '#F5F0E8', fontSize: 16, fontWeight: 400 }}>Dados do cliente</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <span style={labelStyle}>Nome do cliente</span>
                <div style={{ position: 'relative' }}>
                  <UserRound size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,168,76,.5)', pointerEvents: 'none' }} />
                  <input style={inputStyle} placeholder="Ex: Maria Silva" value={clientName} onChange={e => setClientName(e.target.value)} />
                </div>
              </div>
              <div>
                <span style={labelStyle}>Telefone</span>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,168,76,.5)', pointerEvents: 'none' }} />
                  <input style={inputStyle} placeholder="(11) 99999-9999" value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gui: 12 } as any}>
              <div>
                <span style={labelStyle}>Serviço</span>
                <div style={{ position: 'relative' }}>
                  <Scissors size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,168,76,.5)', pointerEvents: 'none' }} />
                  <input style={inputStyle} placeholder="Ex: Escova, Corte..." value={serviceName} onChange={e => setServiceName(e.target.value)} />
                </div>
              </div>
              <div>
                <span style={labelStyle}>Valor (R$)</span>
                <div style={{ position: 'relative' }}>
                  <CircleDollarSign size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,168,76,.5)', pointerEvents: 'none' }} />
                  <input style={inputStyle} type="number" placeholder="0,00" value={serviceAmount} onChange={e => setServiceAmount(e.target.value)} />
                </div>
              </div>
            </div>
            <div>
              <span style={labelStyle}>Data</span>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,168,76,.5)', pointerEvents: 'none', zIndex: 1 }} />
                <input style={{ ...inputStyle, width: 200 }} type="date" min={today} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
              </div>
            </div>
            {selectedDate && (
              <div>
                <span style={labelStyle}>
                  Horários disponíveis
                  {selectedSlots.length > 0 && <span style={{ color: '#C9A84C', marginLeft: 8, fontWeight: 600 }}>{selectedSlots.length} selecionado{selectedSlots.length > 1 ? 's' : ''}</span>}
                </span>
                {loadingSlots ? (
                  <p style={{ color: 'rgba(245,240,232,.4)', fontSize: 13 }}>Carregando horários...</p>
                ) : slots.length === 0 ? (
                  <p style={{ color: 'rgba(245,240,232,.4)', fontSize: 13 }}>Nenhum horário disponível neste dia.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                    {slots.map(slot => {
                      const isSelected = !!selectedSlots.find(s => s.id === slot.id)
                      return (
                        <button key={slot.id} onClick={() => toggleSlot(slot)} style={{
                          height: 44, borderRadius: 10, fontSize: 14, cursor: 'pointer', transition: 'all .2s',
                          background: isSelected ? '#C9A84C' : 'rgba(5,5,5,.92)',
                          color: isSelected ? '#0d0d0d' : 'rgba(245,240,232,.8)',
                          border: isSelected ? 'none' : '1px solid rgba(201,168,76,.2)',
                          fontWeight: isSelected ? 600 : 400,
                        }}>
                          {slot.start_time.slice(0, 5)}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
            <button onClick={addAppointment} disabled={savingAppt || !canConfirm} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              height: 56, borderRadius: 14, fontSize: 15, fontWeight: 500,
              cursor: canConfirm ? 'pointer' : 'not-allowed', transition: 'all .2s',
              background: canConfirm ? 'linear-gradient(135deg, #A07830, #C9A84C, #E4C96A)' : 'rgba(201,168,76,.15)',
              color: canConfirm ? '#0d0d0d' : 'rgba(201,168,76,.4)', border: 'none', marginTop: 8,
            }}>
              <CalendarCheck size={17} />
              {savingAppt ? 'Agendando...' : 'Confirmar agendamento'}
              {canConfirm && <ChevronRight size={16} style={{ marginLeft: 4 }} />}
            </button>
          </div>
        </div>
      )}

      {tab === 'lista' && (
        <>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid rgba(201,168,76,.2)', borderTopColor: '#C9A84C' }} />
            </div>
          ) : appointments.length === 0 ? (
            <div style={{ ...card, textAlign: 'center', padding: 48 }}>
              <p style={{ color: 'rgba(245,240,232,.4)', fontSize: 16 }}>Nenhum agendamento nos últimos 2 meses</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {appointments.map(appt => {
                const st = statusInfo[appt.status] ?? statusInfo.pending
                const scheduledDate = new Date(appt.scheduled_at)
                const isPast = scheduledDate < new Date()
                return (
                  <div key={appt.id} style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                          <p style={{ color: '#F5F0E8', fontSize: 17, fontWeight: 400 }}>{appt.client_name}</p>
                          <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: st.color, padding: '3px 10px', borderRadius: 99, background: `${st.color}15`, border: `1px solid ${st.color}35` }}>
                            {st.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 14 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(245,240,232,.5)' }}>
                            <Phone size={13} style={{ color: '#C9A84C', opacity: 0.7 }} />{appt.client_phone}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(245,240,232,.5)' }}>
                            <Scissors size={13} style={{ color: '#f87171', opacity: 0.8 }} />{(appt as any).service_name ?? appt.service?.name ?? '—'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(245,240,232,.5)' }}>
                            <Calendar size={13} style={{ color: 'rgba(245,240,232,.4)' }} />
                            {scheduledDate.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} às {scheduledDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontSize: 20, color: '#C9A84C', fontWeight: 300, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                          {fmt(appt.amount)}
                        </p>
                      </div>
                      {appt.status === 'pending' && isPast && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <button onClick={() => updateStatus(appt.id, 'confirmed', appt.amount)} disabled={saving === appt.id} style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, cursor: 'pointer', background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.25)', color: '#4ade80', whiteSpace: 'nowrap', transition: 'all .2s' }}>
                            ✓ Compareceu
                          </button>
                          <button onClick={() => updateStatus(appt.id, 'no_show', appt.amount)} disabled={saving === appt.id} style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, cursor: 'pointer', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', color: '#f87171', whiteSpace: 'nowrap', transition: 'all .2s' }}>
                            ✗ Não compareceu
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}