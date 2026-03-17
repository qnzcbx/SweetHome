<template>
  <div class="compare-radar">
    <h3 class="section-title">综合评分</h3>
    <div class="radar-chart">
      <svg viewBox="0 0 300 300" class="radar-svg">
        <!-- 背景网格 -->
        <polygon
          v-for="level in 5"
          :key="'grid-' + level"
          :points="getGridPoints(level / 5)"
          class="radar-grid"
        />
        <!-- 轴线 -->
        <line
          v-for="(_, i) in radarDimensions"
          :key="'axis-' + i"
          x1="150"
          y1="150"
          :x2="getPoint(i, 1).x"
          :y2="getPoint(i, 1).y"
          class="radar-axis"
        />
        <!-- 轴标签 -->
        <text
          v-for="(dim, i) in radarDimensions"
          :key="'label-' + i"
          :x="getLabelPoint(i).x"
          :y="getLabelPoint(i).y"
          class="radar-label"
          text-anchor="middle"
        >
          {{ dim.label }}
        </text>
        <!-- 数据区域 -->
        <polygon
          v-for="(house, hIdx) in list"
          :key="'data-' + house.houseId"
          :points="getHousePoints(house)"
          :class="'radar-data radar-data--' + hIdx"
        />
      </svg>
      <div class="radar-legend">
        <div
          v-for="(house, idx) in list"
          :key="house.houseId"
          class="radar-legend__item"
        >
          <span class="radar-legend__dot" :class="'dot--' + idx"></span>
          <span class="radar-legend__text"
            >{{ house.title.slice(0, 8) }}...</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  list: { type: Array, default: () => [] }
})

const radarDimensions = [
  { label: '价格', key: 'priceDim' },
  { label: '面积', key: 'areaDim' },
  { label: '配套', key: 'facilityDim' },
  { label: '装修', key: 'decorDim' },
  { label: '位置', key: 'locationDim' }
]

const R = 120,
  CX = 150,
  CY = 150,
  N = radarDimensions.length

function getPoint(index, ratio) {
  const angle = (Math.PI * 2 * index) / N - Math.PI / 2
  return {
    x: CX + R * ratio * Math.cos(angle),
    y: CY + R * ratio * Math.sin(angle)
  }
}

function getGridPoints(ratio) {
  return radarDimensions
    .map((_, i) => {
      const p = getPoint(i, ratio)
      return `${p.x},${p.y}`
    })
    .join(' ')
}

function getLabelPoint(index) {
  return getPoint(index, 1.18)
}

function getDimScores(house) {
  const houses = props.list
  const prices = houses.map(h => h.price),
    areas = houses.map(h => h.area)
  const maxPrice = Math.max(...prices),
    minPrice = Math.min(...prices)
  const maxArea = Math.max(...areas),
    minArea = Math.min(...areas)
  const priceRange = maxPrice - minPrice || 1,
    areaRange = maxArea - minArea || 1

  return {
    priceDim: 1 - ((house.price - minPrice) / priceRange) * 0.6,
    areaDim: 0.4 + ((house.area - minArea) / areaRange) * 0.6,
    facilityDim: 0.3 + ((house.facilities?.length || 0) / 10) * 0.7,
    decorDim:
      house.decoration === '精装' ? 1 : house.decoration === '简装' ? 0.6 : 0.3,
    locationDim: 0.7 + Math.random() * 0.3
  }
}

function getHousePoints(house) {
  const scores = getDimScores(house)
  return radarDimensions
    .map((dim, i) => {
      const p = getPoint(i, scores[dim.key] || 0.5)
      return `${p.x},${p.y}`
    })
    .join(' ')
}
</script>

<style lang="scss" scoped>
.compare-radar {
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
.radar-chart {
  text-align: center;
}
.radar-svg {
  width: 260px;
  height: 260px;
}
.radar-grid,
.radar-axis {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 0.5;
}
.radar-label {
  font-size: 11px;
  fill: #666;
}
.radar-data {
  fill-opacity: 0.25;
  stroke-width: 2;
  &--0 {
    fill: #1989fa;
    stroke: #1989fa;
  }
  &--1 {
    fill: #ff5722;
    stroke: #ff5722;
  }
  &--2 {
    fill: #07c160;
    stroke: #07c160;
  }
  &--3 {
    fill: #ff9800;
    stroke: #ff9800;
  }
}
.radar-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    &.dot--0 {
      background: #1989fa;
    }
    &.dot--1 {
      background: #ff5722;
    }
    &.dot--2 {
      background: #07c160;
    }
    &.dot--3 {
      background: #ff9800;
    }
  }
  &__text {
    font-size: 12px;
    color: #666;
  }
}
</style>
