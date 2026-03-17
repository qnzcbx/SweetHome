<template>
  <div class="user-box">
    <template v-if="isLogin">
      <div class="user-info">
        <AvatarUpload />
        <div class="user-text">
          <div class="name">{{ userInfo?.username }}</div>
          <div class="mobile">{{ userInfo?.mobile }}</div>
        </div>
      </div>
      <van-button
        size="small"
        plain
        class="logout-btn"
        @click="$emit('logout')"
      >
        退出登录
      </van-button>
    </template>

    <template v-else>
      <div class="user-info">
        <van-image
          round
          width="64"
          height="64"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
        <div class="user-text">
          <div class="name">未登录</div>
          <div class="mobile">登录后查看更多功能</div>
        </div>
      </div>
      <van-button size="small" type="primary" @click="$router.push('/login')">
        去登录
      </van-button>
    </template>
  </div>
</template>

<script setup>
import AvatarUpload from './AvatarUpload.vue'
defineProps({
  isLogin: Boolean,
  userInfo: Object
})
defineEmits(['logout'])
</script>

<style scoped lang="scss">
.user-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 20px;
  background: var(--theme-linear-gradient);
  color: #333;
  .user-info {
    display: flex;
    align-items: center;
  }
  .user-text {
    margin-left: 16px;
  }
  .name {
    font-size: 20px;
    font-weight: bold;
  }
  .mobile {
    font-size: 13px;
    margin-top: 6px;
    opacity: 0.8;
  }
  .logout-btn {
    background: rgba(255, 255, 255, 0.5);
    border: none;
  }
}
</style>
