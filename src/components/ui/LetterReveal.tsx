'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface LetterRevealProps {
  children:   string
  as?:        'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  style?:     React.CSSProperties
  delay?:     number
}

export function LetterReveal({
  children,
  as: Tag = 'h2',
  className = '',
  style,
  delay = 0,
}: LetterRevealProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const letters = Array.from(children)

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : {}}
        transition={{ duration: 0.75, delay, ease: [0.33, 1, 0.68, 1] }}
      >
        <Tag className={className} style={style}>
          {letters.map((char, i) =>
            char === ' ' ? (
              /* Обычный пробел — не inline-block, чтобы браузер переносил слова */
              <span key={i}>{' '}</span>
            ) : (
              <motion.span
                key={i}
                className="letter-reveal-char"
                style={{ display: 'inline-block', cursor: 'default' }}
                whileHover={{ y: -4, transition: { duration: 0.12 } }}
              >
                {char}
              </motion.span>
            )
          )}
        </Tag>
      </motion.div>
    </div>
  )
}
