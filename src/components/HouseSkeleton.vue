<template>
  <div class="skeleton-list">
    <div class="skeleton-card" v-for="i in count" :key="i">
      <van-skeleton-image class="skeleton-cover" />
      <div class="skeleton-content">
        <van-skeleton :row="3" row-width="['100%', '60%', '40%']" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped lang="scss">
.skeleton-card {
  display: flex;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
}

.skeleton-cover {
  width: 110px !important;
  height: 90px !important;
  border-radius: 8px;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  margin-left: 12px;
}
</style>
