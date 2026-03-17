import dayjs from 'dayjs'

const reviewers = [
  { userId: 'u1', nickname: '小明同学', avatar: 'https://picsum.photos/seed/u1/100/100' },
  { userId: 'u2', nickname: '租房达人Lisa', avatar: 'https://picsum.photos/seed/u2/100/100' },
  { userId: 'u3', nickname: '北漂小王', avatar: 'https://picsum.photos/seed/u3/100/100' },
  { userId: 'u4', nickname: '阿杰看房记', avatar: 'https://picsum.photos/seed/u4/100/100' },
  { userId: 'u5', nickname: '温馨小窝', avatar: 'https://picsum.photos/seed/u5/100/100' },
  { userId: 'u6', nickname: '张三', avatar: 'https://picsum.photos/seed/u6/100/100' },
  { userId: 'u7', nickname: '城市漫步者', avatar: 'https://picsum.photos/seed/u7/100/100' },
  { userId: 'u8', nickname: '安居客小花', avatar: 'https://picsum.photos/seed/u8/100/100' }
]

const reviewContents = [
  { content: '房子很不错，采光好，交通也方便，房东人很好说话。', rating: 5 },
  { content: '整体还行，就是隔音差了点，不过价格挺合适的。', rating: 4 },
  { content: '刚搬进来一个月，周围生活设施齐全，超市菜市场都近。', rating: 5 },
  { content: '装修比照片上看起来旧一些，但打扫干净后还可以接受。', rating: 3 },
  { content: '性价比超高！同地段没有比这更便宜的了，推荐！', rating: 5 },
  { content: '楼层有点高没电梯，搬家的时候累坏了，其他都还好。', rating: 3 },
  { content: '小区环境不错，有花园有健身器材，适合居住。', rating: 4 },
  { content: '房东很爽快，家电齐全拎包入住，非常满意！', rating: 5 },
  { content: '住了半年了，邻居素质都不错，很安静。', rating: 4 },
  { content: '离地铁站走路5分钟，通勤很方便，下次还会选这里。', rating: 5 },
  { content: '热水器有点旧了，跟房东说了说会换，等后续吧。', rating: 3 },
  { content: '客厅很大，朋友来了都说选得好，很有面子哈哈。', rating: 4 }
]

// 为某个houseId生成评论列表
export function generateReviews(houseId, count = null) {
  const seed = typeof houseId === 'string' ? houseId.charCodeAt(0) : Number(houseId)
  const reviewCount = count || (3 + (seed % 5))
  const reviews = []

  for (let i = 0; i < reviewCount; i++) {
    const reviewerIdx = (seed + i * 3) % reviewers.length
    const contentIdx = (seed + i * 7) % reviewContents.length
    const daysAgo = (seed + i * 13) % 180

    reviews.push({
      reviewId: `r_${houseId}_${i}`,
      houseId,
      ...reviewers[reviewerIdx],
      ...reviewContents[contentIdx],
      images: i % 3 === 0
        ? [
            `https://picsum.photos/seed/rev${houseId}${i}a/400/300`,
            `https://picsum.photos/seed/rev${houseId}${i}b/400/300`
          ]
        : [],
      likes: Math.floor(Math.random() * 50),
      createdAt: dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD HH:mm:ss'),
      reply: i % 4 === 0
        ? { content: '感谢您的评价，祝您生活愉快！', createdAt: dayjs().subtract(daysAgo - 1, 'day').format('YYYY-MM-DD HH:mm:ss') }
        : null
    })
  }

  return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// 获取房源评分摘要
export function getReviewSummary(houseId) {
  const reviews = generateReviews(houseId)
  const total = reviews.length
  const avgRating = total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : '0.0'
  const distribution = [0, 0, 0, 0, 0]
  reviews.forEach(r => {
    distribution[r.rating - 1]++
  })

  return {
    totalCount: total,
    avgRating: Number(avgRating),
    distribution,
    tags: ['采光好', '交通便利', '性价比高', '装修不错', '房东好'].slice(0, 3 + (Number(houseId) % 3))
  }
}

// Mock API: 获取评论列表（分页）
export function mockGetReviews(houseId, { page = 1, pageSize = 5 } = {}) {
  const allReviews = generateReviews(houseId, 12)
  const start = (page - 1) * pageSize
  const list = allReviews.slice(start, start + pageSize)

  return {
    code: 200,
    data: {
      list,
      page,
      pageSize,
      total: allReviews.length,
      summary: page === 1 ? getReviewSummary(houseId) : undefined
    }
  }
}

// Mock API: 提交评论
export function mockSubmitReview(houseId, { content, rating, images = [] }) {
  return {
    code: 200,
    data: {
      reviewId: `r_${houseId}_${Date.now()}`,
      houseId,
      userId: 'current_user',
      nickname: '我',
      avatar: 'https://picsum.photos/seed/me/100/100',
      content,
      rating,
      images,
      likes: 0,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      reply: null
    },
    message: '评论成功'
  }
}
