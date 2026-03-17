<template>
  <div class="page-login">
    <NavBar title="登录" />

    <div class="login-header">
      <div class="logo">🏠</div>
      <div class="app-name">租房平台</div>
      <div class="app-desc">找好房，住好家</div>
    </div>

    <van-form @submit="onSubmit" class="form">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          label="用户名"
          placeholder="请输入用户名"
          left-icon="manager"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />
        <van-field
          v-model="form.mobile"
          label="手机号"
          placeholder="请输入手机号"
          left-icon="phone"
          type="tel"
          maxlength="11"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^1\d{10}$/, message: '手机号格式不正确' }
          ]"
        />
      </van-cell-group>

      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>

    <div class="tip">提示：输入任意用户名和正确格式的手机号即可登录</div>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import { loginService } from '@/service/modules/user'
import { useUserStore } from '@/stores/modules/user'
import { showSuccessToast } from 'vant'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  username: '',
  mobile: ''
})

const onSubmit = async () => {
  const res = await loginService(form)
  userStore.setLogin(res.data)
  showSuccessToast('登录成功')

  // 消费回跳地址
  const redirectUrl = userStore.consumeRedirectUrl()
  if (redirectUrl) {
    router.replace(redirectUrl)
  } else {
    router.replace('/profile')
  }
}
</script>

<style scoped lang="scss">
.page-login {
  min-height: 100vh;
  background: #f7f8fa;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 20px;

  .logo {
    font-size: 48px;
  }

  .app-name {
    font-size: 22px;
    font-weight: bold;
    margin-top: 12px;
    color: #333;
  }

  .app-desc {
    font-size: 14px;
    color: #999;
    margin-top: 6px;
  }
}

.form {
  padding: 0 16px;
}

.submit-btn {
  margin: 24px 16px 0;
}

.tip {
  text-align: center;
  color: #ccc;
  font-size: 12px;
  margin-top: 24px;
}
</style>
