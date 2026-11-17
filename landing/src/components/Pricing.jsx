import { FREE_LIMIT, remaining, saveAccount } from '../lib/account.js'

export default function Pricing({ account, setAccount, onOpenPaywall }) {
  const left = remaining(account)

  const deactivate = () => {
    setAccount(saveAccount({ ...account, pro: false }))
  }

  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__rule" aria-hidden />
              07 / тарифы
            </p>
            <h2 className="display section-head__title">
              Бесплатно — <em>всерьёз</em>
            </h2>
          </div>
          <p className="section-head__lede">
            Пять обложек в месяц хватает, чтобы попробовать без карты и регистрации. PRO нужен тем,
            кто выпускает чаще и не хочет водяной знак.
          </p>
        </div>

        <div className="plans">
          <article className={`plan ${!account.pro ? 'is-current' : ''}`}>
            <div className="plan__head">
              <div>
                <h3>Free</h3>
                <span className="mono plan__tag">для старта</span>
              </div>
              <p className="plan__price">
                0 <span>₽</span>
              </p>
            </div>
            <ul className="plan__list">
              <li>5 генераций в месяц</li>
              <li>Все пресеты и шрифты</li>
              <li>Цветокоррекция и проверка композиции</li>
              <li>Экспорт JPEG или PNG · 1280 × 720 · до 2 МБ</li>
              <li className="is-muted">Водяной знак CoverCraft</li>
            </ul>
            <div className="plan__foot">
              {account.pro ? (
                <span className="plan__state mono">Free доступен всегда</span>
              ) : (
                <span className="plan__state mono">
                  {left > 0 ? `Осталось ${left} из ${FREE_LIMIT} в этом месяце` : 'Лимит на месяц исчерпан'}
                </span>
              )}
              <a className="btn btn--ghost btn--wide" href="#editor">
                {account.pro ? 'Продолжить в редакторе' : 'Собрать обложку'}
              </a>
            </div>
          </article>

          <article className={`plan plan--pro ${account.pro ? 'is-current' : ''}`}>
            <div className="plan__head">
              <div>
                <h3>PRO</h3>
                <span className="mono plan__tag">для регулярного выпуска</span>
              </div>
              <p className="plan__price">
                15 <span>₽ / мес</span>
              </p>
            </div>
            <ul className="plan__list">
              <li>Без лимита генераций</li>
              <li>Без водяного знака</li>
              <li>Все пресеты, эффекты и рамки</li>
              <li>Экспорт JPEG и PNG в полном размере</li>
              <li>Проверка композиции без ограничений</li>
            </ul>
            <div className="plan__foot">
              <span className="plan__state mono">
                {account.pro ? 'PRO активен в этом браузере' : 'Отмена в любой момент'}
              </span>
              {account.pro ? (
                <button type="button" className="btn btn--ghost btn--wide" onClick={deactivate}>
                  Вернуться на Free
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--solid btn--wide"
                  onClick={() => onOpenPaywall('features')}
                >
                  Подключить PRO
                </button>
              )}
            </div>
          </article>
        </div>

        <p className="pricing__note mono">
          Демонстрация: платёж не проводится. PRO включается локально, чтобы можно было сравнить
          результат — состояние хранится в этом браузере.
        </p>
      </div>
    </section>
  )
}
