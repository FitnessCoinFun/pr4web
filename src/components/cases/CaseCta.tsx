'use client'

import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { openContactModal } from '@/components/ui/ContactModal'
import type { Case } from '@/lib/cases-data'

export function CaseCta({ next }: { next?: Case }) {
  return (
    <section className="py-20 border-t" style={{ borderColor: 'var(--card-border)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <p className="text-sm mb-2 font-mono" style={{ color: 'var(--muted)' }}>
            Скорее всего, я уже решал похожую задачу
          </p>
          <h3 className="text-2xl font-extrabold mb-6" style={{ color: 'var(--page-fg)' }}>
            Опишите задачу — разберусь за час
          </h3>
          <button
            onClick={openContactModal}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
          >
            Написать
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Следующий кейс */}
        {next && (
          <div className="mt-8 flex items-center justify-between">
            <Link href="/cases"
              className="flex items-center gap-2 text-sm transition-colors hover:text-indigo-400"
              style={{ color: 'var(--muted)' }}>
              <ArrowLeft size={15} />
              Все кейсы
            </Link>
            <Link href={`/cases/${next.slug}`}
              className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Следующий кейс: {next.title.split(':')[0].trim()}
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
