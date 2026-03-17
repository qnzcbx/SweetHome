<template>
  <div class="stat-card" @click="$emit('click')">
    <div class="stat-value">{{ value }}</div>
    <div class="stat-label">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: [String, Number],
    default: 0
  },
  label: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script>

<style scoped lang="scss">
.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-color);
  }

  .stat-label {
    margin-top: 6px;
    font-size: 13px;
    color: #999;
  }
}
</style>
