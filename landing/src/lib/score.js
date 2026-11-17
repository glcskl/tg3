const CHECKS = [
  {
    id: 'contrast',
    weight: 20,
    test: (m) => m.contrast >= 108,
    text: 'Текст контрастен фону',
    hint: 'Добавьте затемнение или смените эффект',
  },
  {
    id: 'length',
    weight: 12,
    test: (_m, s) => {
      const len = (s.title || '').trim().length
      return len >= 6 && len <= 46
    },
    text: 'Заголовок читается с одного взгляда',
    hint: 'Оптимально 6–46 символов',
  },
  {
    id: 'lines',
    weight: 10,
    test: (m) => m.lines <= 3,
    text: 'Не больше трёх строк',
    hint: 'Сократите заголовок',
  },
  {
    id: 'sub',
    weight: 8,
    test: (_m, s) => Boolean((s.subtitle || '').trim()),
    text: 'Есть подзаголовок с контекстом',
    hint: 'Добавьте вторую строку',
  },
  {
    id: 'size',
    weight: 12,
    test: (m) => (m.sizeRatio ? m.sizeRatio >= 0.0422 : m.size >= 54),
    text: 'Крупный кегль для мобильной ленты',
    hint: 'Короткий заголовок даст крупнее шрифт',
  },
  {
    id: 'busy',
    weight: 8,
    test: (m) => m.covered <= 0.34,
    text: 'Кадр не перегружен текстом',
    hint: 'Оставьте воздух вокруг заголовка',
  },
]

export function scoreCover(meta, state) {
  if (!meta) return { score: 0, label: '—', items: [] }
  const items = CHECKS.map((check) => ({
    id: check.id,
    ok: Boolean(check.test(meta, state)),
    text: check.text,
    hint: check.hint,
  }))
  const total = CHECKS.reduce((sum, c) => sum + c.weight, 0)
  const earned = CHECKS.reduce((sum, c, i) => sum + (items[i].ok ? c.weight : 0), 0)
  const score = Math.round(40 + (earned / total) * 60)

  let label = 'Слабо'
  let verdict = 'Заголовок теряется: добавьте контраста и уберите лишние строки.'
  if (score >= 84) {
    label = 'Сильно'
    verdict = 'Композиция собрана: читается в ленте с первого кадра.'
  } else if (score >= 68) {
    label = 'Хорошо'
    verdict = 'Уже работает. Осталось подтянуть одну-две детали.'
  } else if (score >= 52) {
    label = 'Средне'
    verdict = 'Основа есть, но в мелком превью текст может поплыть.'
  }
  return { score, label, verdict, items }
}
