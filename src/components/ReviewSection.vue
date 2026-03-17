<template>
  <div class="review-section">
    <div class="review-header">
      <h3 class="review-header__title">
        用户评价
        <span v-if="summary" class="review-header__count">({{ summary.totalCount }})</span>
      </h3>
      <div v-if="summary" class="review-header__rating">
        <span class="rating-num">{{ summary.avgRating }}</span>
        <van-rate :model-value="summary.avgRating" :size="14" readonly allow-half color="#ffd21e" void-icon="star" />
      </div>
    </div>

    <!-- 评分标签 -->
    <div v-if="summary?.tags?.length" class="review-tags">
      <van-tag
        v-for="tag in summary.tags"
        :key="tag"
        type="primary"
        plain
        round
        size="medium"
      >
        {{ tag }}
      </van-tag>
    </div>

    <!-- 评论列表 -->
    <div class="review-list">
      <div v-for="review in reviews" :key="review.reviewId" class="review-item">
        <div class="review-item__header">
          <img :src="review.avatar" class="review-item__avatar" />
          <div class="review-item__user-info">
            <span class="review-item__nickname">{{ review.nickname }}</span>
            <van-rate :model-value="review.rating" :size="10" readonly color="#ffd21e" void-icon="star" />
          </div>
          <span class="review-item__date" v-ftime="review.createdAt"></span>
        </div>
        <p class="review-item__content">{{ review.content }}</p>
        <!-- 评论图片 -->
        <div v-if="review.images?.length" class="review-item__images">
          <van-image
            v-for="(img, i) in review.images"
            :key="i"
            :src="img"
            width="80"
            height="80"
            radius="6"
            fit="cover"
            @click="onPreviewImage(review.images, i)"
          />
        </div>
        <!-- 房东回复 -->
        <div v-if="review.reply" class="review-item__reply">
          <span class="reply-label">房东回复：</span>
          {{ review.reply.content }}
        </div>
        <!-- 点赞 -->
        <div class="review-item__actions">
          <span class="action-btn" @click="handleLike(review)">
            <van-icon :name="review._liked ? 'good-job' : 'good-job-o'" :color="review._liked ? '#1989fa' : '#999'" />
            <span>{{ review.likes + (review._liked ? 1 : 0) }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="reviews.length > 0 && hasMore" class="review-load-more" @click="loadMore">
      <van-loading v-if="loadingMore" size="16" />
      <span v-else>查看更多评价</span>
    </div>

    <van-empty v-if="!loading && reviews.length === 0" description="暂无评价" image="search" />

    <!-- 写评论按钮 -->
    <div class="review-write-btn">
      <van-button
        round
        type="primary"
        icon="edit"
        size="small"
        @click="showWritePopup = true"
      >
        写评价
      </van-button>
    </div>

    <!-- 写评论弹窗 -->
    <van-popup
      v-model:show="showWritePopup"
      position="bottom"
      round
      :style="{ maxHeight: '80vh' }"
      safe-area-inset-bottom
    >
      <div class="write-review">
        <div class="write-review__header">
          <h3>写评价</h3>
          <van-icon name="cross" @click="showWritePopup = false" />
        </div>
        <div class="write-review__rating">
          <span>评分：</span>
          <van-rate v-model="newReview.rating" :size="24" color="#ffd21e" void-icon="star" />
        </div>
        <van-field
          v-model="newReview.content"
          type="textarea"
          placeholder="分享您的租房体验..."
          rows="4"
          maxlength="500"
          show-word-limit
          autosize
        />
        <van-uploader
          v-model="newReview.fileList"
          :max-count="6"
          :max-size="5 * 1024 * 1024"
          @oversize="onOversize"
          multiple
          result-type="dataUrl"
        />
        <van-button
          block
          type="primary"
          round
          :loading="submitting"
          :disabled="!newReview.content.trim()"
          @click="handleSubmit"
          style="margin-top: 16px"
        >
          提交评价
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { showToast, showImagePreview } from 'vant'
import { getReviews, submitReview } from '@/service/modules/review'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'

const props = defineProps({
  houseId: { type: [String, Number], required: true }
})

const router = useRouter()
const userStore = useUserStore()

const reviews = ref([])
const summary = ref(null)
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const page = ref(1)
const showWritePopup = ref(false)
const submitting = ref(false)

const newReview = reactive({
  rating: 5,
  content: '',
  fileList: []
})

watch(
  () => props.houseId,
  (newId) => {
    // console.log('当前 houseId:', newId);
    if (newId !== undefined && newId !== null && newId !== '') {
      page.value = 1;
      reviews.value = [];
      loadReviews();
    }
  },
  { immediate: true }
);

async function loadReviews() {
  loading.value = true
  try {
    const res = await getReviews(props.houseId, { page: 1, pageSize: 5 })
    // console.log('接口返回原始数据:', res)
    const data = res.data || res
    // console.log('解析后的 data:', data)
    reviews.value = (data.list || []).map(r => ({ ...r, _liked: false }))
    if (data.summary) summary.value = data.summary
    hasMore.value = reviews.value.length < (data.total || 0)
    page.value = 1
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    page.value++
    const res = await getReviews(props.houseId, { page: page.value, pageSize: 5 })
    const data = res.data || res
    const newList = (data.list || []).map(r => ({ ...r, _liked: false }))
    reviews.value.push(...newList)
    hasMore.value = reviews.value.length < (data.total || 0)
  } catch (e) {
    page.value--
  } finally {
    loadingMore.value = false
  }
}

function handleLike(review) {
  review._liked = !review._liked
}

function onPreviewImage(images, index) {
  showImagePreview({ images, startPosition: index })
}

function onOversize() {
  showToast('图片不能超过5MB')
}

async function handleSubmit() {
  if (!userStore.isLogin) {
    showToast('请先登录')
    router.push({ path: '/login', query: { redirectUrl: router.currentRoute.value.fullPath } })
    return
  }

  if (!newReview.content.trim()) {
    showToast('请填写评价内容')
    return
  }

  submitting.value = true
  try {
    const images = newReview.fileList.map(f => f.url || f.content)
    const res = await submitReview(props.houseId, {
      content: newReview.content,
      rating: newReview.rating,
      images
    })

    const reviewData = res.data || res
    reviews.value.unshift({ ...reviewData, _liked: false })

    // 更新统计
    if (summary.value) {
      summary.value.totalCount++
      summary.value.avgRating = Number(
        ((summary.value.avgRating * (summary.value.totalCount - 1) + newReview.rating) / summary.value.totalCount).toFixed(1)
      )
    }

    newReview.content = ''
    newReview.rating = 5
    newReview.fileList = []
    showWritePopup.value = false
    showToast('评价成功')
  } catch (e) {
    showToast('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.review-section {
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  margin-top: 12px;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin: 0;
  }

  &__count {
    font-size: 13px;
    color: #999;
    font-weight: 400;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 6px;

    .rating-num {
      font-size: 20px;
      font-weight: 700;
      color: #ff9800;
    }
  }
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.review-list {
  .review-item {
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    &__header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    &__avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 8px;
    }

    &__user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__nickname {
      font-size: 13px;
      font-weight: 500;
      color: #333;
    }

    &__date {
      font-size: 11px;
      color: #ccc;
      flex-shrink: 0;
    }

    &__content {
      font-size: 14px;
      color: #333;
      line-height: 1.6;
      margin: 0 0 8px;
    }

    &__images {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
      overflow-x: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__reply {
      background: #f7f8fa;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 12px;
      color: #666;
      margin-bottom: 6px;

      .reply-label {
        color: #1989fa;
        font-weight: 500;
      }
    }

    &__actions {
      display: flex;
      justify-content: flex-end;

      .action-btn {
        display: flex;
        align-items: center;
        gap: 3px;
        font-size: 12px;
        color: #999;
        cursor: pointer;
      }
    }
  }
}

.review-load-more {
  text-align: center;
  padding: 12px 0;
  font-size: 13px;
  color: #1989fa;
  cursor: pointer;
}

.review-write-btn {
  text-align: center;
  margin-top: 12px;
}

.write-review {
  padding: 16px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 16px;
      color: #333;
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 14px;
    color: #666;
  }
}
</style>
