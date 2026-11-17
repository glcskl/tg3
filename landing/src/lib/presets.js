export const FONTS = [
  { id: 'playfair', name: 'Playfair Display', note: 'журнальная антиква' },
  { id: 'unbounded', name: 'Unbounded', note: 'широкий гротеск' },
  { id: 'oswald', name: 'Oswald', note: 'узкий плакатный' },
]

export const EFFECTS = [
  { id: 'shadow', name: 'Тень' },
  { id: 'outline', name: 'Обводка' },
  { id: 'plate', name: 'Плашка' },
  { id: 'neon', name: 'Свечение' },
  { id: 'auto', name: 'Авто-цвет' },
]

export const POSITIONS = [
  { id: 'top', name: 'Сверху' },
  { id: 'center', name: 'По центру' },
  { id: 'bottom', name: 'Снизу' },
]

export const ALIGNS = [
  { id: 'left', name: 'Влево' },
  { id: 'center', name: 'Центр' },
  { id: 'right', name: 'Вправо' },
]

export const FRAMES = [
  { id: 'none', name: 'Без рамки' },
  { id: 'bars', name: 'Полосы' },
  { id: 'polaroid', name: 'Поляроид' },
]

export const PHOTOS = [
  { id: 'mountains', name: 'Горы', src: 'photos/mountains.jpg' },
  { id: 'portrait', name: 'Портрет', src: 'photos/portrait.jpg' },
  { id: 'city', name: 'Город', src: 'photos/city.jpg' },
  { id: 'forest', name: 'Лес', src: 'photos/forest.jpg' },
  { id: 'dog', name: 'Собака', src: 'photos/dog.jpg' },
]

export const FORMATS = [
  { id: 'wide', name: 'Горизонталь', ratio: '16:9', w: 1280, h: 720, note: 'видео и превью' },
  { id: 'vertical', name: 'Вертикаль', ratio: '9:16', w: 1080, h: 1920, note: 'шортсы и рилсы' },
]

export const BASE_STATE = {
  format: 'wide',
  preset: 'quiet',
  photo: 'mountains',
  title: 'Тихая дорога',
  subtitle: 'Дневник одного путешествия',
  font: 'playfair',
  effect: 'shadow',
  position: 'bottom',
  align: 'left',
  frame: 'none',
  temp: 0.12,
  brightness: 1,
  contrast: 1.04,
  saturation: 0.94,
  darken: 0.42,
  zoom: 1,
}

export const PRESETS = [
  {
    id: 'quiet',
    name: 'Тихий кадр',
    tag: 'Влог · путешествия',
    note: 'Антиква, мягкая тень, тёплый баланс. Для спокойных историй и дневников.',
    style: {
      font: 'playfair',
      effect: 'shadow',
      position: 'bottom',
      align: 'left',
      frame: 'none',
      temp: 0.14,
      brightness: 1,
      contrast: 1.04,
      saturation: 0.92,
      darken: 0.44,
    },
    sample: { photo: 'mountains', title: 'Тихая дорога', subtitle: 'Дневник одного путешествия' },
  },
  {
    id: 'loud',
    name: 'Громко',
    tag: 'Разбор · мнение',
    note: 'Широкий гротеск по центру, обводка и высокий контраст. Для смелых тезисов.',
    style: {
      font: 'unbounded',
      effect: 'outline',
      position: 'center',
      align: 'center',
      frame: 'none',
      temp: -0.04,
      brightness: 1.02,
      contrast: 1.14,
      saturation: 1.12,
      darken: 0.3,
    },
    sample: { photo: 'portrait', title: 'Всё сломано', subtitle: 'Разбираем за 8 минут' },
  },
  {
    id: 'film',
    name: 'Киножурнал',
    tag: 'Документальное',
    note: 'Белые полосы, узкий шрифт, приглушённый цвет. Кадр как из плёнки.',
    style: {
      font: 'oswald',
      effect: 'plate',
      position: 'bottom',
      align: 'left',
      frame: 'bars',
      temp: 0.18,
      brightness: 0.98,
      contrast: 1.06,
      saturation: 0.78,
      darken: 0.12,
    },
    sample: { photo: 'forest', title: 'Северный лес', subtitle: 'Фильм второй' },
  },
  {
    id: 'polaroid',
    name: 'Поляроид',
    tag: 'Личное · лайфстайл',
    note: 'Белое поле для подписи, тёплый отпечаток. Для личных и семейных историй.',
    style: {
      font: 'playfair',
      effect: 'shadow',
      position: 'bottom',
      align: 'center',
      frame: 'polaroid',
      temp: 0.26,
      brightness: 1.03,
      contrast: 0.98,
      saturation: 0.86,
      darken: 0,
    },
    sample: { photo: 'dog', title: 'Лето, двор', subtitle: 'Плёнка 400' },
  },
  {
    id: 'night',
    name: 'Ночной город',
    tag: 'Музыка · стрит',
    note: 'Холодный баланс, свечение и глубокие тени. Для ночных съёмок и клипов.',
    style: {
      font: 'unbounded',
      effect: 'neon',
      position: 'bottom',
      align: 'left',
      frame: 'none',
      temp: -0.26,
      brightness: 0.96,
      contrast: 1.18,
      saturation: 1.1,
      darken: 0.52,
    },
    sample: { photo: 'city', title: 'После полуночи', subtitle: 'Новый трек' },
  },
  {
    id: 'poster',
    name: 'Плакат',
    tag: 'Анонс · событие',
    note: 'Крупная обводка сверху, плотный цвет. Для анонсов, лекций и афиш.',
    style: {
      font: 'oswald',
      effect: 'outline',
      position: 'top',
      align: 'center',
      frame: 'none',
      temp: 0,
      brightness: 1.04,
      contrast: 1.2,
      saturation: 1.24,
      darken: 0.22,
    },
    sample: { photo: 'mountains', title: 'Лекция в среду', subtitle: '19:00 · свободный вход' },
  },
]

export const presetById = (id) => PRESETS.find((p) => p.id === id) || PRESETS[0]
export const photoById = (id) => PHOTOS.find((p) => p.id === id) || PHOTOS[0]
export const formatById = (id) => FORMATS.find((f) => f.id === id) || FORMATS[0]
export const formatOf = (state) => formatById(state?.format)
