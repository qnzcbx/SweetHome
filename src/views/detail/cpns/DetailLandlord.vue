<template>
  <div class="content">
    <div class="section-title">房东信息</div>
    <div class="landlord-row">
      <div>
        <div class="meta">姓名：{{ landlord?.name || '暂无' }}</div>
        <div class="meta">电话：{{ landlord?.mobile || '暂无' }}</div>
      </div>
      <van-button
        v-if="landlord?.mobile"
        size="small"
        type="primary"
        icon="phone"
        @click="$emit('call')"
      >
        拨打电话
      </van-button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  landlord: { type: Object, default: () => ({}) }
})
defineEmits(['call'])
</script>

<style lang="scss" scoped>
.content { background: #fff; margin-top: 12px; padding: 16px; }
.section-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 12px; }
.landlord-row { display: flex; justify-content: space-between; align-items: center; }
.meta { margin-top: 8px; color: #666; font-size: 14px; }
</style>
