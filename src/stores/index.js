import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

// 统一导出所有store
export { useMainStore } from './modules/main'
export { useUserStore } from './modules/user'
export { useFavoriteStore } from './modules/favorite'
export { useCompareStore } from './modules/compare'
export { useMessageStore } from './modules/message'
