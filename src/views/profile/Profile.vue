<template>
  <div class="page-profile">
    <NavBar title="我的" :left-arrow="false" />

    <UserInfo
      :is-login="userStore.isLogin"
      :user-info="userStore.userInfo"
      @logout="handleLogout"
    />

    <StatSection
      :favorite-count="favoriteStore.houseIds.length"
      :pending-count="pendingCount"
      :done-count="doneCount"
    />

    <div class="appointment-box">
      <div class="section-header">
        <span class="title">我的预约</span>
        <span class="count">共 {{ appointments.length }} 条</span>
      </div>

      <van-empty v-if="!appointments.length" description="暂无预约记录" />

      <div v-else class="appointment-list">
        <AppointmentItem
          v-for="item in appointments"
          :key="item.id"
          :item="item"
          @click="goDetail"
          @complete="handleComplete"
          @cancel="handleCancel"
          @delete="handleDelete"
        />
      </div>
    </div>

    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showConfirmDialog } from 'vant'
import NavBar from '@/components/NavBar.vue'
import TabBar from '@/components/TabBar.vue'
import UserInfo from './cpns/UserInfo.vue'
import StatSection from './cpns/StatSection.vue'
import AppointmentItem from './cpns/AppointmentItem.vue'

import { useUserStore } from '@/stores/modules/user'
import { useFavoriteStore } from '@/stores/modules/favorite'
import { useMessageStore } from '@/stores/modules/message'
import {
  getAppointmentListService,
  deleteAppointmentService,
  cancelAppointmentService,
  completeAppointmentService
} from '@/service/modules/appointment'

const router = useRouter()
const userStore = useUserStore()
const messageStore = useMessageStore()
const favoriteStore = useFavoriteStore()

const appointments = ref([])

// 计算属性：统计数据
const pendingCount = computed(
  () => appointments.value.filter(i => i.status === 'pending').length
)
const doneCount = computed(
  () => appointments.value.filter(i => i.status === 'done').length
)

// 获取数据
const fetchAllData = async () => {
  if (!userStore.isLogin) return
  try {
    const res = await getAppointmentListService()
    appointments.value = res.data || []
    messageStore.fetchUnreadCount()
  } catch (err) {
    console.error('加载失败', err)
  }
}

const goDetail = houseId => houseId && router.push(`/detail/${houseId}`)

const handleLogout = async () => {
  try {
    // 1. 弹出确认框（Vant 的 showConfirmDialog 在点击取消时会 throw 'cancel'）
    await showConfirmDialog({
      title: '温馨提示',
      message: '退出后将无法查看预约信息，确定退出吗？',
      theme: 'round-button',
      confirmButtonColor: '#ff9854',
      cancelButtonText: '再想想',
      confirmButtonText: '确定退出'
    })

    // 2. 执行登出逻辑
    userStore.logout()
    appointments.value = []
    showSuccessToast('已退出')
  } catch (error) {
    // 3. 用户点击了“取消”，这里捕获错误但不做任何处理，控制台就不会报错了
    console.log('用户取消退出')
  }
}

// 预约操作通用封装
const executeAction = async (service, id, successMsg, confirmMsg = null) => {
  try {
    if (confirmMsg) {
      // 如果有确认框，点击取消会进入 catch
      await showConfirmDialog({ title: '提示', message: confirmMsg })
    }

    // 执行业务请求
    await service(id)
    showSuccessToast(successMsg)
    await fetchAllData()
  } catch (e) {
    // 捕获取消行为或请求错误，防止控制台爆红
    if (e !== 'cancel') {
      console.error('操作失败', e)
    }
  }
}

const handleCancel = id =>
  executeAction(
    cancelAppointmentService,
    id,
    '已取消',
    '确定要取消这条预约吗？'
  )
const handleDelete = id =>
  executeAction(
    deleteAppointmentService,
    id,
    '已删除',
    '确定要删除这条预约记录吗？'
  )
const handleComplete = id =>
  executeAction(completeAppointmentService, id, '已标记完成')

onMounted(fetchAllData)
</script>

<style scoped lang="scss">
.page-profile {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 70px;
}
.appointment-box {
  margin: 0 12px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f2f3f5;
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #323233;
  }
  .count {
    font-size: 12px;
    color: #969799;
  }
}
</style>
