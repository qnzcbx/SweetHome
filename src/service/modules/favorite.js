import { USE_MOCK } from '@/service/request/config'
import { mockHouseList } from '@/mock/house'
import { adaptHouseList } from '@/utils/adapter'

function mockResolve(data, delay = 200) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

/**
 * 获取收藏房源列表
 * 不走分页，直接根据 ids 过滤返回
 */
export async function getFavoriteHouseListService(ids = []) {
  if (!ids.length) {
    return {
      code: 0,
      data: [],
      message: 'success'
    }
  }

  if (USE_MOCK) {
    const list = mockHouseList.filter((item) => ids.includes(item.id))
    return mockResolve({
      code: 0,
      data: adaptHouseList(list),
      message: 'success'
    })
  }

  // 如果有真实接口
  // return request.post({ url: '/favorite/list', data: { ids } })

  return {
    code: 0,
    data: [],
    message: 'success'
  }
}
