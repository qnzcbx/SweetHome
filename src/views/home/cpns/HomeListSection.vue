<template>
  <div class="list-section">
    <div class="result-count" v-if="total > 0">
      共找到 <span class="highlight">{{ total }}</span> 套房源
    </div>

    <HouseSkeleton v-if="firstLoading" :count="3" />

    <ErrorBlock
      v-else-if="error && list.length === 0"
      description="房源加载失败"
      @retry="$emit('retry')"
    />

    <van-pull-refresh
      v-else
      :model-value="refreshing"
      @update:model-value="$emit('update:refreshing', $event)"
      @refresh="$emit('refresh')"
    >
      <van-list
        :loading="loading"
        @update:loading="$emit('update:loading', $event)"
        :finished="finished"
        @update:finished="$emit('update:finished', $event)"
        :error="error"
        @update:error="$emit('update:error', $event)"
        finished-text="没有更多了"
        error-text="请求失败，点击重新加载"
        @load="$emit('load')"
      >
        <HouseCard v-for="item in list" :key="item.id" :house="item" />
      </van-list>

      <van-empty
        v-if="!loading && list.length === 0"
        description="暂无符合条件的房源"
      />
    </van-pull-refresh>
  </div>
</template>

<script setup>
import HouseCard from '@/components/HouseCard.vue'
import HouseSkeleton from '@/components/HouseSkeleton.vue'
import ErrorBlock from '@/components/ErrorBlock.vue'

// 接收具体的属性，而不是整个对象
defineProps({
  list: Array,
  total: Number,
  loading: Boolean,
  finished: Boolean,
  refreshing: Boolean,
  error: Boolean,
  firstLoading: Boolean
})

// 声明更新事件，用于支持 v-model
defineEmits([
  'update:loading',
  'update:finished',
  'update:refreshing',
  'update:error',
  'refresh',
  'load',
  'retry'
])
</script>

<style scoped lang="scss">
.result-count {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
  .highlight {
    color: var(--primary-color);
    font-weight: bold;
  }
}
</style>
