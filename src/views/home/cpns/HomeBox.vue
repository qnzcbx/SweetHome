<template>
  <div class="home-box">
    <!-- 1.位置信息 -->
    <div class="location bottom-gray-line">
      <div class="city" @click="cityClick">{{ currentCity.cityName }}</div>
      <div class="position" @click="positionClick">
        <span class="text">我的位置</span>
        <img src="@/assets/img/home/icon_location.png" alt="" />
      </div>
    </div>

    <!-- 2.日期范围 -->
    <div
      class="section date-range bottom-gray-line"
      @click="showCalendar = true"
    >
      <div class="date-info">
        <div class="start">
          <span class="date">{{ startDateStr }}</span>
          <span class="tip">入店</span>
        </div>
        <div class="line">—</div>
        <div class="end">
          <span class="date">{{ endDateStr }}</span>
          <span class="tip">离店</span>
        </div>
      </div>
      <div class="stay">共 {{ stayCount }} 晚</div>
    </div>

    <!-- 日历组件 (保持不变) -->
    <van-calendar
      v-model:show="showCalendar"
      type="range"
      color="#ff9854"
      :round="false"
      :show-confirm="false"
      @confirm="onConfirm"
    />
  </div>
</template>

<script setup>
import useCityStore from '@/stores/modules/city'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatMonthDay, getDiffDays } from '@/utils/format_date'
import { useMainStore } from '@/stores/modules/main'

const router = useRouter()

// 位置/城市
const cityClick = () => {
  router.push('/city')
}
const positionClick = () => {
  navigator.geolocation.getCurrentPosition(
    res => {
      console.log('获取位置成功:', res)
    },
    err => {
      console.log('获取位置失败:', err)
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  )
}
const cityStore = useCityStore()
const { currentCity } = storeToRefs(cityStore)

// 日期范围的处理
const mainStore = useMainStore()
const { startDate, endDate } = storeToRefs(mainStore)

const startDateStr = computed(() => formatMonthDay(startDate.value))
const endDateStr = computed(() => formatMonthDay(endDate.value))
const stayCount = ref(getDiffDays(startDate.value, endDate.value))

const showCalendar = ref(false)
const onConfirm = value => {
  // 1.设置日期
  const selectStartDate = value[0]
  const selectEndDate = value[1]
  mainStore.startDate = selectStartDate
  mainStore.endDate = selectEndDate
  stayCount.value = getDiffDays(selectStartDate, selectEndDate)

  // 2.隐藏日历
  showCalendar.value = false
}
</script>

<style scoped lang="scss">
.home-box {
  --van-calendar-popup-height: 100%;
}

// 位置样式
.location {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 20px;

  .city {
    flex: 1;
    color: #333;
    // font-size: 15px;
  }

  .position {
    width: 74px;
    display: flex;
    align-items: center;
    .text {
      color: #666;
      font-size: 12px;
    }
    img {
      margin-left: 5px;
      width: 18px;
      height: 18px;
    }
  }
}

// 日期范围样式
.date-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;

  .date-info {
    display: flex;
    align-items: center;
    color: #333;

    .start,
    .end {
      display: flex;
      align-items: baseline;

      .date {
        font-size: 16px;
        font-weight: 600;
      }

      .tip {
        font-size: 12px;
        color: #666;
        margin-left: 5px;
      }
    }

    .line {
      margin: 0 10px;
      color: #e0e0e0;
      font-weight: 300;
    }
  }

  .stay {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    // margin-left: auto;
  }
}

// 公共底边线
.bottom-gray-line {
  border-bottom: 1px solid #f2f2f2;
}
</style>
