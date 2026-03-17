<template>
  <div class="page-404">
    <van-empty
      image="error"
      image-size="160"
      description="页面走丢了..."
    >
      <div class="tip">你访问的页面不存在或已被移除</div>
      <div class="actions">
        <van-button type="primary" @click="goHome">回到首页</van-button>
        <van-button plain @click="goBack">返回上页</van-button>
      </div>
    </van-empty>
  </div>
</template>

<script setup>
defineOptions({ name: 'NotFound' })

const router = useRouter()

const goHome = () => {
  router.replace('/home')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.page-404 {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
}

.tip {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
  text-align: center;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
