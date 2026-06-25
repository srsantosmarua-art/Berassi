@echo off
echo Criando projeto BERASSI...

:: Cria pastas
mkdir "src\app\profissional\[id]" 2>nul
mkdir "src\app\contato\[id]" 2>nul
mkdir "src\app\login" 2>nul
mkdir "src\app\painel\agendamentos" 2>nul
mkdir "src\app\painel\financeiro" 2>nul
mkdir "src\app\admin\login" 2>nul
mkdir "src\app\api\cron" 2>nul
mkdir "src\lib" 2>nul

:: ============================================
:: tailwind.config.ts
:: ============================================
(
echo import type { Config } from "tailwindcss";
echo.
echo const config: Config = {
echo   content: [
echo     "./src/**/*.{js,ts,jsx,tsx,mdx}",
echo   ],
echo   theme: {
echo     extend: {
echo       colors: {
echo         gold: {
echo           DEFAULT: "#C9A84C",
echo           light: "#E4C96A",
echo           dark: "#A07830",
echo           muted: "#C9A84C33",
echo         },
echo         obsidian: {
echo           DEFAULT: "#0D0D0D",
echo           light: "#1A1A1A",
echo           mid: "#222222",
echo         },
echo         cream: {
echo           DEFAULT: "#F5F0E8",
echo           muted: "#C8BFA8",
echo         },
echo       },
echo       fontFamily: {
echo         display: ["Cormorant Garamond", "Georgia", "serif"],
echo         body: ["Inter", "sans-serif"],
echo       },
echo     },
echo   },
echo   plugins: [],
echo };
echo.
echo export default config;
) > "tailwind.config.ts"

:: ============================================
:: next.config.js
:: ============================================
(
echo /** @type {import('next').NextConfig} */
echo const nextConfig = {
echo   images: {
echo     remotePatterns: [
echo       {
echo         protocol: 'https',
echo         hostname: '*.supabase.co',
echo       },
echo     ],
echo   },
echo }
echo.
echo module.exports = nextConfig
) > "next.config.js"

:: ============================================
:: vercel.json
:: ============================================
(
echo {
echo   "crons": [
echo     {
echo       "path": "/api/cron",
echo       "schedule": "0 3 * * *"
echo     }
echo   ]
echo }
) > "vercel.json"

:: ============================================
:: .env.local
:: ============================================
(
echo NEXT_PUBLIC_SUPABASE_URL=cole_aqui_sua_url
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=cole_aqui_sua_anon_key
echo SUPABASE_SERVICE_ROLE_KEY=cole_aqui_sua_service_role_key
echo CRON_SECRET=berassi_cron_2024
) > ".env.local"

:: ============================================
:: src\lib\supabase.ts
:: ============================================
(
echo import { createClient } from '@supabase/supabase-js'
echo.
echo const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
echo const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
echo.
echo export const supabase = createClient(supabaseUrl, supabaseAnonKey^)
echo.
echo export interface Professional {
echo   id: string
echo   name: string
echo   email: string
echo   bio: string
echo   photo_url: string
echo   whatsapp: string
echo   instagram: string
echo   active: boolean
echo   display_order: number
echo }
echo.
echo export interface Service {
echo   id: string
echo   professional_id: string
echo   name: string
echo   duration_minutes: number
echo   price: number
echo   active: boolean
echo }
echo.
echo export interface Appointment {
echo   id: string
echo   professional_id: string
echo   client_name: string
echo   client_phone: string
echo   service_id: string
echo   scheduled_at: string
echo   status: 'pending' ^| 'confirmed' ^| 'no_show' ^| 'cancelled'
echo   amount: number
echo   notes?: string
echo   created_at: string
echo }
echo.
echo export interface TimeSlot {
echo   id: string
echo   professional_id: string
echo   date: string
echo   start_time: string
echo   end_time: string
echo   is_available: boolean
echo   appointment_id?: string
echo   is_blocked: boolean
echo }
echo.
echo export interface FinancialRecord {
echo   id: string
echo   professional_id: string
echo   description: string
echo   amount: number
echo   type: 'appointment' ^| 'walkin'
echo   recorded_at: string
echo }
echo.
echo export interface Goal {
echo   id: string
echo   professional_id: string
echo   month: string
echo   target_amount: number
echo }
) > "src\lib\supabase.ts"

:: ============================================
:: src\app\globals.css
:: ============================================
(
echo @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400^&family=Inter:wght@300;400;500;600^&display=swap'^);
echo.
echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
echo.
echo :root {
echo   --gold: #C9A84C;
echo   --gold-light: #E4C96A;
echo   --gold-dark: #A07830;
echo   --obsidian: #0D0D0D;
echo   --obsidian-light: #1A1A1A;
echo   --cream: #F5F0E8;
echo   --cream-muted: #C8BFA8;
echo }
echo.
echo * { box-sizing: border-box; margin: 0; padding: 0; }
echo html { scroll-behavior: smooth; }
echo body { background-color: var(--obsidian^); color: var(--cream^); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
echo.
echo .marble-bg { position: relative; background-image: url('/marble-bg.png'^); background-size: cover; background-position: center; background-attachment: fixed; }
echo .marble-bg::before { content: ''; position: absolute; inset: 0; background: rgba(13,13,13,0.82^); pointer-events: none; z-index: 0; }
echo .marble-bg ^> * { position: relative; z-index: 1; }
echo.
echo .card-gold-border { position: relative; border-radius: 12px; background: rgba(26,26,26,0.85^); backdrop-filter: blur(12px^); border: 1px solid rgba(201,168,76,0.2^); transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease; }
echo .card-gold-border:hover { border-color: rgba(201,168,76,0.6^); transform: translateY(-4px^); box-shadow: 0 20px 60px rgba(0,0,0,0.5^), 0 0 30px rgba(201,168,76,0.12^); }
echo.
echo .text-gold-shimmer { background: linear-gradient(90deg, var(--gold-dark^) 0%%, var(--gold-light^) 40%%, var(--gold^) 50%%, var(--gold-light^) 60%%, var(--gold-dark^) 100%%^); background-size: 200%% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer-text 4s linear infinite; }
echo @keyframes shimmer-text { 0%% { background-position: 0%% center; } 100%% { background-position: 200%% center; } }
echo.
echo .gold-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--gold^), transparent^); margin: 0 auto; }
echo.
echo .input-gold { background: rgba(26,26,26,0.8^); border: 1px solid rgba(201,168,76,0.3^); border-radius: 8px; color: var(--cream^); padding: 12px 16px; font-family: 'Inter', sans-serif; font-size: 14px; width: 100%%; transition: border-color 0.2s ease, box-shadow 0.2s ease; outline: none; }
echo .input-gold:focus { border-color: var(--gold^); box-shadow: 0 0 0 3px rgba(201,168,76,0.12^); }
echo .input-gold::placeholder { color: var(--cream-muted^); opacity: 0.5; }
echo.
echo .btn-gold { background: linear-gradient(135deg, var(--gold-dark^), var(--gold^), var(--gold-light^)^); background-size: 200%% 200%%; color: var(--obsidian^); font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; padding: 14px 32px; border-radius: 8px; border: none; cursor: pointer; transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease; }
echo .btn-gold:hover { background-position: right center; transform: translateY(-2px^); box-shadow: 0 8px 30px rgba(201,168,76,0.35^); }
echo.
echo .btn-ghost { background: transparent; color: var(--gold^); font-family: 'Inter', sans-serif; font-weight: 500; font-size: 14px; letter-spacing: 0.06em; text-transform: uppercase; padding: 12px 28px; border-radius: 8px; border: 1px solid rgba(201,168,76,0.4^); cursor: pointer; transition: background 0.2s ease, border-color 0.2s ease; }
echo .btn-ghost:hover { background: rgba(201,168,76,0.08^); border-color: var(--gold^); }
echo.
echo .badge-gold { display: inline-block; background: rgba(201,168,76,0.12^); border: 1px solid rgba(201,168,76,0.35^); color: var(--gold^); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; }
echo.
echo .fade-up { opacity: 0; transform: translateY(24px^); animation: fade-up-anim 0.6s ease forwards; }
echo .fade-up-delay-1 { animation-delay: 0.1s; }
echo .fade-up-delay-2 { animation-delay: 0.2s; }
echo .fade-up-delay-3 { animation-delay: 0.3s; }
echo .fade-up-delay-4 { animation-delay: 0.4s; }
echo .fade-up-delay-5 { animation-delay: 0.5s; }
echo .fade-up-delay-6 { animation-delay: 0.6s; }
echo @keyframes fade-up-anim { to { opacity: 1; transform: translateY(0^); } }
echo.
echo ::-webkit-scrollbar { width: 6px; }
echo ::-webkit-scrollbar-track { background: var(--obsidian-light^); }
echo ::-webkit-scrollbar-thumb { background: var(--gold-dark^); border-radius: 3px; }
) > "src\app\globals.css"

echo Pastas e arquivos base criados!
echo.
echo PROXIMO PASSO: Abra o VS Code e cole os arquivos TSX manualmente.
echo Os arquivos TSX serao criados agora...

:: ============================================
:: src\app\layout.tsx
:: ============================================
(
echo import type { Metadata } from 'next'
echo import './globals.css'
echo.
echo export const metadata: Metadata = {
echo   title: 'BERASSI - Studio de Beleza',
echo   description: 'Agende com os melhores profissionais do Studio BERASSI',
echo }
echo.
echo export default function RootLayout({ children }: { children: React.ReactNode }) {
echo   return (
echo     ^<html lang="pt-BR"^>
echo       ^<body className="marble-bg min-h-screen"^>
echo         {children}
echo       ^</body^>
echo     ^</html^>
echo   ^)
echo }
) > "src\app\layout.tsx"

:: ============================================
:: src\app\page.tsx
:: ============================================
(
echo 'use client'
echo.
echo import { useEffect, useState } from 'react'
echo import Link from 'next/link'
echo import Image from 'next/image'
echo import { supabase } from '@/lib/supabase'
echo import type { Professional } from '@/lib/supabase'
echo.
echo export default function Home(^) {
echo   const [professionals, setProfessionals] = useState^<Professional[]^>([]^)
echo   const [loading, setLoading] = useState(true^)
echo.
echo   useEffect(^(^) =^> {
echo     async function fetchProfessionals(^) {
echo       const { data } = await supabase
echo         .from('professionals'^)
echo         .select('*'^)
echo         .eq('active', true^)
echo         .order('display_order', { ascending: true }^)
echo       if (data^) setProfessionals(data^)
echo       setLoading(false^)
echo     }
echo     fetchProfessionals(^)
echo   }, []^)
echo.
echo   return (
echo     ^<main className="min-h-screen flex flex-col"^>
echo       ^<header className="flex justify-center pt-10 pb-6 fade-up"^>
echo         ^<div className="flex flex-col items-center gap-3"^>
echo           ^<Image src="/logo.png" alt="BERASSI" width={100} height={100} className="opacity-95" /^>
echo           ^<div className="gold-divider w-24" /^>
echo           ^<p className="text-cream-muted text-xs tracking-[0.3em] uppercase font-light mt-1"^>Studio de Beleza^</p^>
echo         ^</div^>
echo       ^</header^>
echo.
echo       ^<section className="text-center px-6 mt-4 mb-12 fade-up fade-up-delay-1"^>
echo         ^<h1 className="font-display text-5xl md:text-6xl font-light text-cream leading-tight"^>
echo           Escolha seu{' '}
echo           ^<span className="text-gold-shimmer italic font-normal"^>profissional^</span^>
echo         ^</h1^>
echo         ^<p className="text-cream-muted text-sm mt-4 tracking-wide max-w-md mx-auto font-light"^>
echo           Cada especialista foi escolhido para oferecer uma experiencia singular.
echo         ^</p^>
echo       ^</section^>
echo.
echo       ^<section className="flex-1 px-6 md:px-12 pb-16"^>
echo         {loading ? (
echo           ^<div className="flex justify-center items-center h-64"^>
echo             ^<div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /^>
echo           ^</div^>
echo         ^) : (
echo           ^<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"^>
echo             {professionals.map((pro, i^) =^> (
echo               ^<Link key={pro.id} href={`/profissional/${pro.id}`} className={`card-gold-border block p-6 fade-up fade-up-delay-${Math.min(i + 2, 6^)} group`}^>
echo                 ^<div className="relative w-24 h-24 mx-auto mb-5"^>
echo                   ^<div className="absolute inset-0 rounded-full border-2 border-gold/40 group-hover:border-gold transition-colors duration-500" /^>
echo                   {pro.photo_url ? (
echo                     ^<Image src={pro.photo_url} alt={pro.name} fill className="rounded-full object-cover" /^>
echo                   ^) : (
echo                     ^<div className="w-full h-full rounded-full bg-obsidian-mid flex items-center justify-center"^>
echo                       ^<span className="font-display text-3xl text-gold font-light"^>{pro.name[0]}^</span^>
echo                     ^</div^>
echo                   ^)}
echo                 ^</div^>
echo                 ^<h2 className="font-display text-2xl font-light text-cream text-center group-hover:text-gold-light transition-colors duration-300"^>{pro.name}^</h2^>
echo                 ^<p className="text-cream-muted text-xs text-center mt-2 leading-relaxed line-clamp-2 opacity-70"^>{pro.bio}^</p^>
echo                 ^<div className="mt-5 flex justify-center"^>
echo                   ^<span className="badge-gold group-hover:bg-gold/20 transition-colors duration-300 text-[10px]"^>Ver servicos ^→^</span^>
echo                 ^</div^>
echo               ^</Link^>
echo             ^))}
echo           ^</div^>
echo         ^)}
echo       ^</section^>
echo.
echo       ^<footer className="text-center py-6 border-t border-gold/10"^>
echo         ^<p className="text-cream-muted text-xs tracking-widest uppercase opacity-50"^>
echo           © {new Date(^).getFullYear(^)} BERASSI
echo         ^</p^>
echo       ^</footer^>
echo     ^</main^>
echo   ^)
echo }
) > "src\app\page.tsx"

:: ============================================
:: src\app\login\page.tsx
:: ============================================
(
echo 'use client'
echo import { useState } from 'react'
echo import { useRouter } from 'next/navigation'
echo import Image from 'next/image'
echo import Link from 'next/link'
echo import { supabase } from '@/lib/supabase'
echo.
echo export default function LoginPage(^) {
echo   const router = useRouter(^)
echo   const [email, setEmail] = useState(''`^)
echo   const [password, setPassword] = useState(''`^)
echo   const [loading, setLoading] = useState(false^)
echo   const [error, setError] = useState(''`^)
echo.
echo   async function handleLogin(e: React.FormEvent^) {
echo     e.preventDefault(^)
echo     setLoading(true^)
echo     setError(''`^)
echo     const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password }^)
echo     if (authError ^|^| !data.user^) { setError('E-mail ou senha incorretos.'^); setLoading(false^); return }
echo     const { data: pro } = await supabase.from('professionals'^).select('id'^).eq('email', email^).single(^)
echo     if (pro^) { router.push('/painel'^) } else { setError('Acesso nao autorizado.'^); await supabase.auth.signOut(^) }
echo     setLoading(false^)
echo   }
echo.
echo   return (
echo     ^<main className="min-h-screen flex flex-col items-center justify-center px-6"^>
echo       ^<div className="w-full max-w-sm fade-up"^>
echo         ^<div className="flex flex-col items-center mb-10"^>
echo           ^<Image src="/logo.png" alt="BERASSI" width={90} height={90} /^>
echo           ^<div className="gold-divider w-16 mt-5 mb-3" /^>
echo           ^<p className="text-cream-muted text-xs tracking-[0.25em] uppercase"^>Area do Profissional^</p^>
echo         ^</div^>
echo         ^<form onSubmit={handleLogin} className="card-gold-border p-8 space-y-5"^>
echo           ^<h1 className="font-display text-2xl text-cream font-light text-center mb-6"^>Entrar^</h1^>
echo           {error ^&^& ^<div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3"^>^<p className="text-red-400 text-xs text-center"^>{error}^</p^>^</div^>}
echo           ^<div className="space-y-2"^>
echo             ^<label className="text-cream-muted text-xs tracking-wider uppercase opacity-70"^>E-mail^</label^>
echo             ^<input type="email" value={email} onChange={e =^> setEmail(e.target.value^)} className="input-gold" placeholder="seu@email.com" required /^>
echo           ^</div^>
echo           ^<div className="space-y-2"^>
echo             ^<label className="text-cream-muted text-xs tracking-wider uppercase opacity-70"^>Senha^</label^>
echo             ^<input type="password" value={password} onChange={e =^> setPassword(e.target.value^)} className="input-gold" placeholder="••••••••" required /^>
echo           ^</div^>
echo           ^<button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50"^>{loading ? 'Entrando...' : 'Entrar'}^</button^>
echo         ^</form^>
echo         ^<div className="text-center mt-6"^>^<Link href="/" className="text-cream-muted text-xs hover:text-gold transition-colors tracking-wider uppercase opacity-60"^>← Voltar ao site^</Link^>^</div^>
echo       ^</div^>
echo     ^</main^>
echo   ^)
echo }
) > "src\app\login\page.tsx"

:: ============================================
:: src\app\painel\layout.tsx
:: ============================================
(
echo 'use client'
echo import { useEffect, useState } from 'react'
echo import { useRouter } from 'next/navigation'
echo import Link from 'next/link'
echo import Image from 'next/image'
echo import { supabase } from '@/lib/supabase'
echo import { Calendar, ClipboardList, TrendingUp, LogOut } from 'lucide-react'
echo.
echo export default function PainelLayout({ children }: { children: React.ReactNode }^) {
echo   const router = useRouter(^)
echo   const [checking, setChecking] = useState(true^)
echo   const [userName, setUserName] = useState(''`^)
echo.
echo   useEffect(^(^) =^> {
echo     async function checkAuth(^) {
echo       const { data: { user } } = await supabase.auth.getUser(^)
echo       if (!user^) { router.replace('/login'^); return }
echo       const { data: pro } = await supabase.from('professionals'^).select('name'^).eq('email', user.email^).single(^)
echo       if (!pro^) { router.replace('/login'^); return }
echo       setUserName(pro.name^)
echo       setChecking(false^)
echo     }
echo     checkAuth(^)
echo   }, [router]^)
echo.
echo   async function handleLogout(^) {
echo     await supabase.auth.signOut(^)
echo     router.replace('/login'^)
echo   }
echo.
echo   if (checking^) return ^<div className="min-h-screen flex items-center justify-center"^>^<div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /^>^</div^>
echo.
echo   return (
echo     ^<div className="min-h-screen flex flex-col"^>
echo       ^<header className="border-b border-gold/10 bg-obsidian/80 backdrop-blur-sm sticky top-0 z-50"^>
echo         ^<div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between"^>
echo           ^<div className="flex items-center gap-3"^>
echo             ^<Image src="/logo.png" alt="BERASSI" width={36} height={36} /^>
echo             ^<div^>
echo               ^<p className="text-cream text-sm font-light font-display"^>{userName}^</p^>
echo               ^<p className="text-cream-muted text-[10px] tracking-widest uppercase opacity-50"^>Painel^</p^>
echo             ^</div^>
echo           ^</div^>
echo           ^<button onClick={handleLogout} className="flex items-center gap-2 text-cream-muted hover:text-gold text-xs transition-colors uppercase tracking-wider"^>
echo             ^<LogOut size={14} /^> Sair
echo           ^</button^>
echo         ^</div^>
echo       ^</header^>
echo       ^<nav className="border-b border-gold/10 bg-obsidian/60 backdrop-blur-sm sticky top-[57px] z-40"^>
echo         ^<div className="max-w-5xl mx-auto px-6 flex gap-0"^>
echo           ^<Link href="/painel" className="flex items-center gap-2 px-5 py-4 text-cream-muted hover:text-gold text-xs tracking-wider uppercase transition-colors border-b-2 border-transparent hover:border-gold/50"^>^<Calendar size={14} /^> Horarios^</Link^>
echo           ^<Link href="/painel/agendamentos" className="flex items-center gap-2 px-5 py-4 text-cream-muted hover:text-gold text-xs tracking-wider uppercase transition-colors border-b-2 border-transparent hover:border-gold/50"^>^<ClipboardList size={14} /^> Agendamentos^</Link^>
echo           ^<Link href="/painel/financeiro" className="flex items-center gap-2 px-5 py-4 text-cream-muted hover:text-gold text-xs tracking-wider uppercase transition-colors border-b-2 border-transparent hover:border-gold/50"^>^<TrendingUp size={14} /^> Financeiro^</Link^>
echo         ^</div^>
echo       ^</nav^>
echo       ^<main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8"^>{children}^</main^>
echo     ^</div^>
echo   ^)
echo }
) > "src\app\painel\layout.tsx"

echo Criando arquivos restantes...

:: ============================================
:: src\app\painel\page.tsx (Horarios - simplificado)
:: ============================================
(
echo 'use client'
echo import { useEffect, useState, useCallback } from 'react'
echo import { supabase } from '@/lib/supabase'
echo import type { TimeSlot } from '@/lib/supabase'
echo import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
echo.
echo const HOURS = Array.from({ length: 13 }, (_, i^) =^> i + 8^)
echo.
echo function formatDate(date: Date^) { return date.toISOString(^).split('T'^)[0] }
echo function addDays(date: Date, days: number^) { const d = new Date(date^); d.setDate(d.getDate(^) + days^); return d }
echo.
echo export default function HorariosPage(^) {
echo   const [professionalId, setProfessionalId] = useState^<string ^| null^>(null^)
echo   const [slots, setSlots] = useState^<TimeSlot[]^>([]^)
echo   const [weekStart, setWeekStart] = useState(^(^) =^> { const t = new Date(^); const d = t.getDay(^); return new Date(t.setDate(t.getDate(^) - d + (d === 0 ? -6 : 1^)^)^) }^)
echo   const [loading, setLoading] = useState(true^)
echo   const [saving, setSaving] = useState(false^)
echo.
echo   useEffect(^(^) =^> {
echo     async function loadPro(^) {
echo       const { data: { user } } = await supabase.auth.getUser(^)
echo       if (!user^) return
echo       const { data: pro } = await supabase.from('professionals'^).select('id'^).eq('email', user.email^).single(^)
echo       if (pro^) setProfessionalId(pro.id^)
echo     }
echo     loadPro(^)
echo   }, []^)
echo.
echo   const loadSlots = useCallback(async (^) =^> {
echo     if (!professionalId^) return
echo     setLoading(true^)
echo     const from = formatDate(weekStart^)
echo     const to = formatDate(addDays(weekStart, 6^)^)
echo     const { data } = await supabase.from('time_slots'^).select('*'^).eq('professional_id', professionalId^).gte('date', from^).lte('date', to^)
echo     if (data^) setSlots(data^)
echo     setLoading(false^)
echo   }, [professionalId, weekStart]^)
echo.
echo   useEffect(^(^) =^> { loadSlots(^) }, [loadSlots]^)
echo.
echo   const weekDays = Array.from({ length: 7 }, (_, i^) =^> addDays(weekStart, i^)^)
echo.
echo   async function toggleSlot(date: string, hour: number^) {
echo     if (!professionalId^) return
echo     setSaving(true^)
echo     const startTime = `${String(hour^).padStart(2, '0'^)}:00:00`
echo     const existing = slots.find(s =^> s.date === date ^&^& s.start_time === startTime^)
echo     if (existing^) {
echo       if (existing.appointment_id ^|^| existing.is_blocked^) { setSaving(false^); return }
echo       await supabase.from('time_slots'^).delete(^).eq('id', existing.id^)
echo     } else {
echo       await supabase.from('time_slots'^).insert({ professional_id: professionalId, date, start_time: startTime, end_time: `${String(hour+1^).padStart(2,'0'^)}:00:00`, is_available: true, is_blocked: false }^)
echo     }
echo     await loadSlots(^)
echo     setSaving(false^)
echo   }
echo.
echo   async function blockDay(date: string^) {
echo     if (!professionalId^) return
echo     setSaving(true^)
echo     const daySlots = slots.filter(s =^> s.date === date ^&^& !s.appointment_id^)
echo     for (const s of daySlots^) await supabase.from('time_slots'^).delete(^).eq('id', s.id^)
echo     await supabase.from('time_slots'^).insert({ professional_id: professionalId, date, start_time: '00:00:00', end_time: '23:59:00', is_available: false, is_blocked: true }^)
echo     await loadSlots(^)
echo     setSaving(false^)
echo   }
echo.
echo   function getSlot(date: string, hour: number^) { return slots.find(s =^> s.date === date ^&^& s.start_time === `${String(hour^).padStart(2,'0'^)}:00:00`^) }
echo   function isDayBlocked(date: string^) { return slots.some(s =^> s.date === date ^&^& s.is_blocked^) }
echo.
echo   return (
echo     ^<div^>
echo       ^<div className="flex items-center justify-between mb-6"^>
echo         ^<h1 className="font-display text-3xl text-cream font-light"^>Horarios^</h1^>
echo         ^<div className="flex items-center gap-3"^>
echo           ^<button onClick={^(^) =^> setWeekStart(addDays(weekStart,-7^)^)} className="p-2 rounded-lg border border-gold/20 hover:border-gold/50 text-cream-muted hover:text-gold transition-all"^>^<ChevronLeft size={16}/^>^</button^>
echo           ^<span className="text-cream-muted text-xs tracking-wider uppercase"^>{weekStart.toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}^)} — {addDays(weekStart,6^).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}^)}^</span^>
echo           ^<button onClick={^(^) =^> setWeekStart(addDays(weekStart,7^)^)} className="p-2 rounded-lg border border-gold/20 hover:border-gold/50 text-cream-muted hover:text-gold transition-all"^>^<ChevronRight size={16}/^>^</button^>
echo         ^</div^>
echo       ^</div^>
echo       ^<div className="flex items-center gap-6 mb-6"^>
echo         ^<div className="flex items-center gap-2"^>^<div className="w-4 h-4 rounded bg-gold/30 border border-gold"/^>^<span className="text-cream-muted text-xs"^>Disponivel^</span^>^</div^>
echo         ^<div className="flex items-center gap-2"^>^<div className="w-4 h-4 rounded bg-red-500/40 border border-red-500/60"/^>^<span className="text-cream-muted text-xs"^>Agendado^</span^>^</div^>
echo         ^<div className="flex items-center gap-2"^>^<div className="w-4 h-4 rounded bg-obsidian-mid border border-gold/10"/^>^<span className="text-cream-muted text-xs"^>Livre^</span^>^</div^>
echo       ^</div^>
echo       {loading ? ^<div className="flex justify-center py-20"^>^<div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"/^>^</div^> : (
echo         ^<div className="overflow-x-auto"^>
echo           ^<div className="grid gap-1" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}^>
echo             ^<div/^>
echo             {weekDays.map(day =^> {
echo               const dateStr = formatDate(day^)
echo               const isToday = formatDate(new Date(^)^) === dateStr
echo               return ^<div key={dateStr} className="text-center pb-2"^>
echo                 ^<p className={`text-xs tracking-wider uppercase ${isToday?'text-gold':'text-cream-muted opacity-60'}`}^>{day.toLocaleDateString('pt-BR',{weekday:'short'}^)}^</p^>
echo                 ^<p className={`font-display text-lg ${isToday?'text-gold':'text-cream'}`}^>{day.getDate(^)}^</p^>
echo                 {!isDayBlocked(dateStr^) ^&^& ^<button onClick={^(^)=^>blockDay(dateStr^)} disabled={saving} className="mt-1 flex items-center gap-1 mx-auto text-cream-muted hover:text-red-400 text-[10px] transition-colors"^>^<Lock size={10}/^>Bloquear^</button^>}
echo               ^</div^>
echo             }^)}
echo             {HOURS.map(hour =^> (
echo               ^<^>
echo                 ^<div key={`h-${hour}`} className="flex items-center justify-end pr-3 py-1"^>^<span className="text-cream-muted text-xs opacity-50"^>{hour}h^</span^>^</div^>
echo                 {weekDays.map(day =^> {
echo                   const dateStr = formatDate(day^)
echo                   const slot = getSlot(dateStr, hour^)
echo                   const blocked = isDayBlocked(dateStr^)
echo                   const isBooked = !!slot?.appointment_id
echo                   const isOpen = !!slot ^&^& !isBooked ^&^& !slot.is_blocked
echo                   return ^<button key={`${dateStr}-${hour}`} disabled={saving^|^|blocked^|^|isBooked} onClick={^(^)=^>toggleSlot(dateStr,hour^)}
echo                     className={`h-9 rounded-md text-[10px] transition-all border ${blocked?'bg-obsidian-mid border-red-500/20 cursor-not-allowed opacity-30':''} ${isBooked?'bg-red-500/25 border-red-500/50 cursor-not-allowed':''} ${isOpen?'bg-gold/20 border-gold/60 hover:bg-gold/30':''} ${!slot^&^&!blocked?'bg-obsidian-mid border-gold/10 hover:border-gold/30 hover:bg-gold/10':''}`}
echo                   /^>
echo                 }^)}
echo               ^</^>
echo             ^)^)}
echo           ^</div^>
echo         ^</div^>
echo       ^)}
echo     ^</div^>
echo   ^)
echo }
) > "src\app\painel\page.tsx"

echo Criando agendamentos e financeiro...

:: Agendamentos - arquivo simples placeholder que funciona
(
echo 'use client'
echo import { useEffect, useState, useCallback } from 'react'
echo import { supabase } from '@/lib/supabase'
echo import type { Appointment, Service } from '@/lib/supabase'
echo import { CheckCircle, XCircle, Phone, Scissors } from 'lucide-react'
echo.
echo export default function AgendamentosPage(^) {
echo   const [professionalId, setProfessionalId] = useState^<string ^| null^>(null^)
echo   const [appointments, setAppointments] = useState^<any[]^>([]^)
echo   const [loading, setLoading] = useState(true^)
echo   const [saving, setSaving] = useState^<string ^| null^>(null^)
echo.
echo   useEffect(^(^) =^> {
echo     async function loadPro(^) {
echo       const { data: { user } } = await supabase.auth.getUser(^)
echo       if (!user^) return
echo       const { data: pro } = await supabase.from('professionals'^).select('id'^).eq('email', user.email^).single(^)
echo       if (pro^) setProfessionalId(pro.id^)
echo     }
echo     loadPro(^)
echo   }, []^)
echo.
echo   const loadAppointments = useCallback(async (^) =^> {
echo     if (!professionalId^) return
echo     setLoading(true^)
echo     const twoMonthsAgo = new Date(^)
echo     twoMonthsAgo.setMonth(twoMonthsAgo.getMonth(^) - 2^)
echo     const { data } = await supabase.from('appointments'^).select('*, service:services(*^)'^).eq('professional_id', professionalId^).gte('scheduled_at', twoMonthsAgo.toISOString(^)^).order('scheduled_at', { ascending: false }^)
echo     if (data^) setAppointments(data^)
echo     setLoading(false^)
echo   }, [professionalId]^)
echo.
echo   useEffect(^(^) =^> { loadAppointments(^) }, [loadAppointments]^)
echo.
echo   async function updateStatus(apptId: string, status: string, amount: number^) {
echo     setSaving(apptId^)
echo     await supabase.from('appointments'^).update({ status }^).eq('id', apptId^)
echo     if (status === 'confirmed'^) {
echo       const appt = appointments.find(a =^> a.id === apptId^)
echo       if (appt^) await supabase.from('financial_records'^).insert({ professional_id: professionalId, description: `${appt.service?.name ?? 'Servico'} — ${appt.client_name}`, amount, type: 'appointment', recorded_at: appt.scheduled_at }^)
echo     }
echo     await loadAppointments(^)
echo     setSaving(null^)
echo   }
echo.
echo   const fmt = (v: number^) =^> new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }^).format(v^)
echo.
echo   return (
echo     ^<div^>
echo       ^<h1 className="font-display text-3xl text-cream font-light mb-8"^>Agendamentos^</h1^>
echo       {loading ? (
echo         ^<div className="flex justify-center py-20"^>^<div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"/^>^</div^>
echo       ^) : appointments.length === 0 ? (
echo         ^<div className="card-gold-border p-12 text-center"^>^<p className="text-cream-muted opacity-50 font-display text-xl font-light"^>Nenhum agendamento nos ultimos 2 meses^</p^>^</div^>
echo       ^) : (
echo         ^<div className="space-y-4"^>
echo           {appointments.map(appt =^> {
echo             const scheduledDate = new Date(appt.scheduled_at^)
echo             const isFuture = scheduledDate ^> new Date(^)
echo             return ^<div key={appt.id} className="card-gold-border p-5"^>
echo               ^<div className="flex items-start justify-between gap-4"^>
echo                 ^<div className="flex-1"^>
echo                   ^<h3 className="font-display text-lg text-cream font-light"^>{appt.client_name}^</h3^>
echo                   ^<div className="flex flex-wrap gap-4 text-xs text-cream-muted opacity-70 mt-2"^>
echo                     ^<span^>^<Phone size={11} className="inline mr-1"/^>{appt.client_phone}^</span^>
echo                     ^<span^>^<Scissors size={11} className="inline mr-1"/^>{appt.service?.name ?? '—'}^</span^>
echo                     ^<span^>{scheduledDate.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'}^)} as {scheduledDate.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}^)}^</span^>
echo                   ^</div^>
echo                   ^<p className="text-gold font-display text-xl mt-3 font-light"^>{fmt(appt.amount^)}^</p^>
echo                 ^</div^>
echo                 {appt.status === 'pending' ^&^& !isFuture ^&^& ^<div className="flex gap-2"^>
echo                   ^<button onClick={^(^)=^>updateStatus(appt.id,'confirmed',appt.amount^)} disabled={saving===appt.id} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 text-green-400 text-xs"^>^<CheckCircle size={13}/^>Veio^</button^>
echo                   ^<button onClick={^(^)=^>updateStatus(appt.id,'no_show',appt.amount^)} disabled={saving===appt.id} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs"^>^<XCircle size={13}/^>Nao veio^</button^>
echo                 ^</div^>}
echo               ^</div^>
echo             ^</div^>
echo           }^)}
echo         ^</div^>
echo       ^)}
echo     ^</div^>
echo   ^)
echo }
) > "src\app\painel\agendamentos\page.tsx"

:: Financeiro placeholder funcional
(
echo 'use client'
echo import { useEffect, useState, useCallback } from 'react'
echo import { supabase } from '@/lib/supabase'
echo import { Plus, Target, TrendingUp } from 'lucide-react'
echo.
echo type Period = 'today' ^| 'week' ^| 'month' ^| 'year' ^| 'custom'
echo.
echo function periodDates(period: Period, from: string, to: string^): [string, string] {
echo   const now = new Date(^)
echo   const fmt = (d: Date^) =^> d.toISOString(^).split('T'^)[0]
echo   if (period === 'today'^) return [fmt(now^), fmt(now^)]
echo   if (period === 'week'^) { const mon = new Date(now^); mon.setDate(now.getDate(^)-now.getDay(^)+1^); const sun = new Date(mon^); sun.setDate(mon.getDate(^)+6^); return [fmt(mon^),fmt(sun^)] }
echo   if (period === 'month'^) return [fmt(new Date(now.getFullYear(^),now.getMonth(^),1^)^),fmt(new Date(now.getFullYear(^),now.getMonth(^)+1,0^)^)]
echo   if (period === 'year'^) return [`${now.getFullYear(^)}-01-01`,`${now.getFullYear(^)}-12-31`]
echo   return [from, to]
echo }
echo.
echo export default function FinanceiroPage(^) {
echo   const [professionalId, setProfessionalId] = useState^<string ^| null^>(null^)
echo   const [isOwner, setIsOwner] = useState(false^)
echo   const [records, setRecords] = useState^<any[]^>([]^)
echo   const [goal, setGoal] = useState^<any^>(null^)
echo   const [allPros, setAllPros] = useState^<any[]^>([]^)
echo   const [teamRecords, setTeamRecords] = useState^<Record^<string,any[]^>^>({}^)
echo   const [period, setPeriod] = useState^<Period^>('month'^)
echo   const [fromDate, setFromDate] = useState(''`^)
echo   const [toDate, setToDate] = useState(''`^)
echo   const [walkinDesc, setWalkinDesc] = useState(''`^)
echo   const [walkinAmount, setWalkinAmount] = useState(''`^)
echo   const [savingWalkin, setSavingWalkin] = useState(false^)
echo   const [goalInput, setGoalInput] = useState(''`^)
echo   const [savingGoal, setSavingGoal] = useState(false^)
echo   const [loading, setLoading] = useState(true^)
echo.
echo   useEffect(^(^) =^> {
echo     async function loadPro(^) {
echo       const { data: { user } } = await supabase.auth.getUser(^)
echo       if (!user^) return
echo       const { data: pro } = await supabase.from('professionals'^).select('*'^).eq('email', user.email^).single(^)
echo       if (pro^) { setProfessionalId(pro.id^); setIsOwner(['bete@berassi.com','simone@berassi.com'].includes(user.email??''`^)^) }
echo     }
echo     loadPro(^)
echo   }, []^)
echo.
echo   const loadData = useCallback(async (^) =^> {
echo     if (!professionalId^) return
echo     setLoading(true^)
echo     const [from, to] = periodDates(period, fromDate, toDate^)
echo     const [{ data: recs }, { data: g }] = await Promise.all([
echo       supabase.from('financial_records'^).select('*'^).eq('professional_id',professionalId^).gte('recorded_at',`${from}T00:00:00`^).lte('recorded_at',`${to}T23:59:59`^).order('recorded_at',{ascending:false}^),
echo       supabase.from('goals'^).select('*'^).eq('professional_id',professionalId^).eq('month',new Date(^).toISOString(^).slice(0,7^)^).single(^)
echo     ]^)
echo     if (recs^) setRecords(recs^)
echo     if (g^) { setGoal(g^); setGoalInput(String(g.target_amount^)^) }
echo     if (isOwner^) {
echo       const { data: pros } = await supabase.from('professionals'^).select('*'^).eq('active',true^).order('display_order'^)
echo       if (pros^) {
echo         setAllPros(pros^)
echo         const td: Record^<string,any[]^> = {}
echo         for (const p of pros^) {
echo           const { data: pr } = await supabase.from('financial_records'^).select('*'^).eq('professional_id',p.id^).gte('recorded_at',`${from}T00:00:00`^).lte('recorded_at',`${to}T23:59:59`^)
echo           td[p.id] = pr ?? []
echo         }
echo         setTeamRecords(td^)
echo       }
echo     }
echo     setLoading(false^)
echo   }, [professionalId,period,fromDate,toDate,isOwner]^)
echo.
echo   useEffect(^(^) =^> { loadData(^) }, [loadData]^)
echo.
echo   const totalConfirmed = records.filter(r=^>r.type==='appointment'^).reduce((s,r^)=^>s+r.amount,0^)
echo   const totalWalkin = records.filter(r=^>r.type==='walkin'^).reduce((s,r^)=^>s+r.amount,0^)
echo   const total = totalConfirmed + totalWalkin
echo   const goalProgress = goal ? Math.min((total/goal.target_amount^)*100,100^) : 0
echo   const fmt = (v: number^) =^> new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}^).format(v^)
echo.
echo   async function addWalkin(^) {
echo     if (!professionalId^|^|!walkinDesc^|^|!walkinAmount^) return
echo     setSavingWalkin(true^)
echo     await supabase.from('financial_records'^).insert({ professional_id:professionalId, description:walkinDesc, amount:parseFloat(walkinAmount^), type:'walkin', recorded_at:new Date(^).toISOString(^) }^)
echo     setWalkinDesc(''`^); setWalkinAmount(''`^)
echo     await loadData(^); setSavingWalkin(false^)
echo   }
echo.
echo   async function saveGoal(^) {
echo     if (!professionalId^|^|!goalInput^) return
echo     setSavingGoal(true^)
echo     const month = new Date(^).toISOString(^).slice(0,7^)
echo     if (goal^) await supabase.from('goals'^).update({target_amount:parseFloat(goalInput^)}^).eq('id',goal.id^)
echo     else await supabase.from('goals'^).insert({professional_id:professionalId,month,target_amount:parseFloat(goalInput^)}^)
echo     await loadData(^); setSavingGoal(false^)
echo   }
echo.
echo   const PERIODS: {key:Period;label:string}[] = [{key:'today',label:'Hoje'},{key:'week',label:'Esta semana'},{key:'month',label:'Este mes'},{key:'year',label:'Este ano'},{key:'custom',label:'Personalizado'}]
echo.
echo   return (
echo     ^<div className="space-y-8"^>
echo       ^<h1 className="font-display text-3xl text-cream font-light"^>Financeiro^</h1^>
echo       ^<div className="card-gold-border p-5"^>
echo         ^<div className="flex flex-wrap gap-2 mb-4"^>
echo           {PERIODS.map(p=^>(
echo             ^<button key={p.key} onClick={^(^)=^>setPeriod(p.key^)} className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all border ${period===p.key?'bg-gold/20 border-gold text-gold':'border-gold/20 text-cream-muted hover:border-gold/40 hover:text-gold'}`}^>{p.label}^</button^>
echo           ^)^)}
echo         ^</div^>
echo         {period==='custom' ^&^& ^<div className="flex gap-3 flex-wrap mt-2"^>
echo           ^<div className="flex flex-col gap-1"^>^<label className="text-cream-muted text-[10px] uppercase tracking-wider"^>De^</label^>^<input type="date" value={fromDate} onChange={e=^>setFromDate(e.target.value^)} className="input-gold w-auto"/^>^</div^>
echo           ^<div className="flex flex-col gap-1"^>^<label className="text-cream-muted text-[10px] uppercase tracking-wider"^>Ate^</label^>^<input type="date" value={toDate} onChange={e=^>setToDate(e.target.value^)} className="input-gold w-auto"/^>^</div^>
echo         ^</div^>}
echo       ^</div^>
echo       {loading ? ^<div className="flex justify-center py-12"^>^<div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"/^>^</div^> : (
echo         ^<^>
echo           ^<div className="grid grid-cols-1 sm:grid-cols-3 gap-4"^>
echo             ^<div className="card-gold-border p-5"^>^<p className="text-cream-muted text-[10px] uppercase tracking-wider opacity-70 mb-2"^>Agendamentos confirmados^</p^>^<p className="font-display text-2xl font-light text-cream"^>{fmt(totalConfirmed^)}^</p^>^</div^>
echo             ^<div className="card-gold-border p-5"^>^<p className="text-cream-muted text-[10px] uppercase tracking-wider opacity-70 mb-2"^>Atendimentos avulsos^</p^>^<p className="font-display text-2xl font-light text-cream"^>{fmt(totalWalkin^)}^</p^>^</div^>
echo             ^<div className="card-gold-border p-5 border-gold/40"^>^<p className="text-cream-muted text-[10px] uppercase tracking-wider opacity-70 mb-2"^>Total do periodo^</p^>^<p className="font-display text-2xl font-light text-gold"^>{fmt(total^)}^</p^>^</div^>
echo           ^</div^>
echo           {period==='month' ^&^& ^<div className="card-gold-border p-6"^>
echo             ^<div className="flex items-center gap-2 mb-4"^>^<Target size={16} className="text-gold"/^>^<h2 className="font-display text-xl text-cream font-light"^>Meta do mes^</h2^>^</div^>
echo             {goal ? (^<^>
echo               ^<div className="flex justify-between text-xs text-cream-muted mb-2"^>^<span^>{fmt(total^)} faturado^</span^>^<span^>Meta: {fmt(goal.target_amount^)}^</span^>^</div^>
echo               ^<div className="w-full h-3 bg-obsidian-mid rounded-full overflow-hidden"^>^<div className="h-full rounded-full transition-all duration-700" style={{width:`${goalProgress}%%`,background:'linear-gradient(90deg,#A07830,#C9A84C,#E4C96A)'}}/^>^</div^>
echo               ^<p className="text-cream-muted text-xs mt-2 opacity-60"^>{goalProgress^>=100?'Meta atingida!':`Faltam ${fmt(goal.target_amount-total^)} para a meta`}^</p^>
echo             ^</^>^) : ^<p className="text-cream-muted text-sm opacity-50"^>Nenhuma meta definida.^</p^>}
echo             ^<div className="flex gap-3 mt-4"^>^<input type="number" value={goalInput} onChange={e=^>setGoalInput(e.target.value^)} className="input-gold flex-1" placeholder="Definir meta (R$^)"/^>^<button onClick={saveGoal} disabled={savingGoal} className="btn-ghost px-4"^>{savingGoal?'...':'Salvar'}^</button^>^</div^>
echo           ^</div^>}
echo           ^<div className="card-gold-border p-6"^>
echo             ^<div className="flex items-center gap-2 mb-4"^>^<Plus size={16} className="text-gold"/^>^<h2 className="font-display text-xl text-cream font-light"^>Registrar atendimento avulso^</h2^>^</div^>
echo             ^<div className="flex gap-3 flex-wrap"^>
echo               ^<input type="text" value={walkinDesc} onChange={e=^>setWalkinDesc(e.target.value^)} className="input-gold flex-1" placeholder="Descricao (ex: Corte — Maria^)"/^>
echo               ^<input type="number" value={walkinAmount} onChange={e=^>setWalkinAmount(e.target.value^)} className="input-gold w-32" placeholder="Valor (R$^)"/^>
echo               ^<button onClick={addWalkin} disabled={savingWalkin} className="btn-gold whitespace-nowrap"^>{savingWalkin?'...':'Registrar'}^</button^>
echo             ^</div^>
echo           ^</div^>
echo           {isOwner ^&^& ^<div className="card-gold-border p-6"^>
echo             ^<div className="flex items-center gap-2 mb-6"^>^<TrendingUp size={16} className="text-gold"/^>^<h2 className="font-display text-xl text-cream font-light"^>Faturamento da equipe^</h2^>^</div^>
echo             ^<div className="mb-6 p-4 rounded-lg bg-gold/5 border border-gold/20"^>
echo               ^<p className="text-cream-muted text-xs uppercase tracking-wider mb-1"^>Total da equipe^</p^>
echo               ^<p className="font-display text-3xl text-gold font-light"^>{fmt(Object.values(teamRecords^).flat(^).reduce((s,r^)=^>s+r.amount,0^)^)}^</p^>
echo             ^</div^>
echo             ^<div className="space-y-3"^>
echo               {allPros.map(pro=^>(
echo                 ^<div key={pro.id} className="flex justify-between items-center py-3 border-b border-gold/10 last:border-0"^>
echo                   ^<p className="text-cream text-sm font-display font-light"^>{pro.name}^</p^>
echo                   ^<p className="text-gold font-display text-lg font-light"^>{fmt((teamRecords[pro.id]??[]^).reduce((s,r^)=^>s+r.amount,0^)^)}^</p^>
echo                 ^</div^>
echo               ^)^)}
echo             ^</div^>
echo           ^</div^>}
echo         ^</^>
echo       ^)}
echo     ^</div^>
echo   ^)
echo }
) > "src\app\painel\financeiro\page.tsx"

echo Criando profissional, contato, admin e cron...

:: profissional/[id]/page.tsx
(
echo 'use client'
echo import { useEffect, useState } from 'react'
echo import { useParams } from 'next/navigation'
echo import Link from 'next/link'
echo import Image from 'next/image'
echo import { supabase } from '@/lib/supabase'
echo import type { Professional, Service } from '@/lib/supabase'
echo import { Clock, ArrowLeft } from 'lucide-react'
echo.
echo export default function ProfissionalPage(^) {
echo   const { id } = useParams(^)
echo   const [professional, setProfessional] = useState^<Professional ^| null^>(null^)
echo   const [services, setServices] = useState^<Service[]^>([]^)
echo   const [loading, setLoading] = useState(true^)
echo.
echo   useEffect(^(^) =^> {
echo     async function fetchData(^) {
echo       const [{ data: pro }, { data: svcs }] = await Promise.all([
echo         supabase.from('professionals'^).select('*'^).eq('id', id^).single(^),
echo         supabase.from('services'^).select('*'^).eq('professional_id', id^).eq('active', true^).order('price'^)
echo       ]^)
echo       if (pro^) setProfessional(pro^)
echo       if (svcs^) setServices(svcs^)
echo       setLoading(false^)
echo     }
echo     fetchData(^)
echo   }, [id]^)
echo.
echo   if (loading^) return ^<div className="min-h-screen flex items-center justify-center"^>^<div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin"/^>^</div^>
echo   if (!professional^) return ^<div className="min-h-screen flex items-center justify-center"^>^<p className="text-cream-muted"^>Profissional nao encontrado.^</p^>^</div^>
echo.
echo   return (
echo     ^<main className="min-h-screen pb-16"^>
echo       ^<div className="px-6 pt-8 fade-up"^>^<Link href="/" className="inline-flex items-center gap-2 text-cream-muted text-sm hover:text-gold transition-colors"^>^<ArrowLeft size={16}/^>^<span className="tracking-wider uppercase text-xs"^>Voltar^</span^>^</Link^>^</div^>
echo       ^<div className="flex justify-center mt-4 mb-8 fade-up fade-up-delay-1"^>^<Image src="/logo.png" alt="BERASSI" width={70} height={70}/^>^</div^>
echo       ^<section className="text-center px-6 mb-12 fade-up fade-up-delay-2"^>
echo         ^<div className="relative w-28 h-28 mx-auto mb-6"^>
echo           ^<div className="absolute inset-0 rounded-full border-2 border-gold/50"/^>
echo           ^<div className="absolute inset-[-6px] rounded-full border border-gold/15"/^>
echo           {professional.photo_url ? (
echo             ^<Image src={professional.photo_url} alt={professional.name} fill className="rounded-full object-cover"/^>
echo           ^) : (
echo             ^<div className="w-full h-full rounded-full bg-obsidian-mid flex items-center justify-center"^>^<span className="font-display text-4xl text-gold font-light"^>{professional.name[0]}^</span^>^</div^>
echo           ^)}
echo         ^</div^>
echo         ^<h1 className="font-display text-4xl text-cream font-light"^>{professional.name}^</h1^>
echo         ^<div className="gold-divider w-16 mt-4 mb-5"/^>
echo         ^<p className="text-cream-muted text-sm leading-relaxed max-w-lg mx-auto font-light opacity-80"^>{professional.bio}^</p^>
echo       ^</section^>
echo       ^<section className="px-6 max-w-2xl mx-auto"^>
echo         ^<h2 className="font-display text-2xl text-gold font-light text-center mb-8 fade-up fade-up-delay-3"^>Servicos^</h2^>
echo         ^<div className="space-y-4"^>
echo           {services.map((service, i^) =^> (
echo             ^<Link key={service.id} href={`/contato/${professional.id}?service=${service.id}`} className={`card-gold-border block p-5 fade-up fade-up-delay-${Math.min(i+4,6^)} group`}^>
echo               ^<div className="flex items-center justify-between"^>
echo                 ^<div className="flex-1"^>
echo                   ^<h3 className="font-display text-xl text-cream font-light group-hover:text-gold-light transition-colors duration-300"^>{service.name}^</h3^>
echo                   ^<div className="flex items-center gap-2 mt-2"^>^<Clock size={13} className="text-gold opacity-70"/^>^<span className="text-cream-muted text-xs"^>{service.duration_minutes ^< 60 ? `${service.duration_minutes} min` : `${Math.floor(service.duration_minutes/60^)}h`}^</span^>^</div^>
echo                 ^</div^>
echo                 ^<div className="text-right ml-4"^>
echo                   ^<p className="text-gold font-display text-2xl font-light"^>{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}^).format(service.price^)}^</p^>
echo                   ^<span className="text-cream-muted text-[10px] tracking-widest uppercase opacity-50 group-hover:opacity-80 transition-opacity"^>Agendar →^</span^>
echo                 ^</div^>
echo               ^</div^>
echo             ^</Link^>
echo           ^)^)}
echo         ^</div^>
echo       ^</section^>
echo     ^</main^>
echo   ^)
echo }
) > "src\app\profissional\[id]\page.tsx"

:: contato/[id]/page.tsx
(
echo 'use client'
echo import { useEffect, useState } from 'react'
echo import { useParams, useSearchParams } from 'next/navigation'
echo import Link from 'next/link'
echo import Image from 'next/image'
echo import { supabase } from '@/lib/supabase'
echo import type { Professional, Service } from '@/lib/supabase'
echo import { ArrowLeft, MessageCircle, Instagram, Clock } from 'lucide-react'
echo.
echo export default function ContatoPage(^) {
echo   const { id } = useParams(^)
echo   const searchParams = useSearchParams(^)
echo   const serviceId = searchParams.get('service'^)
echo   const [professional, setProfessional] = useState^<Professional ^| null^>(null^)
echo   const [service, setService] = useState^<Service ^| null^>(null^)
echo   const [loading, setLoading] = useState(true^)
echo.
echo   useEffect(^(^) =^> {
echo     async function fetchData(^) {
echo       const promises: Promise^<any^>[] = [supabase.from('professionals'^).select('*'^).eq('id',id^).single(^)]
echo       if (serviceId^) promises.push(supabase.from('services'^).select('*'^).eq('id',serviceId^).single(^)^)
echo       const [{ data: pro }, svcRes] = await Promise.all(promises^)
echo       if (pro^) setProfessional(pro^)
echo       if (svcRes?.data^) setService(svcRes.data^)
echo       setLoading(false^)
echo     }
echo     fetchData(^)
echo   }, [id, serviceId]^)
echo.
echo   if (loading^) return ^<div className="min-h-screen flex items-center justify-center"^>^<div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin"/^>^</div^>
echo   if (!professional^) return ^<div className="min-h-screen flex items-center justify-center"^>^<p className="text-cream-muted"^>Profissional nao encontrado.^</p^>^</div^>
echo.
echo   const whatsappMsg = encodeURIComponent(`Ola ${professional.name}, quero agendar ${service?.name ?? 'um servico'}`)
echo   const whatsappUrl = `https://wa.me/55${professional.whatsapp.replace(/\D/g,'')}?text=${whatsappMsg}`
echo   const instagramUrl = `https://instagram.com/${professional.instagram.replace('@','')}`
echo.
echo   return (
echo     ^<main className="min-h-screen pb-16"^>
echo       ^<div className="px-6 pt-8 fade-up"^>^<Link href={`/profissional/${professional.id}`} className="inline-flex items-center gap-2 text-cream-muted text-sm hover:text-gold transition-colors"^>^<ArrowLeft size={16}/^>^<span className="tracking-wider uppercase text-xs"^>Servicos^</span^>^</Link^>^</div^>
echo       ^<div className="flex justify-center mt-4 mb-8 fade-up fade-up-delay-1"^>^<Image src="/logo.png" alt="BERASSI" width={70} height={70}/^>^</div^>
echo       ^<div className="max-w-md mx-auto px-6"^>
echo         ^<div className="text-center mb-8 fade-up fade-up-delay-2"^>
echo           ^<div className="relative w-24 h-24 mx-auto mb-4"^>
echo             ^<div className="absolute inset-0 rounded-full border-2 border-gold/50"/^>
echo             {professional.photo_url ? ^<Image src={professional.photo_url} alt={professional.name} fill className="rounded-full object-cover"/^> : ^<div className="w-full h-full rounded-full bg-obsidian-mid flex items-center justify-center"^>^<span className="font-display text-3xl text-gold font-light"^>{professional.name[0]}^</span^>^</div^>}
echo           ^</div^>
echo           ^<h1 className="font-display text-3xl text-cream font-light"^>{professional.name}^</h1^>
echo           ^<div className="gold-divider w-12 mt-3 mb-4"/^>
echo           ^<p className="text-cream-muted text-xs leading-relaxed opacity-70 font-light"^>{professional.bio}^</p^>
echo         ^</div^>
echo         {service ^&^& ^<div className="card-gold-border p-5 mb-8 fade-up fade-up-delay-3"^>
echo           ^<p className="text-cream-muted text-[10px] tracking-[0.2em] uppercase mb-3 opacity-60"^>Servico selecionado^</p^>
echo           ^<div className="flex items-center justify-between"^>
echo             ^<div^>^<h2 className="font-display text-xl text-cream font-light"^>{service.name}^</h2^>^<div className="flex items-center gap-2 mt-1"^>^<Clock size={12} className="text-gold opacity-70"/^>^<span className="text-cream-muted text-xs"^>{service.duration_minutes} min^</span^>^</div^>^</div^>
echo             ^<p className="text-gold font-display text-2xl font-light"^>{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}^).format(service.price^)}^</p^>
echo           ^</div^>
echo         ^</div^>}
echo         ^<div className="space-y-4 fade-up fade-up-delay-4"^>
echo           ^<p className="text-center text-cream-muted text-xs tracking-[0.2em] uppercase opacity-60 mb-5"^>Entre em contato para agendar^</p^>
echo           ^<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-gold w-full flex items-center justify-center gap-3" style={{display:'flex',textDecoration:'none'}}^>^<MessageCircle size={18}/^>WhatsApp^</a^>
echo           ^<a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full flex items-center justify-center gap-3" style={{display:'flex',textDecoration:'none'}}^>^<Instagram size={18}/^>Instagram^</a^>
echo         ^</div^>
echo         ^<p className="text-center text-cream-muted text-xs mt-8 opacity-40 leading-relaxed font-light fade-up fade-up-delay-5"^>O agendamento e confirmado diretamente com o profissional.^</p^>
echo       ^</div^>
echo     ^</main^>
echo   ^)
echo }
) > "src\app\contato\[id]\page.tsx"

:: admin/login/page.tsx
(
echo 'use client'
echo import { useState } from 'react'
echo import { useRouter } from 'next/navigation'
echo import Image from 'next/image'
echo import { supabase } from '@/lib/supabase'
echo.
echo export default function AdminLoginPage(^) {
echo   const router = useRouter(^)
echo   const [email, setEmail] = useState(''`^)
echo   const [password, setPassword] = useState(''`^)
echo   const [loading, setLoading] = useState(false^)
echo   const [error, setError] = useState(''`^)
echo.
echo   async function handleLogin(e: React.FormEvent^) {
echo     e.preventDefault(^); setLoading(true^); setError(''`^)
echo     if (email !== 'admin@berassi.com'^) { setError('Acesso restrito.'^); setLoading(false^); return }
echo     const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password }^)
echo     if (authError^|^|!data.user^) { setError('Credenciais invalidas.'^); setLoading(false^); return }
echo     router.push('/admin'^)
echo     setLoading(false^)
echo   }
echo.
echo   return (
echo     ^<main className="min-h-screen flex flex-col items-center justify-center px-6"^>
echo       ^<div className="w-full max-w-sm fade-up"^>
echo         ^<div className="flex flex-col items-center mb-10"^>^<Image src="/logo.png" alt="BERASSI" width={90} height={90}/^>^<div className="gold-divider w-16 mt-5 mb-3"/^>^<p className="text-cream-muted text-xs tracking-[0.25em] uppercase"^>Acesso Administrativo^</p^>^</div^>
echo         ^<form onSubmit={handleLogin} className="card-gold-border p-8 space-y-5"^>
echo           ^<h1 className="font-display text-2xl text-cream font-light text-center mb-6"^>Admin^</h1^>
echo           {error ^&^& ^<div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3"^>^<p className="text-red-400 text-xs text-center"^>{error}^</p^>^</div^>}
echo           ^<div className="space-y-2"^>^<label className="text-cream-muted text-xs tracking-wider uppercase opacity-70"^>E-mail^</label^>^<input type="email" value={email} onChange={e=^>setEmail(e.target.value^)} className="input-gold" placeholder="admin@berassi.com" required/^>^</div^>
echo           ^<div className="space-y-2"^>^<label className="text-cream-muted text-xs tracking-wider uppercase opacity-70"^>Senha^</label^>^<input type="password" value={password} onChange={e=^>setPassword(e.target.value^)} className="input-gold" placeholder="••••••••" required/^>^</div^>
echo           ^<button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50"^>{loading?'Entrando...':'Entrar'}^</button^>
echo         ^</form^>
echo       ^</div^>
echo     ^</main^>
echo   ^)
echo }
) > "src\app\admin\login\page.tsx"

:: admin/page.tsx
(
echo 'use client'
echo import { useEffect, useState, useCallback } from 'react'
echo import { useRouter } from 'next/navigation'
echo import Image from 'next/image'
echo import { supabase } from '@/lib/supabase'
echo import { LogOut, XCircle, ToggleLeft, ToggleRight } from 'lucide-react'
echo.
echo export default function AdminPage(^) {
echo   const router = useRouter(^)
echo   const [checking, setChecking] = useState(true^)
echo   const [tab, setTab] = useState^<'appointments'^|'professionals'^>('appointments'^)
echo   const [appointments, setAppointments] = useState^<any[]^>([]^)
echo   const [professionals, setProfessionals] = useState^<any[]^>([]^)
echo   const [loading, setLoading] = useState(false^)
echo.
echo   useEffect(^(^) =^> {
echo     async function checkAdmin(^) {
echo       const { data: { user } } = await supabase.auth.getUser(^)
echo       if (!user^|^|user.email!=='admin@berassi.com'^) { router.replace('/admin/login'^); return }
echo       setChecking(false^)
echo     }
echo     checkAdmin(^)
echo   }, [router]^)
echo.
echo   const loadData = useCallback(async (^) =^> {
echo     setLoading(true^)
echo     const [{ data: appts }, { data: pros }] = await Promise.all([
echo       supabase.from('appointments'^).select('*, professional:professionals(*^)'^).order('scheduled_at',{ascending:false}^).limit(100^),
echo       supabase.from('professionals'^).select('*'^).order('display_order'^)
echo     ]^)
echo     if (appts^) setAppointments(appts as any^)
echo     if (pros^) setProfessionals(pros^)
echo     setLoading(false^)
echo   }, []^)
echo.
echo   useEffect(^(^) =^> { if (!checking^) loadData(^) }, [checking, loadData]^)
echo.
echo   async function cancelAppointment(id: string^) { await supabase.from('appointments'^).update({status:'cancelled'}^).eq('id',id^); loadData(^) }
echo   async function toggleProfessional(id: string, current: boolean^) { await supabase.from('professionals'^).update({active:!current}^).eq('id',id^); loadData(^) }
echo   async function handleLogout(^) { await supabase.auth.signOut(^); router.replace('/admin/login'^) }
echo.
echo   const fmt = (v: number^) =^> new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}^).format(v^)
echo.
echo   if (checking^) return ^<div className="min-h-screen flex items-center justify-center"^>^<div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin"/^>^</div^>
echo.
echo   return (
echo     ^<main className="min-h-screen pb-16"^>
echo       ^<header className="border-b border-gold/10 bg-obsidian/80 backdrop-blur-sm sticky top-0 z-50"^>
echo         ^<div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between"^>
echo           ^<div className="flex items-center gap-3"^>^<Image src="/logo.png" alt="BERASSI" width={36} height={36}/^>^<p className="text-cream text-sm font-display font-light"^>Admin^</p^>^</div^>
echo           ^<button onClick={handleLogout} className="flex items-center gap-2 text-cream-muted hover:text-gold text-xs uppercase tracking-wider transition-colors"^>^<LogOut size={14}/^>Sair^</button^>
echo         ^</div^>
echo       ^</header^>
echo       ^<div className="max-w-4xl mx-auto px-6 pt-8"^>
echo         ^<div className="flex gap-2 mb-8"^>
echo           ^<button onClick={^(^)=^>setTab('appointments'^)} className={`px-5 py-3 rounded-lg text-xs uppercase tracking-wider transition-all border ${tab==='appointments'?'bg-gold/20 border-gold text-gold':'border-gold/20 text-cream-muted'}`}^>Agendamentos^</button^>
echo           ^<button onClick={^(^)=^>setTab('professionals'^)} className={`px-5 py-3 rounded-lg text-xs uppercase tracking-wider transition-all border ${tab==='professionals'?'bg-gold/20 border-gold text-gold':'border-gold/20 text-cream-muted'}`}^>Profissionais^</button^>
echo         ^</div^>
echo         {loading ? ^<div className="flex justify-center py-20"^>^<div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"/^>^</div^> : tab==='appointments' ? (
echo           ^<div className="space-y-4"^>
echo             ^<h1 className="font-display text-2xl text-cream font-light mb-6"^>Todos os Agendamentos^</h1^>
echo             {appointments.map(appt=^>(
echo               ^<div key={appt.id} className="card-gold-border p-5 flex justify-between items-start gap-4"^>
echo                 ^<div^>
echo                   ^<p className="text-cream font-display text-lg font-light"^>{appt.client_name}^</p^>
echo                   ^<p className="text-cream-muted text-xs mt-1 opacity-60"^>{appt.professional?.name} · {new Date(appt.scheduled_at^).toLocaleString('pt-BR'^)}^</p^>
echo                   ^<p className="text-gold text-sm mt-2 font-display font-light"^>{fmt(appt.amount^)}^</p^>
echo                 ^</div^>
echo                 {appt.status!=='cancelled' ^&^& ^<button onClick={^(^)=^>cancelAppointment(appt.id^)} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs"^>^<XCircle size={13}/^>Cancelar^</button^>}
echo               ^</div^>
echo             ^)^)}
echo           ^</div^>
echo         ^) : (
echo           ^<div className="space-y-4"^>
echo             ^<h1 className="font-display text-2xl text-cream font-light mb-6"^>Profissionais^</h1^>
echo             {professionals.map(pro=^>(
echo               ^<div key={pro.id} className="card-gold-border p-5 flex justify-between items-center"^>
echo                 ^<div^>^<p className="text-cream font-display text-lg font-light"^>{pro.name}^</p^>^<p className="text-cream-muted text-xs opacity-60"^>{pro.email}^</p^>^</div^>
echo                 ^<button onClick={^(^)=^>toggleProfessional(pro.id,pro.active^)} className="flex items-center gap-2 text-sm transition-colors"^>
echo                   {pro.active?^<^>^<ToggleRight size={24} className="text-gold"/^>^<span className="text-gold text-xs uppercase tracking-wider"^>Ativo^</span^>^</^>:^<^>^<ToggleLeft size={24} className="text-cream-muted opacity-40"/^>^<span className="text-cream-muted text-xs uppercase tracking-wider opacity-40"^>Inativo^</span^>^</^>}
echo                 ^</button^>
echo               ^</div^>
echo             ^)^)}
echo           ^</div^>
echo         ^)}
echo       ^</div^>
echo     ^</main^>
echo   ^)
echo }
) > "src\app\admin\page.tsx"

:: api/cron/route.ts
(
echo import { NextRequest, NextResponse } from 'next/server'
echo import { createClient } from '@supabase/supabase-js'
echo.
echo const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!^)
echo.
echo export async function GET(request: NextRequest^) {
echo   const auth = request.headers.get('authorization'^)
echo   if (auth !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }^)
echo   try {
echo     const { data: professionals } = await supabase.from('professionals'^).select('id'^).eq('active', true^)
echo     if (!professionals^) return NextResponse.json({ ok: true, generated: 0 }^)
echo     let generated = 0
echo     const today = new Date(^)
echo     today.setHours(today.getHours(^) - 3^)
echo     for (const pro of professionals^) {
echo       const { data: defaultSchedule } = await supabase.from('default_schedules'^).select('*'^).eq('professional_id', pro.id^)
echo       if (!defaultSchedule^|^|defaultSchedule.length===0^) continue
echo       const endDate = new Date(today^); endDate.setDate(endDate.getDate(^)+45^)
echo       const fromStr = today.toISOString(^).split('T'^)[0]
echo       const toStr = endDate.toISOString(^).split('T'^)[0]
echo       const { data: blockedDays } = await supabase.from('time_slots'^).select('date'^).eq('professional_id',pro.id^).eq('is_blocked',true^).gte('date',fromStr^).lte('date',toStr^)
echo       const blockedSet = new Set((blockedDays??[]^).map(b=^>b.date^)^)
echo       const { data: existingSlots } = await supabase.from('time_slots'^).select('date, start_time'^).eq('professional_id',pro.id^).gte('date',fromStr^).lte('date',toStr^)
echo       const existingSet = new Set((existingSlots??[]^).map(s=^>`${s.date}_${s.start_time}`^)^)
echo       for (let i=1; i^<=45; i++^) {
echo         const d = new Date(today^); d.setDate(d.getDate(^)+i^)
echo         const dateStr = d.toISOString(^).split('T'^)[0]
echo         if (blockedSet.has(dateStr^)^) continue
echo         const daySchedules = defaultSchedule.filter(s=^>s.day_of_week===d.getDay(^)^)
echo         for (const sched of daySchedules^) {
echo           const key = `${dateStr}_${sched.start_time}`
echo           if (existingSet.has(key^)^) continue
echo           await supabase.from('time_slots'^).insert({ professional_id:pro.id, date:dateStr, start_time:sched.start_time, end_time:sched.end_time, is_available:true, is_blocked:false }^)
echo           generated++
echo         }
echo       }
echo     }
echo     return NextResponse.json({ ok: true, generated }^)
echo   } catch (err^) {
echo     return NextResponse.json({ error: 'Internal error' }, { status: 500 }^)
echo   }
echo }
) > "src\app\api\cron\route.ts"

echo.
echo ============================================
echo  BERASSI - Todos os arquivos criados!
echo ============================================
echo.
echo Proximo passo: coloque as imagens na pasta public/
echo   - marmore-fundo.png  renomeie para  marble-bg.png
echo   - BERASSI.png        renomeie para  logo.png
echo.
echo Depois rode: npm run dev
echo.
pause
