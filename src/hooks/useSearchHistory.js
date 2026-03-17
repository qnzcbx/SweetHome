import { ref } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'

const SEARCH_HISTORY_KEY = 'HOUSE_SEARCH_HISTORY'
const MAX_HISTORY = 10

export function useSearchHistory() {
  const historyList = ref(getStorage(SEARCH_HISTORY_KEY, []))

  // 添加搜索记录
  const addHistory = (keyword) => {
    if (!keyword || !keyword.trim()) return

    const trimmed = keyword.trim()

    // 去重：如果已存在，先删掉旧的
    const index = historyList.value.indexOf(trimmed)
    if (index > -1) {
      historyList.value.splice(index, 1)
    }

    // 添加到头部
    historyList.value.unshift(trimmed)

    // 最多保留 MAX_HISTORY 条
    if (historyList.value.length > MAX_HISTORY) {
      historyList.value = historyList.value.slice(0, MAX_HISTORY)
    }

    save()
  }

  // 删除单条
  const removeHistory = (index) => {
    historyList.value.splice(index, 1)
    save()
  }

  // 清空
  const clearHistory = () => {
    historyList.value = []
    save()
  }

  // 持久化
  const save = () => {
    setStorage(SEARCH_HISTORY_KEY, historyList.value)
  }

  return {
    historyList,
    addHistory,
    removeHistory,
    clearHistory
  }
}
