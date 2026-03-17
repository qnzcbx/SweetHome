<template>
  <div
    class="message-item"
    :class="{ 'message-item--unread': !item.read }"
    @click="$emit('click', item)"
  >
    <div class="message-item__icon">
      <van-icon
        :name="getTypeIcon(item.type)"
        :color="getTypeColor(item.type)"
        size="24"
      />
      <span v-if="!item.read" class="unread-dot"></span>
    </div>
    <div class="message-item__content">
      <div class="message-item__header">
        <span class="message-item__title">{{ item.title }}</span>
        <span class="message-item__time" v-ftime="item.createdAt"></span>
      </div>
      <p class="message-item__body">{{ item.content }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true }
})
defineEmits(['click'])

const getTypeIcon = type => {
  const map = {
    system: 'volume-o',
    appointment: 'calendar-o',
    interaction: 'chat-o'
  }
  return map[type] || 'info-o'
}

const getTypeColor = type => {
  const map = {
    system: '#1989fa',
    appointment: '#07c160',
    interaction: '#ff9800'
  }
  return map[type] || '#999'
}
</script>

<style lang="scss" scoped>
.message-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;

  &--unread {
    background: #f0f7ff;
  }

  &__icon {
    position: relative;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: #f5f7fa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    .unread-dot {
      position: absolute;
      top: 0;
      right: 0;
      width: 8px;
      height: 8px;
      background: #ff4d4f;
      border-radius: 50%;
      border: 1.5px solid #fff;
    }
  }
  &__content {
    flex: 1;
    min-width: 0;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  &__time {
    font-size: 11px;
    color: #ccc;
    flex-shrink: 0;
  }
  &__body {
    font-size: 13px;
    color: #888;
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
