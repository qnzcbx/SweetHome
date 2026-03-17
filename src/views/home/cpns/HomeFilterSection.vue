<template>
  <div class="filter-section">
    <!-- 筛选面板 -->
    <FilterPanel
      :model-value="filterParams"
      @change="$emit('change', $event)"
      @search="$emit('search', $event)"
    />

    <!-- 搜索历史 -->
    <SearchHistory
      :history-list="historyList"
      @select="$emit('history-select', $event)"
      @remove="$emit('history-remove', $event)"
      @clear="$emit('history-clear')"
    />

    <!-- 筛选条件标签 -->
    <div v-if="activeTags.length" class="active-tags">
      <van-tag
        v-for="tag in activeTags"
        :key="tag.key"
        type="primary"
        plain
        closeable
        @close="$emit('remove-tag', tag.key)"
      >
        {{ tag.label }}
      </van-tag>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FilterPanel from '@/components/FilterPanel.vue'
import SearchHistory from '@/components/SearchHistory.vue'

const props = defineProps({
  filterParams: Object,
  historyList: Array
})

defineEmits([
  'change',
  'search',
  'history-select',
  'history-remove',
  'history-clear',
  'remove-tag'
])

// 内部计算标签
const activeTags = computed(() => {
  const tags = []
  const f = props.filterParams
  if (f.keyword) tags.push({ key: 'keyword', label: `关键词：${f.keyword}` })
  if (f.city) tags.push({ key: 'city', label: `城市：${f.city}` })
  if (f.rentType) tags.push({ key: 'rentType', label: `方式：${f.rentType}` })
  if (f.minPrice != null)
    tags.push({ key: 'minPrice', label: `最低：${f.minPrice}元` })
  if (f.maxPrice != null)
    tags.push({ key: 'maxPrice', label: `最高：${f.maxPrice}元` })
  return tags
})
</script>

<style scoped lang="scss">
.active-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}
</style>
