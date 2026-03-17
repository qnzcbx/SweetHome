export default function directiveLazy(app) {
  app.directive('lazy', {
    mounted(el, binding) {
      let src = ''
      let placeholder = ''
      let errorImg = ''

      if (typeof binding.value === 'string') {
        src = binding.value
      } else if (binding.value && typeof binding.value === 'object') {
        src = binding.value.src
        placeholder = binding.value.placeholder || ''
        errorImg = binding.value.error || ''
      }

      if (!src) return

      el.src =
        placeholder ||
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            const img = new Image()
            img.src = src

            img.onload = () => {
              el.src = src
              observer.unobserve(el)
            }

            img.onerror = () => {
              if (errorImg) {
                el.src = errorImg
              }
              observer.unobserve(el)
            }
          })
        },
        {
          rootMargin: '100px',
          threshold: 0.01
        }
      )

      observer.observe(el)
      el._lazyObserver = observer
    },

    unmounted(el) {
      if (el._lazyObserver) {
        el._lazyObserver.disconnect()
        delete el._lazyObserver
      }
    }
  })
}
