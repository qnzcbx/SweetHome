<template>
  <transition name="slide-up">
    <div v-if="compareStore.compareCount > 0" class="compare-bar" @click.stop>
      <div class="compare-bar__left">
        <!-- 房源小图预览 -->
        <div class="compare-bar__avatars">
          <div
            v-for="house in compareStore.compareList"
            :key="house.houseId"
            class="compare-bar__avatar"
          >
            <img :src="house.imageUrl" />
            <van-icon
              name="cross"
              class="compare-bar__avatar-close"
              @click.stop="compareStore.removeCompare(house.houseId)"
            />
          </div>
          <!-- 剩余空位 -->
          <div
            v-for="n in (maxCount - compareStore.compareCount)"
            :key="'empty-' + n"
            class="compare-bar__avatar compare-bar__avatar--empty"
          >
            <van-icon name="plus" />
          </div>
        </div>
      </div>

      <div class="compare-bar__right">
        <van-button
          size="small"
          plain
          round
          class="btn-clear"
          @click="compareStore.clearCompare()"
        >
          清空
        </van-button>
        <van-button
          size="small"
          type="primary"
          round
          class="btn-submit"
          :disabled="compareStore.compareCount < 2"
          @click="goCompare"
        >
          开始对比({{ compareStore.compareCount }})
        </van-button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCompareStore } from '@/stores/modules/compare'

const router = useRouter()
const compareStore = useCompareStore()
const maxCount = 4

function goCompare() {
  router.push('/compare')
}
</script>

<style lang="scss" scoped>
.compare-bar {
  position: fixed;
  bottom: 60px; // 如果有 TabBar，请确保这个值大于 TabBar 高度
  left: 10px;
  right: 10px;
  z-index: 999;
  background: #fff;
  border-radius: 50px; // 圆角加大更像胶囊
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // 适配底部安全区域
  padding-bottom: calc(8px + env(safe-area-inset-bottom));

  &__left {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  &__avatars {
    display: flex;
    gap: 4px; // 缩小头像间距
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    border: 1px solid #f0f0f0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--empty {
      background: #f7f8fa;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ccc;
      font-size: 14px;
      border: 1px dashed #ddd;
    }
  }

  &__avatar-close {
    position: absolute;
    top: 0;
    right: 0;
    width: 12px;
    height: 12px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border-radius: 0 0 0 4px;
    font-size: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__right {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
    margin-left: 8px;

    .btn-clear {
      padding: 0 10px;
      height: 32px;
      border-color: #ebedf0;
      color: #666;
    }

    .btn-submit {
      padding: 0 12px;
      height: 32px;
      font-weight: bold;
      min-width: 90px; // 确保按钮宽度足够放下文字
    }
  }
}

// 进场动画
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(120%);
  opacity: 0;
}
</style>
