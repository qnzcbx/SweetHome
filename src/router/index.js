import { createRouter, createWebHistory } from 'vue-router'
import pinia from '@/stores'
import { checkLogin } from '@/utils/auth'
import { useUserStore } from '@/stores/modules/user'
import { showFailToast } from 'vant'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/Home.vue'),
    meta: {
      title: '首页',
      requireAuth: false,
      keepAlive: true
    }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('@/views/detail/Detail.vue'),
    meta: {
      title: '房源详情',
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/favorite',
    name: 'Favorite',
    component: () => import('@/views/favorite/Favorite.vue'),
    meta: {
      title: '我的收藏',
      requireAuth: true,
      keepAlive: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/Profile.vue'),
    meta: {
      title: '个人中心',
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: {
      title: '登录',
      requireAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/compare',
    name: 'Compare',
    component: () => import('@/views/compare/Compare.vue'),
    meta: { title: '房源对比', depth: 3 }
  },
  {
      path: "/city",
      name: 'City',
      component: () => import("@/views/city/City.vue"),
      meta: { title: '城市列表', requireAuth: false, }
    },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/message/Message.vue'),
    meta: { title: '消息中心', requireAuth: true }
  },
  // 404 兜底路由，必须放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/notfound/NotFound.vue'),
    meta: {
      title: '页面未找到',
      requireAuth: false,
      keepAlive: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退），恢复
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到顶部
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  // 设置标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 租房平台`
  }

  // 场景：进入需要权限的页面（如：个人中心、预约列表）
  if (to.meta.requireAuth) {
    // 调用我们封装的工具
    // 如果 checkLogin 返回 false，说明用户没登录且弹窗已处理，这里直接 return false 中断路由
    const hasAuth = await checkLogin(to.fullPath)
    if (!hasAuth) return false
  }

  // 场景：已登录状态下访问登录页，重定向到个人中心
  if (to.path === '/login' && userStore.isLogin) {
    return '/profile'
  }

  return true
})

// router.beforeEach((to) => {
//   const userStore = useUserStore(pinia)

//   if (to.meta.title) {
//     document.title = to.meta.title + ' - 租房平台'
//   }

//   if (to.meta.requireAuth && !userStore.isLogin) {
//     userStore.setRedirectUrl(to.fullPath)
//     showFailToast('请先登录')
//     return '/login'
//   }

//   if (to.path === '/login' && userStore.isLogin) {
//     return '/profile'
//   }

//   return true
// })

export default router
