import { mockGetReviews, mockSubmitReview } from '@/mock/review'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

// 获取评论列表
export async function getReviews(houseId, params = {}) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 400))
    return mockGetReviews(houseId, params)
  }
  // 真实API
  // return bxRequest.get(`/reviews/${houseId}`, { params })
  return { data: { list: [], total: 0 } } // 兜底返回空数据
}

// 提交评论
export async function submitReview(houseId, data) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 600))
    return mockSubmitReview(houseId, data)
  }
  // return bxRequest.post(`/reviews/${houseId}`, data)
}
