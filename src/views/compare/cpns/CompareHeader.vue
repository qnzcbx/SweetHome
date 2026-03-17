<template>
  <div class="compare-header">
    <div class="compare-header__label">房源</div>
    <div class="compare-header__houses">
      <div
        v-for="house in list"
        :key="house.houseId"
        class="compare-house-card"
      >
        <div class="compare-house-card__img-wrap">
          <img :src="house.imageUrl" class="compare-house-card__img" />
          <van-icon
            name="cross"
            class="compare-house-card__close"
            @click="$emit('remove', house.houseId)"
          />
        </div>
        <div class="compare-house-card__title">{{ house.title }}</div>
        <div class="compare-house-card__price">
          <span class="price-num">{{ house.price }}</span>
          <span class="price-unit">元/月</span>
        </div>
        <van-button
          type="primary"
          size="mini"
          plain
          round
          @click="$emit('view-detail', house.houseId)"
        >
          查看详情
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  list: { type: Array, default: () => [] }
})
defineEmits(['remove', 'view-detail'])
</script>

<style lang="scss" scoped>
.compare-header {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 16px 12px;
  margin-bottom: 12px;
  overflow: hidden;

  &__label {
    writing-mode: vertical-lr;
    font-size: 13px;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    flex-shrink: 0;
  }

  &__houses {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    flex: 1;
    padding-left: 8px;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar { display: none; }
  }
}

.compare-house-card {
  min-width: 140px;
  max-width: 160px;
  flex-shrink: 0;
  text-align: center;

  &__img-wrap {
    position: relative;
    width: 100%;
    height: 90px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  &__img { width: 100%; height: 100%; object-fit: cover; }

  &__close {
    position: absolute;
    top: 4px; right: 4px;
    width: 20px; height: 20px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    color: #fff;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: 13px; color: #333;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    margin-bottom: 4px;
  }

  &__price {
    margin-bottom: 8px;
    .price-num { font-size: 16px; font-weight: 700; color: #ff5722; }
    .price-unit { font-size: 11px; color: #999; margin-left: 2px; }
  }
}
</style>
