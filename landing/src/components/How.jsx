const STEPS = [
  {
    num: '01',
    title: 'Загрузите кадр',
    text: 'Перетащите фото или возьмите демо. Файл остаётся в браузере: ни загрузки на сервер, ни очереди.',
    meta: 'JPEG · PNG · WebP · до 20 МБ',
  },
  {
    num: '02',
    title: 'Напишите и выберите',
    text: 'Заголовок, подзаголовок, пресет. Дальше — шрифт, эффект текста, рамка и цвет, если хочется точнее.',
    meta: '5 фильтров · 5 эффектов · 3 шрифта',
  },
  {
    num: '03',
    title: 'Проверьте и скачайте',
    text: 'Оценка композиции подскажет, что поправить. Экспорт — 16:9 или 9:16, JPEG или PNG, не тяжелее 2 МБ.',
    meta: '16:9 и 9:16 · до 2 МБ',
  },
]

export default function How() {
  return (
    <section className="section how" id="how">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">
            <span className="eyebrow__rule" aria-hidden />
            04 / процесс
          </p>
          <h2 className="display section-head__title">
            Три шага, <em>без установки</em>
          </h2>
        </div>

        <div className="steps">
          {STEPS.map((step, index) => (
            <article className="step" key={step.num} style={{ '--step': index }}>
              <div className="step__top">
                <span className="mono step__num">{step.num}</span>
                <span className="step__line" aria-hidden />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className="mono step__meta">{step.meta}</span>
            </article>
          ))}
        </div>

        <div className="how__note">
          <span className="mono">важно</span>
          <p>
            Всё считается на вашем устройстве. CoverCraft не отправляет фотографии на сервер и не
            хранит их — закрыли вкладку, и кадра нет.
          </p>
        </div>
      </div>
    </section>
  )
}
