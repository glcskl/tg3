import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Problem from './components/Problem.jsx'
import Editor from './components/Editor.jsx'
import Presets from './components/Presets.jsx'
import How from './components/How.jsx'
import WhyClick from './components/WhyClick.jsx'
import Audience from './components/Audience.jsx'
import Pricing from './components/Pricing.jsx'
import Roadmap from './components/Roadmap.jsx'
import Trust from './components/Trust.jsx'
import Faq from './components/Faq.jsx'
import FinalCta from './components/FinalCta.jsx'
import Footer from './components/Footer.jsx'
import PaywallModal from './components/PaywallModal.jsx'
import { BASE_STATE, PRESETS } from './lib/presets.js'
import { loadAccount, saveAccount } from './lib/account.js'

const ANIM_SELECTOR = [
  '.section-head',
  '.compare__col',
  '.preset-card',
  '.step',
  '.rules > li',
  '.why__panel',
  '.audience-card',
  '.plan',
  '.timeline__item',
  '.trust__list > article',
  '.faq__list > details',
  '.final__inner',
].join(',')

const TICKER = [
  '1280 × 720',
  'шрифты SIL OFL',
  'без регистрации',
  'рендер в браузере',
  'JPEG / PNG до 2 МБ',
  'пресеты',
  'проверка композиции',
  '15 ₽ в месяц',
]

export default function App() {
  const [cover, setCover] = useState(BASE_STATE)
  const [account, setAccount] = useState(() => loadAccount())
  const [paywall, setPaywall] = useState(null)

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(ANIM_SELECTOR))
    if (!nodes.length) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.classList.add('anim-in'))
      return undefined
    }

    nodes.forEach((node) => {
      node.classList.add('anim-ready')
      const siblings = node.parentElement ? Array.from(node.parentElement.children) : []
      const index = Math.max(0, siblings.indexOf(node))
      node.style.setProperty('--anim-delay', `${Math.min(index, 4) * 80}ms`)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('anim-in')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const openPaywall = (mode) => setPaywall(mode || 'features')

  const activatePro = () => {
    setAccount(saveAccount({ ...account, pro: true, activatedAt: new Date().toISOString() }))
    setPaywall(null)
  }

  const applyPreset = (id) => {
    const preset = PRESETS.find((item) => item.id === id)
    if (!preset) return
    setCover((current) => ({ ...current, preset: id, ...preset.style }))
    document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Header />
      <main>
        <Hero />

        <div className="ticker" aria-hidden>
          <div className="ticker__track">
            {[0, 1].map((copy) => (
              <div className="ticker__group" key={copy}>
                {TICKER.map((item) => (
                  <span key={`${copy}-${item}`} className="mono">
                    {item}
                    <i>·</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Problem />
        <Editor
          state={cover}
          setState={setCover}
          account={account}
          setAccount={setAccount}
          onOpenPaywall={openPaywall}
        />
        <Presets onApply={applyPreset} />
        <How />
        <WhyClick />
        <Audience />
        <Pricing account={account} setAccount={setAccount} onOpenPaywall={openPaywall} />
        <Roadmap />
        <Trust />
        <Faq />
        <FinalCta />
      </main>
      <Footer />

      <PaywallModal
        open={Boolean(paywall)}
        mode={paywall}
        pro={account.pro}
        onClose={() => setPaywall(null)}
        onActivate={activatePro}
      />
    </>
  )
}
