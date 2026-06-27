'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, FinancialRecord, Goal, Professional } from '@/lib/supabase'

type Period = 'today' | 'week' | 'month' | 'year' | 'custom'

function periodDates(period: Period, from: string, to: string): [string, string] {
  const now = new Date()
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  if (period === 'today') return [fmt(now), fmt(now)]
  if (period === 'week') {
    const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1)
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
    return [fmt(mon), fmt(sun)]
  }
  if (period === 'month') {
    const first = new Date(now.getFullYear(), now.getMonth(), 1)
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return [fmt(first), fmt(last)]
  }
  if (period === 'year') return [`${now.getFullYear()}-01-01`, `${now.getFullYear()}-12-31`]
  return [from, to]
}

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,.03)',
  border: '1px solid rgba(201,168,76,.12)',
  borderRadius: 20,
  padding: '24px 28px',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.04)',
  border: '1px solid rgba(201,168,76,.2)',
  borderRadius: 10,
  color: '#F5F0E8',
  fontSize: 14,
  padding: '10px 14px',
  outline: 'none',
  width: '100%',
}

const label: React.CSSProperties = {
  color: 'rgba(201,168,76,.7)',
  fontSize: 10,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginBottom: 4,
  display: 'block',
}

export default function FinanceiroPage() {
  const [professionalId, setProfessionalId] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [records, setRecords] = useState<FinancialRecord[]>([])
  const [goal, setGoal] = useState<Goal | null>(null)
  const [allPros, setAllPros] = useState<Professional[]>([])
  const [teamRecords, setTeamRecords] = useState<Record<string, FinancialRecord[]>>({})
  const [period, setPeriod] = useState<Period>('month')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [walkinDesc, setWalkinDesc] = useState('')
  const [walkinAmount, setWalkinAmount] = useState('')
  const [savingWalkin, setSavingWalkin] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [savingGoal, setSavingGoal] = useState(false)
  const [showGoalInput, setShowGoalInput] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPro() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: pro } = await supabase.from('professionals').select('*').eq('email', user.email).single()
      if (pro) {
        setProfessionalId(pro.id)
        setIsOwner(['bete@berassi.com', 'simone@berassi.com'].includes(user.email ?? ''))
      }
    }
    loadPro()
  }, [])

  const loadData = useCallback(async () => {
    if (!professionalId) return
    setLoading(true)
    const [from, to] = periodDates(period, fromDate, toDate)

    const [{ data: recs }, { data: g }] = await Promise.all([
      supabase.from('financial_records').select('*')
        .eq('professional_id', professionalId)
        .gte('recorded_at', `${from}T00:00:00`)
        .lte('recorded_at', `${to}T23:59:59`)
        .order('recorded_at', { ascending: false }),
      supabase.from('goals').select('*')
        .eq('professional_id', professionalId)
        .eq('month', new Date().toISOString().slice(0, 7))
        .single(),
    ])

    if (recs) setRecords(recs)
    if (g) { setGoal(g); setGoalInput(String(g.target_amount)) }

    if (isOwner) {
      const { data: pros } = await supabase.from('professionals').select('*').eq('active', true).order('display_order')
      if (pros) {
        setAllPros(pros)
        const teamData: Record<string, FinancialRecord[]> = {}
        for (const p of pros) {
          const { data: pr } = await supabase.from('financial_records').select('*')
            .eq('professional_id', p.id)
            .gte('recorded_at', `${from}T00:00:00`)
            .lte('recorded_at', `${to}T23:59:59`)
          teamData[p.id] = pr ?? []
        }
        setTeamRecords(teamData)
      }
    }

    setLoading(false)
  }, [professionalId, period, fromDate, toDate, isOwner])

  useEffect(() => { loadData() }, [loadData])

  const totalConfirmed = records.filter(r => r.type === 'appointment').reduce((s, r) => s + r.amount, 0)
  const totalWalkin = records.filter(r => r.type === 'walkin').reduce((s, r) => s + r.amount, 0)
  const total = totalConfirmed + totalWalkin
  const goalProgress = goal ? Math.min((total / goal.target_amount) * 100, 100) : 0
  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const [from, to] = periodDates(period, fromDate, toDate)
  const periodLabel = `${from.split('-').reverse().slice(0,2).join('/')} a ${to.split('-').reverse().slice(0,2).join('/')}`

  async function addWalkin() {
    if (!professionalId || !walkinDesc || !walkinAmount) return
    setSavingWalkin(true)
    await supabase.from('financial_records').insert({
      professional_id: professionalId,
      description: walkinDesc,
      amount: parseFloat(walkinAmount),
      type: 'walkin',
      recorded_at: new Date().toISOString(),
    })
    setWalkinDesc('')
    setWalkinAmount('')
    await loadData()
    setSavingWalkin(false)
  }

  async function saveGoal() {
    if (!professionalId || !goalInput) return
    setSavingGoal(true)
    const month = new Date().toISOString().slice(0, 7)
    if (goal) {
      await supabase.from('goals').update({ target_amount: parseFloat(goalInput) }).eq('id', goal.id)
    } else {
      await supabase.from('goals').insert({ professional_id: professionalId, month, target_amount: parseFloat(goalInput) })
    }
    setShowGoalInput(false)
    await loadData()
    setSavingGoal(false)
  }

  const PERIODS: { key: Period; label: string }[] = [
    { key: 'today', label: 'Hoje' },
    { key: 'week', label: 'Esta semana' },
    { key: 'month', label: 'Este mês' },
    { key: 'year', label: 'Este ano' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Filtrar período */}
      <div style={card}>
        <span style={label}>Filtrar período</span>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap', marginTop: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ ...label, marginBottom: 0 }}>De</span>
            <input
              type="date"
              value={from}
              onChange={e => { setPeriod('custom'); setFromDate(e.target.value) }}
              style={{ ...inputStyle, width: 148 }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ ...label, marginBottom: 0 }}>Até</span>
            <input
              type="date"
              value={to}
              onChange={e => { setPeriod('custom'); setToDate(e.target.value) }}
              style={{ ...inputStyle, width: 148 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all .2s',
                  background: period === p.key ? 'rgba(201,168,76,.18)' : 'rgba(255,255,255,.03)',
                  border: period === p.key ? '1px solid rgba(201,168,76,.65)' : '1px solid rgba(201,168,76,.12)',
                  color: period === p.key ? '#C9A84C' : 'rgba(245,240,232,.6)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <div className="w-8 h-8 rounded-full animate-spin"
            style={{ border: '2px solid rgba(201,168,76,.2)', borderTopColor: '#C9A84C' }} />
        </div>
      ) : (
        <>
          {/* Meu faturamento */}
          <div style={card}>
            <span style={label}>Meu faturamento — {periodLabel}</span>
            <p style={{
              fontSize: 34, fontWeight: 300, color: '#C9A84C', marginTop: 10, marginBottom: 10,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>
              {fmt(total)}
            </p>
            <p style={{ fontSize: 13, color: 'rgba(245,240,232,.5)' }}>
              Agendamentos: {fmt(totalConfirmed)} &nbsp;•&nbsp; Avulsos: {fmt(totalWalkin)}
            </p>
          </div>

          {/* Meta do mês */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 400 }}>Meta do mês</span>
              <button
                onClick={() => setShowGoalInput(v => !v)}
                style={{ fontSize: 13, color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.02em' }}
              >
                Definir meta
              </button>
            </div>

            {goal ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: 'rgba(245,240,232,.5)' }}>{fmt(total)} faturado</span>
                  <span style={{ fontSize: 13, color: 'rgba(245,240,232,.5)' }}>Meta: {fmt(goal.target_amount)}</span>
                </div>
                <div style={{ width: '100%', height: 5, borderRadius: 99, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99, transition: 'width .7s ease',
                    width: `${goalProgress}%`,
                    background: 'linear-gradient(90deg, #A07830, #C9A84C, #E4C96A)',
                  }} />
                </div>
                <p style={{ fontSize: 12, color: 'rgba(245,240,232,.4)', marginTop: 8 }}>
                  {goalProgress >= 100 ? '🎉 Meta atingida!' : `Faltam ${fmt(goal.target_amount - total)} para a meta`}
                </p>
              </>
            ) : (
              <p style={{ fontSize: 13, color: 'rgba(245,240,232,.4)' }}>Nenhuma meta definida para este mês.</p>
            )}

            {showGoalInput && (
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <input
                  type="number"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  placeholder="Valor da meta (R$)"
                  style={inputStyle}
                />
                <button
                  onClick={saveGoal}
                  disabled={savingGoal}
                  style={{
                    padding: '10px 20px', borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap',
                    background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.4)',
                    color: '#C9A84C', fontSize: 14,
                  }}
                >
                  {savingGoal ? '...' : 'Salvar'}
                </button>
              </div>
            )}
          </div>

          {/* Faturamento da equipe */}
          {isOwner && (
            <div style={card}>
              <span style={label}>Equipe — {periodLabel}</span>
              <div style={{ marginTop: 10, marginBottom: 20 }}>
                <span style={{ ...label, marginBottom: 4 }}>Total geral</span>
                <p style={{
                  fontSize: 34, fontWeight: 300, color: '#C9A84C',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}>
                  {fmt(Object.values(teamRecords).flat().reduce((s, r) => s + r.amount, 0))}
                </p>
              </div>
              <div>
                {allPros.map((pro, i) => {
                  const proTotal = (teamRecords[pro.id] ?? []).reduce((s, r) => s + r.amount, 0)
                  return (
                    <div key={pro.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '13px 0',
                      borderBottom: i < allPros.length - 1 ? '1px solid rgba(201,168,76,.08)' : 'none',
                    }}>
                      <span style={{ fontSize: 14, color: '#F5F0E8' }}>{pro.name}</span>
                      <span style={{ fontSize: 14, color: '#C9A84C' }}>{fmt(proTotal)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Registros */}
          {records.length > 0 && (
            <div>
              <span style={{ ...label, marginBottom: 12, display: 'block' }}>Registros do período</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {records.map(rec => (
                  <div key={rec.id} style={{
                    ...card, padding: '14px 22px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <p style={{ fontSize: 14, color: '#F5F0E8' }}>{rec.description}</p>
                      <p style={{ fontSize: 12, color: 'rgba(245,240,232,.4)', marginTop: 3 }}>
                        {new Date(rec.recorded_at).toLocaleDateString('pt-BR')} · {rec.type === 'walkin' ? 'Avulso' : 'Agendamento'}
                      </p>
                    </div>
                    <p style={{ fontSize: 18, color: '#C9A84C', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
                      {fmt(rec.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}