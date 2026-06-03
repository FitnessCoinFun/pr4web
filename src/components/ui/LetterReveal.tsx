'use client'

import { Fragment, useRef } from 'react'
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
  const words  = children.split(' ')

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : {}}
        transition={{ duration: 0.75, delay, ease: [0.33, 1, 0.68, 1] }}
      >
        <Tag className={className} style={style}>
          {words.map((word, wi) => (
            <Fragment key={wi}>
              {/* Каждое слово — inline-block с nowrap: браузер переносит только между словами */}
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {Array.from(word).map((char, ci) => (
                  <motion.span
                    key={ci}
                    className="letter-reveal-char"
                    style={{ display: 'inline-block', cursor: 'default' }}
                    whileHover={{ y: -4, transition: { duration: 0.12 } }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              {wi < words.length - 1 && ' '}
            </Fragment>
          ))}
        </Tag>
      </motion.div>
    </div>
  )
}
