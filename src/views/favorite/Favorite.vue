<template>
  <div class="page-favorite">
    <NavBar title="我的收藏" :left-arrow="false" />

    <div class="page-content">
      <div class="result-count" v-if="favoriteList.length">
        共收藏 <span class="highlight">{{ favoriteList.length }}</span> 套房源
      </div>

      <template v-if="favoriteList.length">
        <HouseCard v-for="item in favoriteList" :key="item.id" :house="item" />
      </template>

      <van-empty v-else description="暂无收藏房源，去首页看看吧~">
        <van-button type="primary" size="small" @click="router.push('/home')">
          去首页
        </van-button>
      </van-empty>

      <TabBar />
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import HouseCard from '@/components/HouseCard.vue'
import TabBar from '@/components/TabBar.vue'
import { useFavoriteStore } from '@/stores/modules/favorite'
import { getFavoriteHouseListService } from '@/service/modules/favorite'
import { useRouter } from 'vue-router'

defineOptions({ name: 'Favorite' })

const router = useRouter()
const favoriteStore = useFavoriteStore()
const favoriteList = ref([])

const getFavoriteList = async () => {
  const res = await getFavoriteHouseListService(favoriteStore.houseIds)
  favoriteList.value = res.data || []
}

watch(
  () => favoriteStore.houseIds.slice(),
  () => {
    getFavoriteList()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.page-favorite {
  min-height: 100vh;
  background: #f7f8fa;
  // padding: 12px 12px 70px;

  .page-content {
    padding: 12px 12px 70px;
  }
}

.result-count {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;

  .highlight {
    color: #ee0a24;
    font-weight: bold;
  }
}
</style>
