<template>
  <div class="compare-table">
    <div
      v-for="dim in dimensions"
      :key="dim.key"
      class="compare-row"
      :class="{ 'compare-row--highlight': dim.highlight }"
    >
      <div class="compare-row__label">{{ dim.label }}</div>
      <div class="compare-row__values">
        <div
          v-for="(house, idx) in list"
          :key="house.houseId"
          class="compare-row__cell"
          :class="{ 'compare-row__cell--best': bestIndex(dim) === idx }"
        >
          <!-- 标签类型 -->
          <template v-if="dim.key === 'tags'">
            <van-tag
              v-for="tag in house.tags"
              :key="tag"
              type="primary"
              plain
              size="medium"
              style="margin: 2px"
            >
              {{ tag }}
            </van-tag>
            <span v-if="!house.tags?.length" class="no-data">-</span>
          </template>

          <!-- 配套设施类型 -->
          <template v-else-if="dim.key === 'facilities'">
            <div class="facility-grid">
              <span
                v-for="f in (house.facilities || []).slice(0, 6)"
                :key="f"
                class="facility-tag"
                >{{ f }}</span
              >
            </div>
            <span v-if="!house.facilities?.length" class="no-data">-</span>
          </template>

          <!-- 综合评分类型 -->
          <template v-else-if="dim.key === 'score'">
            <div class="score-cell">
              <span class="score-num">{{ calcScore(house) }}</span>
              <van-rate
                :model-value="calcScore(house) / 20"
                :size="12"
                readonly
                allow-half
                void-icon="star"
                color="#ffd21e"
              />
            </div>
          </template>

          <!-- 普通文本/自定义渲染 -->
          <template v-else>
            {{ dim.render ? dim.render(house) : house[dim.key] || '-' }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  list: { type: Array, default: () => [] },
  dimensions: { type: Array, required: true }
})

// 计算综合评分
function calcScore(house) {
  let score = 60
  if (house.price < 2000) score += 15
  else if (house.price < 3500) score += 10
  if (house.area > 80) score += 10
  else if (house.area > 50) score += 6
  if (house.decoration === '精装') score += 8
  const facilityCount = house.facilities?.length || 0
  score += Math.min(facilityCount * 1.5, 12)
  return Math.min(score, 100).toFixed(0)
}

// 最优索引逻辑
function bestIndex(dim) {
  const list = props.list
  if (list.length < 2 || ['tags', 'facilities', 'score'].includes(dim.key))
    return -1

  if (dim.key === 'price' || dim.key === 'pricePerArea') {
    const values =
      dim.key === 'pricePerArea'
        ? list.map(h => h.price / h.area)
        : list.map(h => h.price)
    return values.indexOf(Math.min(...values))
  }
  if (dim.key === 'area') {
    const values = list.map(h => h.area)
    return values.indexOf(Math.max(...values))
  }
  return -1
}
</script>

<style lang="scss" scoped>
.compare-table {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
}

.compare-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  &--highlight {
    background: #f0f7ff;
  }

  &__label {
    width: 72px;
    flex-shrink: 0;
    padding: 12px 8px;
    font-size: 12px;
    color: #666;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #f0f0f0;
  }

  &__values {
    flex: 1;
    display: flex;
  }

  &__cell {
    flex: 1;
    padding: 12px 8px;
    font-size: 12px;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    border-right: 1px solid #f0f0f0;
    &:last-child {
      border-right: none;
    }
    &--best {
      color: #ff5722;
      font-weight: 700;
      position: relative;
      &::after {
        content: '👑';
        position: absolute;
        top: 2px;
        right: 4px;
        font-size: 10px;
      }
    }
  }
}

.no-data {
  color: #ccc;
}
.facility-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
}
.facility-tag {
  font-size: 10px;
  background: #e8f4fd;
  color: #1989fa;
  padding: 1px 5px;
  border-radius: 3px;
}
.score-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  .score-num {
    font-size: 18px;
    font-weight: 700;
    color: #ff9800;
  }
}
</style>
