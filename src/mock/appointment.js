const APPOINTMENT_KEY = 'HOUSE_APPOINTMENT_LIST'

export function getAppointmentList() {
  return JSON.parse(localStorage.getItem(APPOINTMENT_KEY) || '[]')
}

export function saveAppointment(data) {
  const list = getAppointmentList()
  list.unshift({
    id: Date.now(),
    ...data,
    status: 'pending', // pending: 待看房, done: 已完成, cancelled: 已取消
    createTime: Date.now()
  })
  localStorage.setItem(APPOINTMENT_KEY, JSON.stringify(list))
}

export function removeAppointment(id) {
  let list = getAppointmentList()
  list = list.filter((item) => item.id !== Number(id))
  localStorage.setItem(APPOINTMENT_KEY, JSON.stringify(list))
}

export function updateAppointmentStatus(id, status) {
  const list = getAppointmentList()
  const target = list.find((item) => item.id === Number(id))
  if (target) {
    target.status = status
  }
  localStorage.setItem(APPOINTMENT_KEY, JSON.stringify(list))
}
