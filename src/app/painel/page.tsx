'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { TimeSlot } from '@/lib/supabase'
import { Lock, LockOpen } from 'lucide-react'

const HOURS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30',
  '17:00','17:30','18:00','18:30','19:00','19:30','20:00']

function formatDate(date: Date) { return date.toISOString().split('T')[0] }
function addDays(date: Date, days: number) { const d = new Date(date); d.setDate(d.getDate() + days); return d }

export default function HorariosPage() {
  const [professionalId, setProfessionalId] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const days = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i))

  useEffect(() => {
    async function loadPro() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: pro } = await supabase.from('professionals').select('id').eq('email', user.email).single()
      if (pro) setProfessionalId(pro.id)
    }
    loadPro()
  }, [])

  const loadSlots = useCallback(async () => {
    if (!professionalId) return
    setLoading(true)
    const from = formatDate(new Date())
    const to = formatDate(addDays(new Date(), 30))
    const { data } = await supabase.from('time_slots').select('*')
      .eq('professional_id', professionalId).gte('date', from).lte('date', to)
    if (data) setSlots(data)
    setLoading(false)
  }, [professionalId])

  useEffect(() => { loadSlots() }, [loadSlots])

  const selectedDay = new Date(selectedDate + 'T12:00:00')
  const isBlocked = slots.some(s => s.date === selectedDate && s.is_blocked)

  function getSlot(time: string) {
    return slots.find(s => s.date === selectedDate && s.start_time === time + ':00')
  }

  async function toggleSlot(time: string) {
    if (!professionalId || isBlocked) return
    setSaving(true)
    const startTime = time + ':00'
    const [h, m] = time.split(':').map(Number)
    const endMin = m + 30
    const endTime = `${String(endMin >= 60 ? h + 1 : h).padStart(2, '0')}:${endMin >= 60 ? '00' : '30'}:00`
    const existing = slots.find(s => s.date === selectedDate && s.start_time === startTime)
    if (existing) {
      if (existing.appointment_id) { setSaving(false); return }
      await supabase.from('time_slots').delete().eq('id', existing.id)
    } else {
      await supabase.from('time_slots').insert({
        professional_id: professionalId, date: selectedDate,
        start_time: startTime, end_time: endTime, is_available: true, is_blocked: false
      })
    }
    await loadSlots()
    setSaving(false)
  }

  async function blockDay() {
    if (!professionalId) return
    setSaving(true)
    const daySlots = slots.filter(s => s.date === selectedDate && !s.appointment_id)
    for (const s of daySlots) await supabase.from('time_slots').delete().eq('id', s.id)
    await supabase.from('time_slots').insert({
      professional_id: professionalId, date: selectedDate,
      start_time: '00:00:00', end_time: '23:59:00', is_available: false, is_blocked: true
    })
    await loadSlots()
    setSaving(false)
  }

  async function unblockDay() {
    if (!professionalId) return
    setSaving(true)
    const blocked = slots.filter(s => s.date === selectedDate && s.is_blocked)
    for (const s of blocked) await supabase.from('time_slots').delete().eq('id', s.id)
    await loadSlots()
    setSaving(false)
  }

  return (
    <div>
      {/* Carrossel de dias */}
      <div className="flex gap-2 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', marginBottom: 36 }}>
        {days.map(day => {
          const dateStr = formatDate(day)
          const isSelected = dateStr === selectedDate
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className="transition-all duration-200 flex-shrink-0"
              style={{
                width: 68, minWidth: 68, height: 80, borderRadius: 14,
                border: isSelected ? '1px solid rgba(201,168,76,.8)' : '1px solid rgba(201,168,76,.12)',
                background: isSelected ? '#C9A84C' : 'rgba(5,5,5,.92)',
                color: isSelected ? '#0d0d0d' : '#F5F0E8',
              }}
            >
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: isSelected ? 0.8 : 0.5, marginBottom: 3 }}>
                {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div style={{ fontSize: 22, lineHeight: 1, fontWeight: 700 }}>
                {day.getDate()}
              </div>
              <div style={{ fontSize: 11, opacity: isSelected ? 0.7 : 0.4, marginTop: 3 }}>
                {day.toLocaleDateString('pt-BR', { month: 'short' })}
              </div>
            </button>
          )
        })}
      </div>

      {/* Header data + botão */}
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 400 }}>
          {selectedDay.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h2>
        <button
          onClick={isBlocked ? unblockDay : blockDay}
          disabled={saving}
          className="flex items-center gap-2 transition-all duration-200"
          style={{
            padding: '10px 18px', borderRadius: 12,
            border: '1px solid rgba(201,168,76,.25)',
            background: 'rgba(5,5,5,.92)',
            color: '#C9A84C', fontSize: 13, cursor: 'pointer', letterSpacing: '0.02em',
          }}
        >
          {isBlocked ? <><LockOpen size={14} /> Desbloquear dia</> : <><Lock size={14} /> Bloquear dia</>}
        </button>
      </div>

      {/* Legenda */}
      <div className="flex gap-5 flex-wrap" style={{ marginBottom: 28 }}>
        {[
          { label: 'Disponível', bg: 'rgba(201,168,76,.15)', border: 'rgba(201,168,76,.5)' },
          { label: 'Agendado',   bg: 'rgba(239,68,68,.15)',  border: 'rgba(239,68,68,.5)' },
          { label: 'Livre',      bg: 'rgba(5,5,5,.92)',      border: 'rgba(255,255,255,.12)' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div style={{ width: 13, height: 13, borderRadius: 3, background: item.bg, border: `1px solid ${item.border}` }} />
            <span style={{ color: 'rgba(255,255,255,.55)', fontSize: 13 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full animate-spin"
            style={{ border: '2px solid rgba(201,168,76,.2)', borderTopColor: '#C9A84C' }} />
        </div>
      ) : isBlocked ? (
        <div style={{ padding: 40, borderRadius: 16, textAlign: 'center', border: '1px solid rgba(239,68,68,.2)', background: 'rgba(5,5,5,.92)' }}>
          <p style={{ color: '#f87171', fontSize: 15 }}>Este dia está bloqueado</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {HOURS.map(time => {
            const slot = getSlot(time)
            const isBooked = !!slot?.appointment_id
            const isOpen = !!slot && !isBooked
            return (
              <button
                key={time}
                onClick={() => toggleSlot(time)}
                disabled={saving || isBooked}
                className="rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  height: 52,
                  border: isBooked
                    ? '1px solid rgba(239,68,68,.4)'
                    : isOpen
                    ? '1px solid rgba(201,168,76,.55)'
                    : '1px solid rgba(201,168,76,.15)',
                  background: isBooked
                    ? 'rgba(239,68,68,.15)'
                    : isOpen
                    ? 'rgba(201,168,76,.2)'
                    : 'rgba(5,5,5,.92)',
                  color: isBooked ? '#f87171' : isOpen ? '#C9A84C' : 'rgba(255,255,255,.55)',
                  fontSize: 15, fontWeight: 400,
                  cursor: isBooked ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                {time}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}