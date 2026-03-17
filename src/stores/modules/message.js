import { defineStore } from 'pinia'
import { getMessages } from '@/service/modules/message'
import { useUserStore } from './user' // 模拟引入 userStore

export const useMessageStore = defineStore('message', {
  state: () => ({
    unreadCount: 0
  }),

  actions: {
    setUnreadCount(count) {
      this.unreadCount = count
    },

    decrementUnread() {
      if (this.unreadCount > 0) this.unreadCount--
    },

    clearUnread() {
      this.unreadCount = 0
    },

    async fetchUnreadCount() {
      const userStore = useUserStore()
      // 关键点：未登录时不执行请求
      if (!userStore.isLogin) return 

      try {
        const res = await getMessages({ page: 1, pageSize: 1 })
        const data = res.data || res
        this.unreadCount = data.unreadCount || 0
      } catch {
        // silent
      }
    }
  }
})
