const KEY = 'covercraft.account.v1'
export const FREE_LIMIT = 5

export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const EMPTY = { pro: false, used: {}, email: null }

export function loadAccount() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw)
    return { ...EMPTY, ...parsed, used: { ...(parsed.used || {}) } }
  } catch {
    return { ...EMPTY }
  }
}

export function saveAccount(account) {
  try {
    localStorage.setItem(KEY, JSON.stringify(account))
  } catch {
    /* приватный режим — просто не сохраняем */
  }
  return account
}

export function usedThisMonth(account, date = new Date()) {
  return account.used?.[monthKey(date)] || 0
}

export function remaining(account, date = new Date()) {
  if (account.pro) return Infinity
  return Math.max(0, FREE_LIMIT - usedThisMonth(account, date))
}

export function registerExport(account, date = new Date()) {
  const key = monthKey(date)
  const used = { ...(account.used || {}) }
  used[key] = (used[key] || 0) + 1
  return saveAccount({ ...account, used })
}
