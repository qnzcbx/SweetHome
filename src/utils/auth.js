import { showConfirmDialog } from 'vant'
import { useUserStore } from '@/stores/modules/user'
import router from '@/router'

/**
 * 核心认证函数：检查登录状态，未登录则强制/引导跳转
 * @param {string} redirectUrl 登录成功后需要回跳的地址
 * @param {boolean} isSilent 是否静默检查（默认 false，不登录会弹窗）
 * @returns {Promise<boolean>} 返回是否已登录
 */
export const checkLogin = async (redirectUrl = '', isSilent = false) => {
  const userStore = useUserStore()

  // 1. 如果已登录，直接返回 true
  if (userStore.isLogin) {
    return true
  }

  // 2. 如果是静默检查，直接返回 false
  if (isSilent) {
    return false
  }

  // 3. 未登录且非静默：弹出确认框
  try {
    await showConfirmDialog({
      title: '温馨提示',
      message: '您当前尚未登录，登录后可享受更多服务',
      confirmButtonText: '立即登录',
      cancelButtonText: '再看看',
      confirmButtonColor: '#ff9854'
    })

    // 用户点击了“立即登录”
    if (redirectUrl) {
      userStore.setRedirectUrl(redirectUrl)
    }
    router.push('/login')
    return false
  } catch (err) {
    // 用户点击了“再看看”
    return false
  }
}
