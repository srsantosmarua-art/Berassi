import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch all active professionals with their default schedules
    const { data: professionals } = await supabase
      .from('professionals')
      .select('id')
      .eq('active', true)

    if (!professionals) return NextResponse.json({ ok: true, generated: 0 })

    let generated = 0
    const today = new Date()
    // Adjust to Brasília time (UTC-3)
    today.setHours(today.getHours() - 3)

    for (const pro of professionals) {
      // Fetch default schedule for this professional
      const { data: defaultSchedule } = await supabase
        .from('default_schedules')
        .select('*')
        .eq('professional_id', pro.id)

      if (!defaultSchedule || defaultSchedule.length === 0) continue

      // Fetch blocked days in the next 45 days
      const endDate = new Date(today)
      endDate.setDate(endDate.getDate() + 45)
      const fromStr = today.toISOString().split('T')[0]
      const toStr = endDate.toISOString().split('T')[0]

      const { data: blockedDays } = await supabase
        .from('time_slots')
        .select('date')
        .eq('professional_id', pro.id)
        .eq('is_blocked', true)
        .gte('date', fromStr)
        .lte('date', toStr)

      const blockedSet = new Set((blockedDays ?? []).map(b => b.date))

      // Fetch existing slots to avoid duplicates
      const { data: existingSlots } = await supabase
        .from('time_slots')
        .select('date, start_time')
        .eq('professional_id', pro.id)
        .gte('date', fromStr)
        .lte('date', toStr)

      const existingSet = new Set(
        (existingSlots ?? []).map(s => `${s.date}_${s.start_time}`)
      )

      // Generate slots for the next 45 days
      for (let i = 1; i <= 45; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() + i)
        const dateStr = d.toISOString().split('T')[0]
        const dayOfWeek = d.getDay() // 0 = Sun, 1 = Mon ...

        if (blockedSet.has(dateStr)) continue

        // Find schedules for this day of week
        const daySchedules = defaultSchedule.filter(s => s.day_of_week === dayOfWeek)

        for (const sched of daySchedules) {
          const key = `${dateStr}_${sched.start_time}`
          if (existingSet.has(key)) continue

          await supabase.from('time_slots').insert({
            professional_id: pro.id,
            date: dateStr,
            start_time: sched.start_time,
            end_time: sched.end_time,
            is_available: true,
            is_blocked: false,
          })
          generated++
        }
      }
    }

    return NextResponse.json({ ok: true, generated })
  } catch (err) {
    console.error('Cron error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}