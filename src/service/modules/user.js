import { defineStore } from 'pinia'

// ===================================================================
//  1. Service 层：负责与后端 API 进行数据交互
// ===================================================================

/**
 * 模拟登录接口。
 * 将来当真实后端接口准备好后，只需修改这个函数内部的实现即可。
 * @param {object} data - 包含用户名和手机号的对象 { username, mobile }
 * @returns {Promise<object>} - 返回一个 Promise，其值为 { code, message, data: { token, userInfo } }
 */
export const loginService = (data) => {
  return new Promise((resolve) => {
    // 模拟 200ms 的网络延迟
    setTimeout(() => {
      // 模拟后端成功响应的数据结构
      const response = {
        code: 200,
        message: '登录成功',
        data: {
          // 生成一个每次都不同的模拟 token，以模拟真实登录
          token: `mock_token_${new Date().getTime()}`,
          // 根据传入的用户名和手机号动态生成用户信息
          userInfo: {
            id: Math.floor(Math.random() * 10000),
            username: data.username,
            mobile: data.mobile,
            // 使用一个免费的 API 生成一个基于用户名的随机头像，让模拟更真实
            avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${data.username}`,
            nickname: `用户_${data.username.slice(0, 5)}`
          }
        }
      }
      console.log('[模拟API] loginService 被调用, 返回数据:', response)
      resolve(response)
    }, 200)
  })
}

// ===================================================================
//  2. Store 层：负责全局状态管理 (Pinia)
// ===================================================================

export const useUserStore = defineStore('user', {
  /**
   * State: 定义状态的地方
   */
  state: () => ({
    token: '',
    userInfo: null,
    redirectUrl: '' // 登录后要回跳的地址，不需要持久化
  }),

  /**
   * Getters: 类似于 Vue 的 computed 属性，用于派生状态
   */
  getters: {
    // 判断用户是否已登录
    isLogin: (state) => !!state.token
  },

  /**
   * Actions: 类似于 Vue 的 methods，用于修改 state
   */
  actions: {
    /**
     * 设置登录状态，保存 token 和用户信息
     * @param {object} payload - 通常是 { token, userInfo }
     */
    setLogin(payload) {
      console.log('[Pinia] setLogin action 被调用, payload:', payload)
      if (payload && payload.token && payload.userInfo) {
        this.token = payload.token
        this.userInfo = payload.userInfo
      } else {
        console.error('[Pinia] setLogin 失败，传入的 payload 无效')
      }
    },

    /**
     * 退出登录，清空所有用户相关状态
     */
    logout() {
      console.log('[Pinia] logout action 被调用')
      this.token = ''
      this.userInfo = null
      this.redirectUrl = ''
      // 如果使用 localStorage/sessionStorage，也应在这里清除
      // pinia-plugin-persistedstate 会自动处理
    },

    /**
     * 在需要登录才能访问的页面，保存原始的访问地址
     * @param {string} url - 用户想访问但被拦截的地址
     */
    setRedirectUrl(url) {
      this.redirectUrl = url
    },

    /**
     * "消费"（获取并清空）回跳地址。
     * 在登录成功后调用，以跳转到之前的页面。
     * @returns {string | null} - 返回保存的地址，如果没有则返回空字符串或 null
     */
    consumeRedirectUrl() {
      const url = this.redirectUrl
      this.redirectUrl = '' // 获取后立即清空，避免重复使用
      return url
    }
  },

  /**
   * Persist: 使用 pinia-plugin-persistedstate 插件进行状态持久化
   */
  persist: {
    // 默认情况下，所有 state 都会被持久化。
    // 使用 `paths` 或 `pick` (在某些旧版本中) 可以指定要持久化的字段。
    paths: ['token', 'userInfo']
    // 注意：redirectUrl 不需要持久化，因为它只在单次会话中有效，刷新页面后就应该失效。
  }
})

