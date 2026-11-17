import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#editor', label: 'Редактор' },
  { href: '#presets', label: 'Пресеты' },
  { href: '#how', label: 'Как это работает' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#faq', label: 'FAQ' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <a className="logo" href="#top" aria-label="CoverCraft — на главную">
          <span className="logo__mark" aria-hidden />
          <span className="logo__text">CoverCraft</span>
          <span className="logo__sub">studio</span>
        </a>

        <nav className="site-nav" aria-label="Основная навигация">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--small btn--solid" href="#editor">
            Собрать обложку
          </a>
          <button
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? 'is-open' : ''}`}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </div>
    </header>
  )
}
