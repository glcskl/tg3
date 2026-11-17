import { useEffect } from 'react'

const FEATURES = [
  'Генерации без месячного лимита',
  'Без водяного знака CoverCraft',
  'Все пресеты, эффекты и рамки',
  'Экспорт JPEG и PNG в полном размере',
]

export default function PaywallModal({ open, mode, pro, onClose, onActivate }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  const quota = mode === 'quota'

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
      <button type="button" className="modal__backdrop" aria-label="Закрыть" onClick={onClose} />
      <div className="modal__card">
        <button type="button" className="modal__close" aria-label="Закрыть" onClick={onClose}>
          ×
        </button>

        <p className="eyebrow">
          <span className="eyebrow__rule" aria-hidden />
          {quota ? 'лимит free' : 'тариф pro'}
        </p>

        <h2 id="paywall-title" className="display modal__title">
          {quota ? (
            <>
              Пять генераций <em>закончились</em>
            </>
          ) : (
            <>
              15 ₽ в месяц — <em>без ограничений</em>
            </>
          )}
        </h2>

        <p className="modal__lede">
          {quota
            ? 'Бесплатный лимит обновляется первого числа. Если обложки нужны сейчас — включите PRO: он снимает лимит и водяной знак.'
            : 'PRO для тех, кто выпускает регулярно: без лимита, без водяного знака, с полным размером экспорта.'}
        </p>

        <ul className="modal__list">
          {FEATURES.map((feature) => (
            <li key={feature}>
              <span aria-hidden>✓</span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="modal__actions">
          <button type="button" className="btn btn--solid btn--wide" onClick={onActivate} disabled={pro}>
            {pro ? 'PRO уже активен' : 'Включить PRO — демо'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {quota ? 'Остаться на Free' : 'Позже'}
          </button>
        </div>

        <p className="modal__note mono">
          Это демонстрация тарифа: платёж не проводится, PRO включается локально в этом браузере.
        </p>
      </div>
    </div>
  )
}
