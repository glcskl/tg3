const NAV = [
  { href: '#editor', label: 'Редактор' },
  { href: '#presets', label: 'Пресеты' },
  { href: '#how', label: 'Как это работает' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#faq', label: 'FAQ' },
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
              Веб-сервис автоматической генерации кликабельных обложек к видео. 16:9 и 9:16,
              шрифты SIL OFL, обработка в браузере.
            </p>
          </div>

          <nav className="site-footer__nav" aria-label="Навигация в подвале">
            {NAV.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="site-footer__bottom">
          <span className="mono">
            © 2026 CoverCraft · сайт собрал Токарь Глеб Максимович все права защищены
          </span>
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
