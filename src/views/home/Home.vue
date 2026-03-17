<template>
  <div class="page-home">
    <HomeHeader />
    <HomeBox />

    <!-- 筛选与搜索区 -->
    <HomeFilterSection
      :filter-params="filterParams"
      :history-list="historyList"
      @change="handleFilterChange"
      @search="addHistory"
      @history-select="handleHistorySelect"
      @history-remove="removeHistory"
      @history-clear="handleClearHistory"
      @remove-tag="removeTag"
    />

    <!-- 列表展示区 -->
    <HomeListSection
      :list="pagination.list.value"
      :total="pagination.total.value"
      :first-loading="firstLoading"
      
      v-model:loading="pagination.loading.value"
      v-model:finished="pagination.finished.value"
      v-model:refreshing="pagination.refreshing.value"
      v-model:error="pagination.error.value"
      
      @refresh="handleRefresh"
      @load="handleLoad"
      @retry="initLoad"
    />

    <CompareBar />
    <TabBar />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'

// 组件
import HomeHeader from './cpns/HomeHeader.vue'
import HomeBox from './cpns/HomeBox.vue'
import HomeFilterSection from './cpns/HomeFilterSection.vue'
import HomeListSection from './cpns/HomeListSection.vue'
import CompareBar from '@/components/CompareBar.vue'
import TabBar from '@/components/TabBar.vue'

// Hooks & Utils
import { getHouseListService } from '@/service/modules/house'
import { normalizeFilterParams, cleanEmptyQuery } from '@/utils/format'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchHistory } from '@/hooks/useSearchHistory'

const router = useRouter()
const route = useRoute()

// 1. 状态管理
const firstLoading = ref(true)
const filterParams = ref({
  keyword: '', city: '', rentType: '', minPrice: null, maxPrice: null
})

// 2. 搜索历史 Hook
const { historyList, addHistory, removeHistory, clearHistory } = useSearchHistory()

// 3. 分页加载 Hook
const pagination = usePagination(
  async ({ page, pageSize }) => {
    const res = await getHouseListService({ page, pageSize, ...filterParams.value })
    return { list: res.data?.list || [], total: res.data?.total ?? 0 }
  },
  { pageSize: 6 }
)

// 4. 逻辑处理
const initLoad = async () => {
  firstLoading.value = true
  pagination.reset()
  await pagination.onLoad(filterParams.value)
  firstLoading.value = false
}

const handleLoad = () => !firstLoading.value && pagination.onLoad(filterParams.value)
const handleRefresh = () => pagination.onRefresh(filterParams.value)

const { run: debouncedFilter } = useDebounce(async params => {
  filterParams.value = normalizeFilterParams(params)
  const query = cleanEmptyQuery(filterParams.value)
  await router.replace({ path: '/home', query })
  pagination.reset()
  await pagination.onLoad(filterParams.value)
}, 300)

const handleFilterChange = params => debouncedFilter(params)

const handleHistorySelect = keyword => handleFilterChange({ ...filterParams.value, keyword })

const handleClearHistory = async () => {
  try {
    await showConfirmDialog({ title: '提示', message: '确定要清空搜索历史吗？' })
    clearHistory()
  } catch {
    // 
  }
}

const removeTag = key => {
  const newParams = { ...filterParams.value }
  newParams[key] = (key === 'minPrice' || key === 'maxPrice') ? null : ''
  handleFilterChange(newParams)
}

onMounted(() => {
  filterParams.value = normalizeFilterParams(route.query)
  initLoad()
})
</script>

<style scoped lang="scss">
.page-home {
  min-height: 100vh; background: #f7f8fa;
  padding: 12px 12px 70px;
}
</style>
