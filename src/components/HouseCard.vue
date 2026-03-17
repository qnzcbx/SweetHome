<template>
  <div class="house-card" @click="goDetail">
    <!-- 图片展示，优先用 cover -->
    <img v-lazy="house.cover || house.imageUrl" class="cover" alt="house" />

    <div class="content">
      <div class="title van-multi-ellipsis--l2">{{ house.title }}</div>
      <div class="meta">{{ house.city }} · {{ house.district }} · {{ house.area }}㎡ · {{ house.rentType }}</div>
      <div class="community">{{ house.community }}</div>

      <div class="tags">
        <van-tag
          v-for="tag in house.tags"
          :key="tag"
          size="medium"
          plain
          type="primary"
        >
          {{ tag }}
        </van-tag>
      </div>

      <div class="bottom">
        <div class="left">
          <span class="price">{{ house.price }}</span>
          <span class="unit">元/月</span>
        </div>

        <div class="actions">
          <!-- 对比图标 -->
          <van-icon
            :name="compareStore.isInCompare(actualId) ? 'balance-list' : 'balance-list-o'"
            :color="compareStore.isInCompare(actualId) ? '#1989fa' : '#999'"
            size="22"
            class="icon-item"
            @click.stop="compareStore.toggleCompare(house)"
          />
          
          <!-- 收藏图标 -->
          <van-icon
            :name="favoriteStore.isCollected(actualId) ? 'like' : 'like-o'"
            :color="favoriteStore.isCollected(actualId) ? '#ee0a24' : '#999'"
            size="22"
            class="icon-item"
            @click.stop="onToggleFav"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import { useCompareStore } from '@/stores/modules/compare'
import { useFavoriteStore } from '@/stores/modules/favorite'

const props = defineProps({
  house: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const compareStore = useCompareStore()
const favoriteStore = useFavoriteStore()

// 【关键】自动识别 ID，防止因为接口字段不统一导致逻辑失效
const actualId = computed(() => props.house.houseId || props.house.id)

const goDetail = () => {
  router.push(`/detail/${actualId.value}`)
}

const onToggleFav = () => {
  favoriteStore.toggleFavorite(actualId.value)
  showSuccessToast(
    favoriteStore.isCollected(actualId.value) ? '已收藏' : '已取消收藏'
  )
}
</script>

<style scoped lang="scss">
.house-card {
  display: flex;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);

  .cover {
    width: 110px;
    height: 90px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    margin-left: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
  }

  .meta, .community {
    margin-top: 4px;
    font-size: 12px;
    color: #666;
  }

  .tags {
    display: flex;
    gap: 6px;
    margin-top: 6px;
    flex-wrap: wrap;
  }

  .bottom {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: baseline;
    }

    .price {
      color: #ee0a24;
      font-size: 18px;
      font-weight: bold;
    }

    .unit {
      margin-left: 2px;
      color: #ee0a24;
      font-size: 12px;
    }

    .actions {
      display: flex;
      align-items: center;
      
      .icon-item {
        margin-left: 12px;
        padding: 4px; 
      }
    }
  }
}
</style>
