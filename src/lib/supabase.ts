  import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Professional {
  id: string
  name: string
  email: string
  bio: string
  photo_url: string
  whatsapp: string
  instagram: string
  active: boolean
  display_order: number
}

export interface Service {
  id: string
  professional_id: string
  name: string
  duration_minutes: number
  price: number
  active: boolean
}

export interface Appointment {
  id: string
  professional_id: string
  client_name: string
  client_phone: string
  service_id: string
  scheduled_at: string
  status: 'pending' | 'confirmed' | 'no_show' | 'cancelled'
  amount: number
  notes?: string
  created_at: string
}

export interface TimeSlot {
  id: string
  professional_id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  appointment_id?: string
  is_blocked: boolean
}

export interface FinancialRecord {
  id: string
  professional_id: string
  description: string
  amount: number
  type: 'appointment' | 'walkin'
  recorded_at: string
}

export interface Goal {
  id: string
  professional_id: string
  month: string // YYYY-MM
  target_amount: number
}