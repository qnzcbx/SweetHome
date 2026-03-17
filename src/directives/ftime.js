import dayjs from 'dayjs'

export default function directiveFtime(app) {
  app.directive('ftime', {
    mounted(el, binding) {
      let timestamp = String(el.textContent || '').trim()

      if (!timestamp) return

      if (timestamp.length === 10) {
        timestamp = Number(timestamp) * 1000
      } else {
        timestamp = Number(timestamp)
      }

      let value = binding.value
      if (!value) {
        value = 'YYYY-MM-DD HH:mm:ss'
      }

      const formatTime = dayjs(timestamp).format(value)
      el.textContent = formatTime
    }
  })
}
