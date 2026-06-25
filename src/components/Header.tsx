import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gold/20 bg-marble-dark/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="title-gold text-2xl font-bold tracking-[0.2em]">
          BERASSI
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm text-white/60 hover:text-gold transition-colors tracking-widest uppercase"
          >
            Área do Profissional
          </Link>
        </nav>
      </div>
    </header>
  )
}