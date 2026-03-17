<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>

  <!-- 全局 loading -->
  <transition name="fade">
    <div v-if="mainStore.isLoading" class="global-loading-mask">
      <div class="loading-content">
        <van-loading type="spinner" color="#ff9854" size="32px" />
        <p class="loading-text">加载中...</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useMainStore } from '@/stores/modules/main'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mainStore = useMainStore()

// 动态收集需要缓存的路由组件名称
const cachedViews = computed(() => {
  return router
    .getRoutes()
    .filter(route => route.meta?.keepAlive)
    .map(route => route.name)
    .filter(Boolean)
})
</script>

<style scoped lang="scss">
.global-loading-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6); // 稍微加深一点透明度，更有质感
  backdrop-filter: blur(2px); // 增加毛玻璃效果，显得高级
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.loading-text {
  color: #ff9854;
  font-size: 14px;
}

/* Fade 动画：让 Loading 出现和消失更平滑 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
