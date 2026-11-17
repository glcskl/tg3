const NAV = [
  { href: '#editor', label: 'Редактор' },
  { href: '#presets', label: 'Пресеты' },
  { href: '#how', label: 'Как это работает' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#faq', label: 'FAQ' },
]

const TEAM = [
  ['Титов Денис', 'PM / PO / QA'],
  ['Токарь Глеб', 'Fullstack / ML / DevOps'],
  ['Шкредов Глеб', 'UI/UX / арт-директор'],
  ['Труфина Елена', 'экономика проекта'],
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <a className="logo" href="#top">
              <span className="logo__mark" aria-hidden />
              <span className="logo__text">CoverCraft</span>
            </a>
            <p>
              Веб-сервис автоматической генерации кликабельных обложек к видео. 1280 × 720, шрифты
              SIL OFL, обработка в браузере.
            </p>
          </div>

          <nav className="site-footer__nav" aria-label="Навигация в подвале">
            {NAV.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-footer__team">
            <span className="mono">команда</span>
            <ul>
              {TEAM.map(([name, role]) => (
                <li key={name}>
                  <span>{name}</span>
                  <span className="mono">{role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span className="mono">© 2026 CoverCraft · учебный проект, «Управление IT-проектами»</span>
          <span className="mono">
            <a href="https://github.com/glcskl/tg3" target="_blank" rel="noreferrer">
              GitHub
            </a>
            {' · '}
            <a href="https://t.me/ph_editot_bot" target="_blank" rel="noreferrer">
              Telegram
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
