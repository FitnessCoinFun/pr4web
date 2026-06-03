'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Синхронизируем color-scheme при загрузке страницы
    document.documentElement.style.colorScheme =
      (localStorage.getItem('theme') ?? 'dark') === 'dark' ? 'dark' : 'light'
  }, [])

  if (!mounted) {
    return <div className={cn('w-9 h-9', className)} />
  }

  const isDark = theme === 'dark'

  const toggle = () => {
    const next = isDark ? 'light' : 'dark'
    setTheme(next)
    // Принудительно задаём color-scheme через inline style — CSS-переменная не всегда
    // пробивает нативные OS-контролы (select dropdown) в некоторых браузерах/ОС
    document.documentElement.style.colorScheme = next === 'dark' ? 'dark' : 'light'
  }

  return (
    <button
      onClick={toggle}
      aria-label="Переключить тему"
      className={cn(
        'relative w-9 h-9 rounded-lg flex items-center justify-center',
        'transition-all duration-200 cursor-pointer',
        className,
      )}
      style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--subtle)' }}
    >
      <Sun
        size={16}
        className={cn(
          'absolute transition-all duration-300',
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100 text-amber-400',
        )}
      />
      <Moon
        size={16}
        className={cn(
          'absolute transition-all duration-300',
          isDark ? 'opacity-100 rotate-0 scale-100 text-indigo-400' : 'opacity-0 -rotate-90 scale-50',
        )}
      />
    </button>
  )
}
