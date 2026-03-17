export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getStorage(key, defaultValue = null) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : defaultValue
}

export function removeStorage(key) {
  localStorage.removeItem(key)
}
