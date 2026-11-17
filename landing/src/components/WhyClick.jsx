const RULES = [
  {
    num: '01',
    title: 'Контраст важнее красоты',
    text: 'Светлый текст на светлом небе исчезает уже в маленьком превью. CoverCraft считает среднюю яркость кадра и предлагает цвет, который держит контраст.',
    detail: 'порог яркости 138',
  },
  {
    num: '02',
    title: 'Один смысл на кадр',
    text: 'Заголовок из шести–сорока шести символов читается с одного взгляда. Всё, что длиннее, уходит в подзаголовок — или в описание.',
    detail: '6–46 символов',
  },
  {
    num: '03',
    title: 'Крупно и с воздухом',
    text: 'Кегль не меньше 54 px в пересчёте на 1280 × 720 и отступы от краёв. Тогда текст не упирается в обрез и не спорит с лицом в кадре.',
    detail: 'безопасная зона 64 px',
  },
]

const CHECKS = [
  'Текст контрастен фону',
  'Заголовок читается с одного взгляда',
  'Не больше трёх строк',
  'Есть подзаголовок с контекстом',
  'Крупный кегль для мобильной ленты',
  'Кадр не перегружен текстом',
]

export default function WhyClick() {
  return (
    <section className="section why" id="why">
      <div className="container why__grid">
        <div className="why__left">
          <p className="eyebrow">
            <span className="eyebrow__rule" aria-hidden />
            05 / логика клика
          </p>
          <h2 className="display section-head__title">
            Красиво — не значит <em>заметно</em>
          </h2>
          <p className="section-head__lede">
            Мы не обещаем магию алгоритмов. В основе проверки — три прозрачных правила и одна
            честная эвристика, которую видно на экране.
          </p>

          <div className="why__panel">
            <div className="why__panel-head">
              <span className="mono">Проверка композиции</span>
              <span className="why__score">84</span>
            </div>
            <ul>
              {CHECKS.map((check) => (
                <li key={check}>
                  <span aria-hidden>✓</span>
                  {check}
                </li>
              ))}
            </ul>
            <p className="why__panel-foot mono">
              эвристика · без ML · результат повторяем
            </p>
          </div>
        </div>

        <ol className="rules">
          {RULES.map((rule) => (
            <li key={rule.num}>
              <div className="rules__top">
                <span className="mono">{rule.num}</span>
                <span className="mono rules__detail">{rule.detail}</span>
              </div>
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
