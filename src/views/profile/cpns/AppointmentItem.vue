<template>
  <van-swipe-cell>
    <div class="appointment-item" @click="$emit('click', item.houseId)">
      <div class="item-header">
        <span class="house-title van-ellipsis">{{ item.houseTitle }}</span>
        <van-tag :type="statusTagType" size="medium">{{
          item.statusText
        }}</van-tag>
      </div>

      <div class="item-row">
        <van-icon name="manager" /><span>{{ item.name }}</span>
      </div>
      <div class="item-row">
        <van-icon name="phone" /><span>{{ item.mobile }}</span>
      </div>
      <div class="item-row">
        <van-icon name="clock" /><span>看房：{{ item.time }}</span>
      </div>
      <div class="item-row">
        <van-icon name="notes" />
        <span
          >提交：<span v-ftime="'YYYY-MM-DD HH:mm'">{{
            item.createTime
          }}</span></span
        >
      </div>

      <div class="item-actions" v-if="item.status === 'pending'">
        <van-button
          size="mini"
          type="success"
          plain
          @click.stop="$emit('complete', item.id)"
          >标记完成</van-button
        >
        <van-button
          size="mini"
          type="warning"
          plain
          @click.stop="$emit('cancel', item.id)"
          >取消预约</van-button
        >
      </div>
    </div>

    <template #right>
      <van-button
        square
        text="删除"
        type="danger"
        class="delete-button"
        @click="$emit('delete', item.id)"
      />
    </template>
  </van-swipe-cell>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ item: Object })
defineEmits(['click', 'complete', 'cancel', 'delete'])

const statusTagType = computed(() => {
  const map = { pending: 'primary', done: 'success', cancelled: 'default' }
  return map[props.item.status] || 'default'
})
</script>

<style scoped lang="scss">
.appointment-item {
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  .item-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .house-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    max-width: 70%;
  }
  .item-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #666;
    line-height: 2;
  }
  .item-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
}
.delete-button {
  height: 100%;
}
</style>
