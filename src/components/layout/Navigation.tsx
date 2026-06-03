'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { openContactModal } from '@/components/ui/ContactModal'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Кейсы',       href: '#cases'   },
  { label: 'Калькулятор', href: '#roi'      },
  { label: 'Процесс',     href: '#process'  },
  { label: 'AI',          href: '#ai'       },
  { label: 'Инструменты', href: '#tools'         },
  { label: 'Сертификаты', href: '#certificates'  },
  { label: 'Контакт',     href: '#contact'       },
]

export function Navigation() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLink = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      // элемент есть на текущей странице — плавный скролл
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      // внутренняя страница — переходим на главную с якорем
      window.location.href = `/${href}`
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300',
          scrolled ? 'backdrop-blur-md border-b shadow-xl shadow-black/10' : 'bg-transparent',
        )}
        style={scrolled ? { backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' } : {}}
      >
        {/* Прогресс-бар скролла */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-indigo-500"
          style={{ scaleX, opacity: scrolled ? 1 : 0 }}
          transition={{ opacity: { duration: 0.3 } }}
        />
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 group"
            onClick={(e) => {
              e.preventDefault()
              if (pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                router.push('/')
              }
            }}
          >
            <span className="font-mono font-black text-xl tracking-tight">
              <span className="text-indigo-500">PR</span>
              <span style={{ color: 'var(--muted)' }}>4</span>
              <span style={{ color: 'var(--page-fg)' }}>WEB</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLink(link.href)}
                aria-label={`Перейти к разделу «${link.label}»`}
                className="px-4 py-2 text-sm rounded-lg transition-all duration-150 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: 'var(--muted)' }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle className="flex" />
            <button
              onClick={openContactModal}
              aria-haspopup="dialog"
              aria-label="Открыть форму обсуждения проекта"
              className={cn(
                'hidden md:flex items-center gap-1.5',
                'px-4 py-2 rounded-xl text-sm font-semibold',
                'bg-indigo-600 text-white',
                'hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25',
                'transition-all duration-200 cursor-pointer',
              )}
            >
              Обсудить проект
              <ArrowUpRight size={14} />
            </button>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
            >
              {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 backdrop-blur-md border-b md:hidden"
            style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleLink(link.href)}
                  className="text-left px-4 py-3 rounded-xl transition-all cursor-pointer"
                  style={{ color: 'var(--muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--page-fg)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => { openContactModal(); setMobileOpen(false) }}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold text-center hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  Обсудить проект
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
