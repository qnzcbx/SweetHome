<template>
  <div class="compare-conclusion">
    <h3 class="section-title">对比结论</h3>
    <div class="conclusion-card">
      <div class="conclusion-icon">🏆</div>
      <div class="conclusion-text">
        <p class="conclusion-title">
          综合推荐：<strong>{{ recommendHouse.title }}</strong>
        </p>
        <p class="conclusion-desc">{{ recommendReason }}</p>
      </div>
    </div>
    <div class="conclusion-details">
      <div
        v-for="item in conclusionItems"
        :key="item.label"
        class="conclusion-item"
      >
        <span class="conclusion-item__icon">{{ item.icon }}</span>
        <span class="conclusion-item__label">{{ item.label }}：</span>
        <span class="conclusion-item__value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  list: { type: Array, default: () => [] }
})

const recommendHouse = computed(() => {
  if (props.list.length === 0) return { title: '-' }
  return [...props.list].sort((a, b) => {
    // 简单模拟评分对比逻辑
    return (b.facilities?.length || 0) - (a.facilities?.length || 0)
  })[0]
})

const recommendReason = computed(() => {
  const h = recommendHouse.value
  if (!h.price) return '综合各项指标，该房源表现最优。'
  const parts = []
  if (h.price < 3000) parts.push('价格实惠')
  if (h.decoration === '精装') parts.push('精装修省心')
  return `该房源${parts.join('、')}，综合评分最高，推荐优先考虑。`
})

const conclusionItems = computed(() => {
  const list = props.list
  if (list.length < 2) return []
  const cheapest = [...list].sort((a, b) => a.price - b.price)[0]
  const largest = [...list].sort((a, b) => b.area - a.area)[0]
  const mostFac = [...list].sort(
    (a, b) => (b.facilities?.length || 0) - (a.facilities?.length || 0)
  )[0]

  return [
    {
      icon: '💰',
      label: '最低价格',
      value: `${cheapest.title}（${cheapest.price}元/月）`
    },
    {
      icon: '📐',
      label: '最大面积',
      value: `${largest.title}（${largest.area}㎡）`
    },
    {
      icon: '🏗️',
      label: '配套最全',
      value: `${mostFac.title}（${mostFac.facilities?.length || 0}项）`
    }
  ]
})
</script>

<style lang="scss" scoped>
.compare-conclusion {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
  padding-left: 8px;
  border-left: 3px solid #1989fa;
}
.conclusion-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #fff8e1, #fff3e0);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  .conclusion-icon {
    font-size: 36px;
  }
  .conclusion-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
    strong {
      color: #ff5722;
    }
  }
  .conclusion-desc {
    font-size: 12px;
    color: #888;
    line-height: 1.6;
    margin: 0;
  }
}
.conclusion-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.conclusion-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  &__icon {
    margin-right: 6px;
  }
  &__label {
    color: #666;
  }
  &__value {
    color: #333;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
