<template>
  <div class="footer">
    <van-button
      plain
      :type="isCollected ? 'danger' : 'default'"
      icon="like-o"
      @click="$emit('toggle-favorite')"
    >
      {{ isCollected ? '已收藏' : '收藏' }}
    </van-button>

    <van-button
      type="warning"
      icon="phone"
      v-if="hasMobile"
      @click="$emit('call')"
    >
      联系房东
    </van-button>

    <van-button type="primary" icon="calendar-o" @click="$emit('appointment')">
      预约看房
    </van-button>
  </div>
</template>

<script setup>
defineProps({
  isCollected: Boolean,
  hasMobile: Boolean
})
defineEmits(['toggle-favorite', 'call', 'appointment'])
</script>

<style lang="scss" scoped>
.footer {
  position: fixed; left: 0; right: 0; bottom: 0;
  display: flex; gap: 10px; padding: 12px;
  background: #fff; box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  z-index: 99;
  .van-button { flex: 1; }
}
</style>
