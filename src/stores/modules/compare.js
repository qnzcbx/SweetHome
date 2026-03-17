import { defineStore } from 'pinia'
import { showToast } from 'vant'

const MAX_COMPARE = 4

export const useCompareStore = defineStore('compare', {
  state: () => ({
    compareList: []
  }),

  getters: {
    compareCount: (state) => state.compareList.length,
    compareIds: (state) => state.compareList.map(h => h.houseId),
    // 兼容性判断：传入的可能是 ID 或对象
    isInCompare: (state) => (id) => {
      const targetId = typeof id === 'object' ? (id.houseId || id.id) : id
      return state.compareList.some(h => h.houseId === targetId)
    },
    isFull: (state) => state.compareList.length >= MAX_COMPARE
  },

  actions: {
    addCompare(house) {
      // 重要：统一提取 ID
      const realId = house.houseId || house.id
      
      if (this.isInCompare(realId)) {
        showToast('已在对比列表中')
        return false
      }
      if (this.isFull) {
        showToast(`最多对比${MAX_COMPARE}套房源`)
        return false
      }

      // 按照 ComparePage 要求的字段进行存储
      this.compareList.push({
        houseId: realId, // 统一存为 houseId
        title: house.title,
        imageUrl: house.cover || house.imageUrl, // 兼容 cover 和 imageUrl
        price: house.price,
        area: house.area,
        layout: house.layout || '',
        floor: house.floor || '',
        orientation: house.orientation || '',
        decoration: house.decoration || '',
        region: house.region || (house.city + house.district),
        address: house.address || '',
        tags: house.tags || [],
        facilities: house.facilities || []
      })
      showToast('已加入对比')
      return true
    },

    removeCompare(houseId) {
      const idx = this.compareList.findIndex(h => h.houseId === houseId)
      if (idx > -1) {
        this.compareList.splice(idx, 1)
      }
    },

    toggleCompare(house) {
      const realId = house.houseId || house.id
      if (this.isInCompare(realId)) {
        this.removeCompare(realId)
        showToast('已移出对比')
        return false
      } else {
        return this.addCompare(house)
      }
    },

    clearCompare() {
      this.compareList = []
    }
  },

  persist: {
    key: 'rent-compare',
    storage: sessionStorage
  }
})
