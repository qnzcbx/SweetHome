import { ref, watch } from 'vue'

/**
 * 防抖 hook
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟毫秒数
 */
export function useDebounce(fn, delay = 300) {
  let timer = null

  const run = (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  const cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return { run, cancel }
}

/**
 * 防抖 ref
 * 监听某个 ref 值变化，延迟后输出新值
 */
export function useDebouncedRef(source, delay = 300) {
  const debounced = ref(source.value)
  let timer = null

  watch(source, (val) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = val
    }, delay)
  })

  return debounced
}
