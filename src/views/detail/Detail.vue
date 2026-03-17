<template>
  <div class="page-detail">
    <NavBar title="房源详情" />

    <DetailSkeleton v-if="loading" />

    <ErrorBlock
      v-else-if="loadError"
      description="房源信息加载失败"
      @retry="getDetail"
    />

    <template v-else-if="detail">
      <DetailSwipe :images="detail.images" />
      
      <DetailBaseInfo :info="detail" />

      <DetailLandlord 
        :landlord="detail.landlord" 
        @call="callLandlord" 
      />

      <DetailFacilities :facilities="detail.facilities" />

      <ReviewSection :houseId="houseId" />

      <DetailFooter 
        :isCollected="favoriteStore.isCollected(detail.id)"
        :hasMobile="!!detail.landlord?.mobile"
        @toggle-favorite="toggleFavorite"
        @call="callLandlord"
        @appointment="showPopup = true"
      />

      <DetailAppointment 
        v-model:show="showPopup"
        @submit="submitAppointment"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showSuccessToast, showFailToast } from 'vant'

import NavBar from '@/components/NavBar.vue'
import DetailSkeleton from '@/components/DetailSkeleton.vue'
import ErrorBlock from '@/components/ErrorBlock.vue'
import ReviewSection from '@/components/ReviewSection.vue'

// 导入拆分后的组件
import DetailSwipe from './cpns/DetailSwipe.vue'
import DetailBaseInfo from './cpns/DetailBaseInfo.vue'
import DetailLandlord from './cpns/DetailLandlord.vue'
import DetailFacilities from './cpns/DetailFacilities.vue'
import DetailFooter from './cpns/DetailFooter.vue'
import DetailAppointment from './cpns/DetailAppointment.vue'

import { getHouseDetailCancelable } from '@/service/modules/house'
import { createAppointmentService } from '@/service/modules/appointment'
import { useFavoriteStore } from '@/stores/modules/favorite'
import { useUserStore } from '@/stores/modules/user'
import { checkLogin } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()

const detail = ref(null)
const loading = ref(true)
const loadError = ref(false)
const showPopup = ref(false)
const houseId = ref('')

let cancelRequest = null

const getDetail = async () => {
  loading.value = true
  loadError.value = false
  if (cancelRequest) cancelRequest()

  try {
    const { promise, cancel } = getHouseDetailCancelable(route.params.id)
    cancelRequest = cancel
    const res = await promise
    detail.value = res.data
    houseId.value = res.data.id
  } catch (err) {
    if (err?.message !== '请求被取消') loadError.value = true
  } finally {
    loading.value = false
  }
}

const toggleFavorite = async () => {
  const isLogin = await checkLogin(route.fullPath)
  if (!isLogin) return

  // 先登录再执行收藏操作
  favoriteStore.toggleFavorite(detail.value.id)
  showSuccessToast(favoriteStore.isCollected(detail.value.id) ? '已收藏' : '已取消收藏')
}

const callLandlord = () => {
  const mobile = detail.value?.landlord?.mobile
  if (mobile) window.location.href = `tel:${mobile}`
}

const submitAppointment = async (formData) => {
  // if (!userStore.isLogin) {
  //   showFailToast('请先登录')
  //   userStore.setRedirectUrl(route.fullPath)
  //   router.push('/login')
  //   return
  // }

  // 调用工具函数：未登录会自动弹窗，点击登录会自动记录当前 detail 地址
  const isLogin = await checkLogin(route.fullPath)
  if (!isLogin) return

  await createAppointmentService({
    houseId: detail.value.id,
    houseTitle: detail.value.title,
    ...formData
  })

  showSuccessToast('预约成功')
  showPopup.value = false
}

onMounted(() => getDetail())
onBeforeUnmount(() => cancelRequest?.())
</script>

<style scoped lang="scss">
.page-detail {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
}
</style>
