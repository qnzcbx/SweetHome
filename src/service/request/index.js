import axios from 'axios'
import { showFailToast } from 'vant'
import { BASE_URL, TIMEOUT } from './config'
import pinia from '@/stores'
import { useMainStore } from '@/stores/modules/main'
import { useUserStore } from '@/stores/modules/user'

// ============ 重复请求取消管理 ============
class PendingRequestManager {
  constructor() {
    this.pendingMap = new Map()
  }

  // 生成请求唯一标识
  generateKey(config) {
    const { method, url, params, data } = config
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  // 添加请求，如果已有相同请求则取消前一个
  add(config) {
    const key = this.generateKey(config)

    if (this.pendingMap.has(key)) {
      const cancel = this.pendingMap.get(key)
      cancel('重复请求被取消')
      this.pendingMap.delete(key)
    }

    config.cancelToken = new axios.CancelToken((cancel) => {
      this.pendingMap.set(key, cancel)
    })
  }

  // 请求完成后移除
  remove(config) {
    const key = this.generateKey(config)
    this.pendingMap.delete(key)
  }

  // 清空所有待处理请求
  clear() {
    this.pendingMap.forEach((cancel) => {
      cancel('路由切换，请求取消')
    })
    this.pendingMap.clear()
  }
}

export const pendingManager = new PendingRequestManager()

// ============ BXRequest ============
export class BXRequest {
  constructor(baseURL, timeout = 10000) {
    this.instance = axios.create({
      baseURL,
      timeout
    })

    // 请求拦截
    this.instance.interceptors.request.use(
      (config) => {
        const mainStore = useMainStore(pinia)
        const userStore = useUserStore(pinia)

        mainStore.isLoading = true

        // 取消重复请求
        pendingManager.add(config)

        // 注入 token
        if (userStore.token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${userStore.token}`
        }

        return config
      },
      (err) => {
        const mainStore = useMainStore(pinia)
        mainStore.isLoading = false
        return Promise.reject(err)
      }
    )

    // 响应拦截
    this.instance.interceptors.response.use(
      (res) => {
        const mainStore = useMainStore(pinia)
        mainStore.isLoading = false

        // 请求完成，移除记录
        pendingManager.remove(res.config)

        return res
      },
      (err) => {
        const mainStore = useMainStore(pinia)
        mainStore.isLoading = false

        // 如果是手动取消的请求，静默处理
        if (axios.isCancel(err)) {
          console.log('请求被取消：', err.message)
          return Promise.reject(err)
        }

        // 请求完成，移除记录
        if (err.config) {
          pendingManager.remove(err.config)
        }

        const status = err?.response?.status
        const message =
          err?.response?.data?.message || err?.message || '请求失败'

        if (status === 401) {
          const userStore = useUserStore(pinia)
          userStore.logout()
          showFailToast('登录已过期，请重新登录')
        } else {
          showFailToast(message)
        }

        return Promise.reject(err)
      }
    )
  }

  request(config) {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res) => {
          const data = res.data

          if (data && typeof data === 'object') {
            if ('code' in data) {
              if (data.code === 0 || data.code === 200) {
                resolve(data)
              } else {
                showFailToast(data.message || '业务请求失败')
                reject(data)
              }
              return
            }

            if ('success' in data) {
              if (data.success) {
                resolve({
                  code: 0,
                  data: data.result,
                  message: data.message || 'success'
                })
              } else {
                showFailToast(data.message || '业务请求失败')
                reject(data)
              }
              return
            }
          }

          resolve({
            code: 0,
            data,
            message: 'success'
          })
        })
        .catch((err) => {
          // 取消的请求不 reject 到业务层
          if (axios.isCancel(err)) return
          reject(err)
        })
    })
  }

  get(config) {
    return this.request({ ...config, method: 'get' })
  }

  post(config) {
    return this.request({ ...config, method: 'post' })
  }

  /**
   * 可取消的 GET 请求
   * 返回 { promise, cancel }
   */
  cancelableGet(config) {
    const controller = new AbortController()

    const promise = this.request({
      ...config,
      method: 'get',
      signal: controller.signal
    })

    return {
      promise,
      cancel: (reason = '请求被取消') => controller.abort(reason)
    }
  }

  /**
   * 可取消的 POST 请求
   */
  cancelablePost(config) {
    const controller = new AbortController()

    const promise = this.request({
      ...config,
      method: 'post',
      signal: controller.signal
    })

    return {
      promise,
      cancel: (reason = '请求被取消') => controller.abort(reason)
    }
  }
}

export default new BXRequest(BASE_URL, TIMEOUT)
