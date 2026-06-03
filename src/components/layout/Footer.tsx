'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

const navLinks = [
  { label: 'Кейсы',        href: '/#cases' },
  { label: 'Калькулятор',  href: '/#roi' },
  { label: 'Процесс',      href: '/#process' },
  { label: 'AI',           href: '/#ai' },
  { label: 'Инструменты',  href: '/#tools' },
  { label: 'Контакт',      href: '/#contact' },
]

export function Footer() {
  return (
    <footer className="border-t" style={{ backgroundColor: 'var(--page-bg)', borderColor: 'var(--card-border)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">

          {/* Лого + копирайт */}
          <div>
            <Link href="/" className="font-mono font-black text-lg tracking-tight mb-2 inline-block hover:opacity-80 transition-opacity">
              <span className="text-indigo-500">PR</span>
              <span style={{ color: 'var(--muted)', opacity: 0.5 }}>4</span>
              <span style={{ color: 'var(--page-fg)' }}>WEB</span>
            </Link>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              ИП Еремин АВ &nbsp;·&nbsp; © 2026
            </p>
          </div>

          {/* Навигация */}
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}
                className="text-sm transition-colors hover:opacity-100"
              style={{ color: 'var(--muted)' }}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Telegram */}
          <a href="https://t.me/pr4web" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: 'var(--muted)' }}>
            <MessageCircle size={15} />
            @pr4web
          </a>
        </div>
      </div>
    </footer>
  )
}
