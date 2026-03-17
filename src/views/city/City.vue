<template>
  <div class="city-page">
    <div class="top">
      <!-- 1.搜索框 -->
      <van-search
        v-model="searchValue"
        placeholder="请输入搜索关键词"
        shape="round"
        show-action
        @cancel="onCancel"
      />

      <!-- 2.tab的切换 -->
      <van-tabs v-model:active="tabActive" color="#ff9854" line-height="3">
        <template v-for="(value, key) in allCities" :key="key">
          <van-tab :title="value.title" :name="key"></van-tab>
        </template>
      </van-tabs>
    </div>

    <div class="content">
      <template v-for="(value, key, index) in allCities" :key="index">
        <!-- 只有 key 匹配时才显示 -->
        <city-group v-show="tabActive === key" :group-data="value" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useCityStore from '@/stores/modules/city';
import CityGroup from './cpns/CityGroup.vue';

const router = useRouter()

// 搜索框功能
const searchValue = ref("")
const onCancel = () => {
  router.back()
}

// tab的切换
const tabActive = ref("")

const cityStore = useCityStore()
cityStore.fetchAllCitiesData()
const { allCities } = storeToRefs(cityStore)

// 重要：监听数据加载，加载完后默认选中第一个 tab 的 key
watch(allCities, (newValue) => {
  const firstKey = Object.keys(newValue)[0]
  if (firstKey) {
    tabActive.value = firstKey
  }
})
</script>

<style scoped lang="scss">
.city-page {
  .top {
    position: relative;
    z-index: 9;
  }

  .content {
    height: calc(100vh - 98px);
    overflow-y: auto;
  }
}
</style>
