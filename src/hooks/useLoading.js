import { computed } from 'vue'
import { useMainStore } from '@/stores/modules/main'

export function useLoading() {
  const mainStore = useMainStore()
  const loading = computed(() => mainStore.isLoading)
  return { loading }
}
