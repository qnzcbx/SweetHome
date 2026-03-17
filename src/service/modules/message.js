import { mockGetMessages, mockMarkRead, mockMarkAllRead } from '@/mock/message'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function getMessages(params = {}) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300))
    return mockGetMessages(params)
  }
  // return bxRequest.get('/messages', { params })
}

export async function markMessageRead(messageId) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 100))
    return mockMarkRead(messageId)
  }
  // return bxRequest.put(`/messages/${messageId}/read`)
}

export async function markAllMessagesRead() {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200))
    return mockMarkAllRead()
  }
  // return bxRequest.put('/messages/read-all')
}
