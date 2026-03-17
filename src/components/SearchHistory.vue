<template>
  <div class="search-history" v-if="historyList.length">
    <div class="history-header">
      <span class="title">搜索历史</span>
      <span class="clear" @click="handleClear">
        <van-icon name="delete-o" />
        清空
      </span>
    </div>

    <div class="history-tags">
      <van-tag
        v-for="(item, index) in historyList"
        :key="index"
        size="large"
        plain
        closeable
        type="default"
        @click="$emit('select', item)"
        @close.stop="$emit('remove', index)"
      >
        {{ item }}
      </van-tag>
    </div>
  </div>
</template>

<script setup>
defineProps({
  historyList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select', 'remove', 'clear'])

const handleClear = () => {
  emit('clear')
}
</script>

<style scoped lang="scss">
.search-history {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  .clear {
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 2px;
    cursor: pointer;
  }
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
