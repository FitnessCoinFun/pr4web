import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { ContactModal } from '@/components/ui/ContactModal'
import { ChevronRight } from 'lucide-react'

interface Props {
  title: string
  children: React.ReactNode
}

export function CaseLayout({ title, children }: Props) {
  return (
    <>
      <ContactModal />
      <Navigation />
      <main id="main-content" className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)', color: 'var(--page-fg)' }}>

        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-indigo-400 transition-colors">Главная</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link href="/cases" className="hover:text-indigo-400 transition-colors">Кейсы</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="truncate max-w-[200px]" aria-current="page">{title}</span>
          </nav>
        </div>

        {children}
      </main>
      <Footer />
    </>
  )
}
