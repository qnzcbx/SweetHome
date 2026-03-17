<template>
  <van-swipe class="swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="(img, index) in images" :key="index">
      <img :src="img" class="swipe-img" />
    </van-swipe-item>
  </van-swipe>
</template>

<script setup>
defineProps({
  images: { type: Array, default: () => [] }
})
</script>

<style lang="scss" scoped>
.swipe { height: 220px; }
.swipe-img { width: 100%; height: 220px; object-fit: cover; }
</style>
