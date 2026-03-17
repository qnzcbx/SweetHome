<template>
  <div class="compare-page">
    <van-nav-bar
      title="房源对比"
      left-arrow
      @click-left="router.back()"
      fixed
      placeholder
    />

    <!-- 空状态 -->
    <van-empty
      v-if="compareStore.compareCount < 2"
      image="search"
      description="请至少选择2套房源进行对比"
    >
      <van-button type="primary" round size="small" @click="router.push('/')"
        >去选房</van-button
      >
    </van-empty>

    <!-- 对比内容 -->
    <div v-else class="compare-content">
      <CompareHeader
        :list="compareStore.compareList"
        @remove="handleRemove"
        @view-detail="id => router.push(`/detail/${id}`)"
      />

      <CompareTable :list="compareStore.compareList" :dimensions="dimensions" />

      <CompareRadar :list="compareStore.compareList" />

      <CompareConclusion :list="compareStore.compareList" />

      <div class="compare-footer">
        <van-button block type="primary" round @click="router.push('/')"
          >继续找房</van-button
        >
        <van-button
          block
          plain
          round
          @click="handleClearAll"
          style="margin-top: 10px"
          >清空对比</van-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCompareStore } from '@/stores/modules/compare'
import { showConfirmDialog, showToast } from 'vant'

import CompareHeader from './cpns/CompareHeader.vue'
import CompareTable from './cpns/CompareTable.vue'
import CompareRadar from './cpns/CompareRadar.vue'
import CompareConclusion from './cpns/CompareConclusion.vue'

const router = useRouter()
const compareStore = useCompareStore()

const dimensions = [
  {
    key: 'price',
    label: '月租金',
    render: h => `${h.price} 元/月`,
    highlight: true
  },
  { key: 'area', label: '面积', render: h => `${h.area} ㎡` },
  {
    key: 'pricePerArea',
    label: '单价',
    render: h => `${(h.price / h.area).toFixed(1)} 元/㎡`
  },
  { key: 'layout', label: '户型' },
  { key: 'floor', label: '楼层' },
  { key: 'orientation', label: '朝向' },
  { key: 'decoration', label: '装修' },
  { key: 'tags', label: '标签' },
  { key: 'facilities', label: '配套设施', highlight: true },
  { key: 'score', label: '综合评分', highlight: true }
]

function handleRemove(houseId) {
  compareStore.removeCompare(houseId)
  showToast('已移除')
}

async function handleClearAll() {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定清空所有对比房源？'
    })
    compareStore.clearCompare()
    showToast('已清空')
  } catch {
    //
  }
}
</script>

<style lang="scss" scoped>
.compare-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: env(safe-area-inset-bottom);
}
.compare-content {
  padding: 12px;
}
.compare-footer {
  padding: 16px 0 24px;
}
</style>
