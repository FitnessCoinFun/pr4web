'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

/* ─── Данные ─── */
const certs = [
  { id: 'cert-01', w: 619,  h: 877  },
  { id: 'cert-02', w: 827,  h: 1171 },
  { id: 'cert-03', w: 877,  h: 620  },
  { id: 'cert-04', w: 565,  h: 797  },
  { id: 'cert-05', w: 756,  h: 1066 },
  { id: 'cert-06', w: 619,  h: 877  },
  { id: 'cert-07', w: 886,  h: 698  },
  { id: 'cert-08', w: 619,  h: 877  },
  { id: 'cert-12', w: 825,  h: 1167 },
  { id: 'cert-10', w: 619,  h: 877  },
  { id: 'cert-11', w: 2481, h: 3509 },
  { id: 'cert-09', w: 889,  h: 672  },
]

/* Единая высота карточки; ширина пропорциональна ориентации */
const CARD_H  = 280
const getCardW = (c: { w: number; h: number }) => Math.round((c.w / c.h) * CARD_H)

/* ─── 3D-тилт на карточке ─── */
function CertCard({
  cert,
  onClick,
}: {
  cert: typeof certs[0]
  onClick: () => void
}) {
  const cardW = getCardW(cert)
  const ref   = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el   = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x    = (e.clientX - rect.left)  / rect.width  - 0.5   // -0.5 .. 0.5
    const y    = (e.clientY - rect.top)   / rect.height - 0.5
    el.style.transform = `perspective(700px) rotateY(${x * 18}deg) rotateX(${-y * 14}deg) scale(1.06)`
    el.style.boxShadow = `${-x * 20}px ${y * 10}px 40px rgba(99,102,241,0.25), 0 8px 32px rgba(0,0,0,0.3)`
  }, [])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)'
    el.style.boxShadow = ''
  }, [])

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex-shrink-0 rounded-xl overflow-hidden cursor-zoom-in select-none"
      style={{
        width:      cardW,
        height:     CARD_H,
        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
        border:     '1px solid var(--card-border)',
        backgroundColor: 'var(--card-bg)',
      }}
    >
      <Image
        src={`/certificates/${cert.id}.jpg`}
        alt="Сертификат"
        fill
        sizes={`${cardW}px`}
        className="object-contain p-1"
        draggable={false}
      />
      {/* Hover hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'rgba(99,102,241,0.15)', backdropFilter: 'blur(2px)' }}>
        <ZoomIn size={28} className="text-white drop-shadow-lg" />
      </div>
    </div>
  )
}

/* ─── Lightbox ─── */
function Lightbox({
  cert,
  onClose,
}: {
  cert: typeof certs[0] | null
  onClose: () => void
}) {
  if (!cert) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
      >
        <X size={20} />
      </button>
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        exit={{    scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image с реальными пропорциями, ограниченный viewport через CSS */}
        <Image
          src={`/certificates/${cert.id}.jpg`}
          alt="Сертификат"
          width={cert.w}
          height={cert.h}
          className="rounded-xl shadow-2xl"
          style={{
            width:     'auto',
            height:    'auto',
            maxWidth:  '90vw',
            maxHeight: '85vh',
            objectFit: 'contain',
            display:   'block',
          }}
          priority
        />
      </motion.div>
    </motion.div>
  )
}

/* ─── Главный компонент ─── */
export function Certificates() {
  const headRef = useRef<HTMLDivElement>(null)
  const headIn  = useInView(headRef, { once: true, margin: '-60px 0px' })

  const [lightbox, setLightbox] = useState<typeof certs[0] | null>(null)
  const [paused,   setPaused]   = useState(false)

  /* Дублируем массив для бесшовного петли */
  const track = [...certs, ...certs]

  return (
    <section id="certificates" className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* Заголовок */}
      <motion.div
        ref={headRef}
        initial={{ opacity: 0, y: 24 }}
        animate={headIn ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
        className="text-center mb-12 px-6"
      >
        <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold tracking-widest uppercase mb-5">
          Сертификаты
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--page-fg)' }}>
          Подтверждённые компетенции
        </h2>
        <p className="text-base max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
          Нажмите на сертификат, чтобы рассмотреть подробнее
        </p>
      </motion.div>

      {/* Мобиле: скролл пальцем */}
      <div
        className="sm:hidden overflow-x-auto pb-4 px-4"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {certs.map((cert) => (
            <CertCard key={cert.id} cert={cert} onClick={() => setLightbox(cert)} />
          ))}
        </div>
      </div>

      {/* Десктоп: автоскролл-лента с фейдом по краям */}
      <div
        className="hidden sm:block relative overflow-hidden"
        style={{
          maskImage:       'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex gap-4 px-4"
          style={{
            animation:          `cert-scroll 55s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
            width:              'max-content',
          }}
        >
          {track.map((cert, i) => (
            <CertCard
              key={`${cert.id}-${i}`}
              cert={cert}
              onClick={() => setLightbox(cert)}
            />
          ))}
        </div>
      </div>

      {/* Подпись */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={headIn ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-center text-xs mt-8 font-mono sm:block hidden"
        style={{ color: 'var(--muted)', opacity: 0.5 }}
      >
        {certs.length} сертификатов · наведите для паузы · кликните для просмотра
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={headIn ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-center text-xs mt-4 font-mono sm:hidden"
        style={{ color: 'var(--muted)', opacity: 0.5 }}
      >
        {certs.length} сертификатов · листайте пальцем · нажмите для просмотра
      </motion.p>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox cert={lightbox} onClose={() => setLightbox(null)} />
      )}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  )
}
