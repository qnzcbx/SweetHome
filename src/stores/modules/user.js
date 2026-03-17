import { defineStore } from 'pinia'
import { useMessageStore } from './message'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: {
      userId: '',
      nickname: '',
      phone: '',
      avatar: ''
    },
    redirectUrl: '' // 登录后要回跳的地址
  }),
  getters: {
    isLogin: (state) => !!state.token
  },
  actions: {
    setToken(token) {
      this.token = token
    },
    setUserInfo(info) {
      this.userInfo = { ...this.userInfo, ...info }
    },
    updateAvatar(avatarUrl) {
      this.userInfo.avatar = avatarUrl
    },
    login(data) {
      this.token = data.token || 'mock_token_' + Date.now()
      this.userInfo = {
        userId: data.userId || 'u_001',
        nickname: data.nickname || data.phone || '租房用户',
        phone: data.phone || '',
        avatar: data.avatar || this.userInfo.avatar || ''
      }
    },
    setLogin(payload) {
      this.token = payload.token
      this.userInfo = payload.userInfo
    },
    logout() {
      // 1. 清理自身状态
      this.token = ''
      this.userInfo = { userId: '', nickname: '', phone: '', avatar: '' }
      this.redirectUrl = ''
      
      // 2. 联动清理消息状态
      const messageStore = useMessageStore()
      messageStore.clearUnread() 
      
      // 3. 其他需要清理的 Store（如对比列表），也在这里清理
      // const compareStore = useCompareStore()
      // compareStore.clearCompare()
    },
    setRedirectUrl(url) {
      this.redirectUrl = url
    },
    consumeRedirectUrl() {
      const url = this.redirectUrl
      this.redirectUrl = ''
      return url
    }
  },
  persist: {
    key: 'rent-user',
    storage: localStorage,
    // redirectUrl 不需要持久化，刷新后自然清空
    pick: ['token', 'userInfo']
  }
})
