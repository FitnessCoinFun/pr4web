import { Navigation } from '@/components/layout/Navigation'
import { Hero } from '@/components/sections/Hero'
import { Benefits } from '@/components/sections/Benefits'
import { Cases } from '@/components/sections/Cases'
import { RoiCalculator } from '@/components/sections/RoiCalculator'
import { Process } from '@/components/sections/Process'
import { AiStack } from '@/components/sections/AiStack'
import { Tools } from '@/components/sections/Tools'
import { Certificates } from '@/components/sections/Certificates'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/layout/Footer'
import { ContactModal } from '@/components/ui/ContactModal'
import { Marquee } from '@/components/ui/Marquee'

export default function Home() {
  return (
    <>
      <ContactModal />
      <Navigation />
      <main id="main-content" className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)', color: 'var(--page-fg)' }}>
        <Hero />
        <Marquee
          text="Нахожу нестандартные решения"
          duration={28}
          className="py-3 text-sm font-mono border-y"
          style={{ borderColor: 'var(--card-border)', color: 'var(--muted)' }}
        />
        <Benefits />
        <Cases />
        <RoiCalculator />
        <Process />
        <AiStack />
        <Tools />
        <Certificates />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
