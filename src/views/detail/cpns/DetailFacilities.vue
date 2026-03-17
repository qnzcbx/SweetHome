<template>
  <div class="content" v-if="facilities?.length">
    <div class="section-title">房屋配套</div>
    <div class="facility-grid">
      <div class="facility-item" v-for="item in facilities" :key="item">
        <van-icon :name="facilityIcon(item)" size="22" color="#1989fa" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  facilities: { type: Array, default: () => [] }
})

const facilityIcon = (name) => {
  const map = {
    '空调': 'fire-o', '洗衣机': 'replay', '热水器': 'fire-o',
    '衣柜': 'gift-card-o', '床': 'hotel-o', 'WiFi': 'wifi',
    '冰箱': 'gift-o', '电视': 'tv-o'
  }
  return map[name] || 'diamond-o'
}
</script>

<style lang="scss" scoped>
.content { background: #fff; margin-top: 12px; padding: 16px; }
.section-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 12px; }
.facility-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  .facility-item {
    display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 12px; color: #666;
  }
}
</style>
