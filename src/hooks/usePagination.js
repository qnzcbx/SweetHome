import { ref } from 'vue'

/**
 * 分页 hook
 * @param {Function} fetchFn - 请求函数，接收 { page, pageSize, ...extraParams }，返回 { list, total }
 * @param {Object} options - 配置项
 */
export function usePagination(fetchFn, options = {}) {
  const {
    pageSize = 6,
    immediate = false
  } = options

  const list = ref([])
  const page = ref(1)
  const total = ref(0)
  const loading = ref(false)
  const refreshing = ref(false)
  const finished = ref(false)
  const error = ref(false)

  // 加载更多
  const onLoad = async (extraParams = {}) => {
    if (finished.value || loading.value) return

    loading.value = true
    error.value = false

    try {
      const res = await fetchFn({
        page: page.value,
        pageSize,
        ...extraParams
      })

      const newList = res.list || []
      total.value = res.total ?? 0

      if (page.value === 1) {
        list.value = newList
      } else {
        list.value = [...list.value, ...newList]
      }

      // 判断是否加载完
      if (list.value.length >= total.value || newList.length < pageSize) {
        finished.value = true
      } else {
        page.value++
      }
    } catch (err) {
      error.value = true
      console.error('分页加载失败:', err)
    } finally {
      loading.value = false
      refreshing.value = false
    }
  }

  // 下拉刷新
  const onRefresh = async (extraParams = {}) => {
    refreshing.value = true
    page.value = 1
    finished.value = false
    error.value = false
    await onLoad(extraParams)
  }

  // 重置
  const reset = () => {
    list.value = []
    page.value = 1
    total.value = 0
    finished.value = false
    loading.value = false
    refreshing.value = false
    error.value = false
  }

  if (immediate) {
    onLoad()
  }

  return {
    list,
    page,
    total,
    loading,
    refreshing,
    finished,
    error,
    onLoad,
    onRefresh,
    reset
  }
}
