<template>
  <div class="error-block">
    <van-empty :image="image" :description="description">
      <van-button
        v-if="showRetry"
        type="primary"
        size="small"
        @click="$emit('retry')"
      >
        重新加载
      </van-button>
    </van-empty>
  </div>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    default: 'error'
  },
  description: {
    type: String,
    default: '加载失败，请稍后重试'
  },
  showRetry: {
    type: Boolean,
    default: true
  }
})

defineEmits(['retry'])
</script>
