import { useState } from 'react'

export default function FinalCta() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  function submit(event) {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setStatus('error')
      return
    }
    try {
      localStorage.setItem('covercraft.waitlist', JSON.stringify({ email: value, at: new Date().toISOString() }))
    } catch {
      /* приватный режим */
    }
    setStatus('done')
    setEmail('')
  }

  return (
    <section className="final" id="start">
      <div className="container">
        <div className="final__inner">
          <div className="final__head">
            <p className="eyebrow">
              <span className="eyebrow__rule" aria-hidden />
              финал
            </p>
            <h2 className="display final__title">
              Первая обложка — <em>через четыре минуты</em>
            </h2>
          </div>

          <div className="final__body">
            <p className="lede">
              Откройте редактор и соберите превью из демо-кадра. Или оставьте почту, если хотите
              узнать о запуске PRO и новых пресетах.
            </p>

            <div className="final__actions">
              <a className="btn btn--solid" href="#editor">
                Открыть редактор
                <span className="btn__arrow" aria-hidden>
                  →
                </span>
              </a>
              <a
                className="btn btn--ghost"
                href="https://t.me/ph_editot_bot"
                target="_blank"
                rel="noreferrer"
              >
                Бот в Telegram ↗
              </a>
            </div>

            <form className={`waitlist ${status === 'done' ? 'is-done' : ''}`} onSubmit={submit} noValidate>
              <label className="waitlist__field">
                <span className="mono">почта для обновлений</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (status !== 'idle') setStatus('idle')
                  }}
                  placeholder="you@studio.ru"
                  aria-label="Электронная почта"
                />
              </label>
              <button type="submit" className="btn btn--solid">
                Записаться
              </button>
            </form>

            <p className={`waitlist__note mono ${status === 'error' ? 'is-error' : ''}`} role="status">
              {status === 'done'
                ? 'Готово — адрес сохранён в этом браузере. Спасибо!'
                : status === 'error'
                  ? 'Проверьте адрес: кажется, в нём опечатка.'
                  : 'Демо-форма: адрес остаётся в localStorage и никуда не отправляется.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
