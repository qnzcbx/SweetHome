import request from '@/service/request'
import { USE_MOCK } from '@/service/request/config'
import {
  saveAppointment,
  getAppointmentList,
  removeAppointment,
  updateAppointmentStatus
} from '@/mock/appointment'
import { adaptAppointmentList } from '@/utils/adapter'

function mockResolve(data, delay = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

// 创建预约
export function createAppointmentService(data) {
  if (USE_MOCK) {
    saveAppointment(data)
    return mockResolve({
      code: 0,
      data: true,
      message: '预约成功'
    })
  }

  return request.post({
    url: '/appointment',
    data
  })
}

// 获取预约列表
export function getAppointmentListService() {
  if (USE_MOCK) {
    const rawList = getAppointmentList()
    return mockResolve({
      code: 0,
      data: adaptAppointmentList(rawList),
      message: 'success'
    })
  }

  return request.get({
    url: '/appointment/list'
  })
}

// 删除预约
export function deleteAppointmentService(id) {
  if (USE_MOCK) {
    removeAppointment(id)
    return mockResolve({
      code: 0,
      data: true,
      message: '删除成功'
    })
  }

  return request.post({
    url: `/appointment/delete/${id}`
  })
}

// 取消预约
export function cancelAppointmentService(id) {
  if (USE_MOCK) {
    updateAppointmentStatus(id, 'cancelled')
    return mockResolve({
      code: 0,
      data: true,
      message: '已取消预约'
    })
  }

  return request.post({
    url: `/appointment/cancel/${id}`
  })
}

// 标记完成
export function completeAppointmentService(id) {
  if (USE_MOCK) {
    updateAppointmentStatus(id, 'done')
    return mockResolve({
      code: 0,
      data: true,
      message: '已标记完成'
    })
  }

  return request.post({
    url: `/appointment/complete/${id}`
  })
}
