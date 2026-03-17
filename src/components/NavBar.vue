<template>
  <van-nav-bar
    :title="title"
    :left-arrow="leftArrow"
    @click-left="handleBack"
  />
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  leftArrow: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>
