<template>
  <div class="stat-row">
    <StatCard
      :value="favoriteCount"
      label="收藏房源"
      @click="$router.push('/favorite')"
    />
    <StatCard :value="pendingCount" label="待看房" />
    <StatCard :value="doneCount" label="已完成" />
  </div>
</template>

<script setup>
import StatCard from '@/components/StatCard.vue'
defineProps({
  favoriteCount: Number,
  pendingCount: Number,
  doneCount: Number
})
</script>

<style scoped lang="scss">
.stat-row {
  display: flex;
  background: #fff;
  margin: -15px 12px 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}
</style>
