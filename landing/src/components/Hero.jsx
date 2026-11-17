import { useEffect, useRef, useState } from 'react'
import { BASE_STATE, photoById } from '../lib/presets.js'
import { loadImage, renderToCanvas, warmFonts } from '../lib/render.js'

const SHOWCASE = [
  {
    preset: 'quiet',
    name: 'Тихий кадр',
    photo: 'mountains',
    title: 'Тихая дорога',
    subtitle: 'Дневник одного путешествия',
    style: {
      font: 'playfair',
      effect: 'shadow',
      position: 'bottom',
      align: 'left',
      frame: 'none',
      temp: 0.14,
      contrast: 1.04,
      saturation: 0.92,
      darken: 0.46,
    },
  },
  {
    preset: 'night',
    name: 'Ночной город',
    photo: 'city',
    title: 'После полуночи',
    subtitle: 'Новый трек · премьера',
    style: {
      font: 'unbounded',
      effect: 'neon',
      position: 'bottom',
      align: 'left',
      frame: 'none',
      temp: -0.26,
      contrast: 1.18,
      saturation: 1.1,
      darken: 0.54,
    },
  },
  {
    preset: 'film',
    name: 'Киножурнал',
    photo: 'forest',
    title: 'Северный лес',
    subtitle: 'Фильм второй',
    style: {
      font: 'oswald',
      effect: 'plate',
      position: 'bottom',
      align: 'left',
      frame: 'bars',
      temp: 0.18,
      contrast: 1.06,
      saturation: 0.78,
      darken: 0.12,
    },
  },
  {
    preset: 'polaroid',
    name: 'Поляроид',
    photo: 'portrait',
    title: 'Лето, двор',
    subtitle: 'Плёнка 400',
    style: {
      font: 'playfair',
      effect: 'shadow',
      position: 'bottom',
      align: 'center',
      frame: 'polaroid',
      temp: 0.26,
      contrast: 0.98,
      saturation: 0.86,
      darken: 0,
    },
  },
]

export default function Hero() {
  const canvasRef = useRef(null)
  const imagesRef = useRef({})
  const pausedRef = useRef(false)
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    warmFonts().then(() => {
      if (!cancelled) setReady(true)
    })
    const ids = [...new Set(SHOWCASE.map((item) => item.photo))]
    Promise.all(
      ids.map(async (id) => {
        const img = await loadImage(`${import.meta.env.BASE_URL}${photoById(id).src}`)
        imagesRef.current[id] = img
      }),
    ).catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return undefined
    const timer = window.setInterval(() => {
      if (!pausedRef.current) setIndex((value) => (value + 1) % SHOWCASE.length)
    }, 5200)
    return () => window.clearInterval(timer)
  }, [ready])

  useEffect(() => {
    if (!ready) return undefined
    const item = SHOWCASE[index]
    const img = imagesRef.current[item.photo]
    if (!img) return undefined
    setFading(true)
    const timer = window.setTimeout(() => {
      renderToCanvas(
        canvasRef.current,
        { ...BASE_STATE, ...item.style, title: item.title, subtitle: item.subtitle },
        img,
        { watermark: false },
      )
      setFading(false)
    }, 240)
    return () => window.clearTimeout(timer)
  }, [index, ready])

  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__rule" aria-hidden />
            Веб-сервис обложек · 16:9 и 9:16
          </p>

          <h1 className="display hero__title">
            Обложка,
            <br />
            на которую <em>кликают</em>
            <span className="hero__dot">.</span>
          </h1>

          <p className="lede">
            CoverCraft собирает превью для видео за минуты, а не за вечер. Пресеты, типографика,
            цветокоррекция и проверка композиции — в одном окне браузера.
          </p>

          <div className="hero__actions">
            <a className="btn btn--solid" href="#editor">
              Собрать обложку
              <span className="btn__arrow" aria-hidden>
                →
              </span>
            </a>
            <a className="btn btn--ghost" href="#presets">
              Смотреть пресеты
            </a>
          </div>

          <ul className="hero__meta">
            <li>Без установки</li>
            <li>Фото не покидает браузер</li>
            <li>Шрифты SIL OFL</li>
          </ul>
        </div>

        <div className="hero__art">
          <figure
            className="cover-card"
            onMouseEnter={() => {
              pausedRef.current = true
            }}
            onMouseLeave={() => {
              pausedRef.current = false
            }}
          >
            <div className="cover-card__frame">
              <canvas
                ref={canvasRef}
                className={`cover-card__canvas ${fading ? 'is-fading' : ''}`}
                width={1280}
                height={720}
                aria-label={`Пример обложки в пресете «${SHOWCASE[index].name}»`}
              />
              <span className="cover-card__badge">1280 × 720</span>
              <span className="cover-card__index mono">0{index + 1}</span>
            </div>
            <figcaption className="cover-card__caption">
              <span className="mono">{SHOWCASE[index].name}</span>
              <span className="mono dim">живой рендер · меняется сам</span>
            </figcaption>
          </figure>

          <div className="hero__note">
            <span className="mono">01</span>
            <p>
              Это не скриншот. Превью справа рисуется в браузере тем же движком, что и в редакторе
              ниже.
            </p>
          </div>
        </div>
      </div>

      <div className="hero__foot container">
        <span className="mono">Прокрутите — редактор сразу под заголовком</span>
        <span className="hero__foot-line" aria-hidden />
        <span className="mono">JPEG / PNG · до 2 МБ</span>
      </div>
    </section>
  )
}
