<template>
  <van-tabbar route>
    <van-tabbar-item replace to="/home" icon="home-o">
      首页
    </van-tabbar-item>
    <van-tabbar-item replace to="/favorite" icon="like-o" :badge="favCount || ''">
      收藏
    </van-tabbar-item>
    <van-tabbar-item replace to="/message" icon="chat-o" :badge="mageCount || ''">
      消息
    </van-tabbar-item>
    <van-tabbar-item replace to="/profile" icon="user-o" :dot="!userStore.isLogin">
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { useFavoriteStore } from '@/stores/modules/favorite'
import { useUserStore } from '@/stores/modules/user'
import { computed, onMounted } from 'vue'
import { useMessageStore } from '../stores/modules/message'

const favoriteStore = useFavoriteStore()
const userStore = useUserStore()
const messageStore = useMessageStore()

onMounted(() => {
  messageStore.fetchUnreadCount()
})

const favCount = computed(() => favoriteStore.houseIds.length)
const mageCount = computed(() => messageStore.unreadCount)
</script>
