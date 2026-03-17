<template>
  <Transition name="fade">
    <div class="back-top" v-show="visible" @click="scrollToTop">
      <van-icon name="back-top" size="24" color="#ff9854" />
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  threshold: {
    type: Number,
    default: 300
  }
})

const visible = ref(false)

const handleScroll = () => {
  visible.value = window.scrollY > props.threshold
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.back-top {
  position: fixed;
  right: 16px;
  bottom: 80px;
  z-index: 999;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
