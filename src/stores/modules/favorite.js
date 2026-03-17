import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    houseIds: []
  }),
  getters: {
    isCollected: (state) => {
      return (houseId) => state.houseIds.includes(houseId)
    }
  },
  actions: {
    toggleFavorite(houseId) {
      const index = this.houseIds.indexOf(houseId)
      if (index > -1) {
        this.houseIds.splice(index, 1)
      } else {
        this.houseIds.push(houseId)
      }
    }
  },
  persist: true
})
