import request from '@/service/request'
import { USE_MOCK } from '@/service/request/config'
import { mockHouseList, mockHouseDetail } from '@/mock/house'
import { adaptHouseList, adaptHouseDetail } from '@/utils/adapter'
import { normalizeFilterParams } from '@/utils/format'

function mockResolve(data, delay = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

function filterMockHouseList(params = {}) {
  const filters = normalizeFilterParams(params)
  let list = [...mockHouseList]

  if (filters.city) {
    list = list.filter((item) => item.city.includes(filters.city))
  }

  if (filters.rentType) {
    list = list.filter((item) => item.rentType === filters.rentType)
  }

  if (filters.minPrice != null) {
    list = list.filter((item) => Number(item.price) >= filters.minPrice)
  }

  if (filters.maxPrice != null) {
    list = list.filter((item) => Number(item.price) <= filters.maxPrice)
  }

  if (filters.keyword) {
    list = list.filter((item) => {
      return (
        item.title.includes(filters.keyword) ||
        item.community.includes(filters.keyword) ||
        item.district.includes(filters.keyword)
      )
    })
  }

  return list
}

/**
 * 获取房源列表（带分页）
 * @param {Object} params - { page, pageSize, keyword, city, rentType, minPrice, maxPrice }
 * @returns {{ code, data: { list, total }, message }}
 */
export async function getHouseListService(params = {}) {
  const { page = 1, pageSize = 6, ...filterParams } = params

  if (USE_MOCK) {
    const allFiltered = filterMockHouseList(filterParams)
    const total = allFiltered.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const pageList = allFiltered.slice(start, end)

    return mockResolve({
      code: 0,
      data: {
        list: adaptHouseList(pageList),
        total
      },
      message: 'success'
    })
  }

  const res = await request.get({
    url: '/houses',
    params
  })

  return {
    ...res,
    data: {
      list: adaptHouseList(res.data?.list || res.data || []),
      total: res.data?.total ?? 0
    }
  }
}

/**
 * 获取房源详情（可取消）
 */
export function getHouseDetailService(id) {
  if (USE_MOCK) {
    const detail = mockHouseDetail.find((item) => item.id === Number(id))

    return mockResolve({
      code: 0,
      data: adaptHouseDetail(detail),
      message: 'success'
    })
  }

  return request.get({
    url: `/houses/${id}`
  })
}

/**
 * 获取房源详情（可取消版本）
 * 返回 { promise, cancel }
 */
export function getHouseDetailCancelable(id) {
  if (USE_MOCK) {
    let cancelled = false
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (cancelled) {
          reject(new Error('请求被取消'))
          return
        }
        const detail = mockHouseDetail.find((item) => item.id === Number(id))
        resolve({
          code: 0,
          data: adaptHouseDetail(detail),
          message: 'success'
        })
      }, 400)
    })

    return {
      promise,
      cancel: () => { cancelled = true }
    }
  }

  return request.cancelableGet({
    url: `/houses/${id}`
  })
}
