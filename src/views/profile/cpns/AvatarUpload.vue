<template>
  <div class="avatar-upload">
    <!-- 1. 将点击事件移至此处，并添加 .stop 阻止冒泡 -->
    <div class="avatar-wrapper" @click.stop="showActionSheet = true">
      <img :src="displayAvatar" class="avatar-img" />
      <div class="avatar-overlay">
        <van-icon name="photograph" color="#fff" size="20" />
      </div>
    </div>

    <!-- 操作面板 -->
    <van-action-sheet
      v-model:show="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      close-on-popstate
      @select="onActionSelect"
    />

    <!-- 裁剪弹窗 -->
    <van-popup
      v-model:show="showCropPopup"
      position="bottom"
      :style="{ height: '80vh' }"
      round
      safe-area-inset-bottom
      close-on-popstate
    >
      <!-- 2. 这里的容器也建议加个 @click.stop 彻底切断内部组件向上传递点击事件的路径 -->
      <div class="crop-container" @click.stop>
        <div class="crop-header">
          <van-button size="small" @click="showCropPopup = false">取消</van-button>
          <span class="crop-title">裁剪头像</span>
          <van-button size="small" type="primary" @click="confirmCrop" :loading="uploading">确定</van-button>
        </div>
        <div class="crop-area" ref="cropAreaRef">
          <img
            v-if="cropImageUrl"
            :src="cropImageUrl"
            class="crop-image"
            ref="cropImageRef"
            :style="cropImageStyle"
            @touchstart="onCropTouchStart"
            @touchmove.prevent="onCropTouchMove"
          />
          <div class="crop-mask">
            <div class="crop-circle"></div>
          </div>
        </div>
        <div class="crop-controls">
          <van-slider v-model="cropScale" :min="50" :max="200" @update:model-value="updateCropScale" />
          <span class="crop-scale-label">缩放: {{ cropScale }}%</span>
        </div>
      </div>
    </van-popup>

    <!-- 隐藏的文件选择器 -->
    <input
      type="file"
      ref="fileInputRef"
      accept="image/*"
      class="hidden-input"
      @change="onFileChange"
    />
    <input
      type="file"
      ref="cameraInputRef"
      accept="image/*"
      capture="user"
      class="hidden-input"
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

const showActionSheet = ref(false)
const showCropPopup = ref(false)
const cropImageUrl = ref('')
const cropScale = ref(100)
const cropOffsetX = ref(0)
const cropOffsetY = ref(0)
const uploading = ref(false)
const fileInputRef = ref(null)
const cameraInputRef = ref(null)
const cropAreaRef = ref(null)

let touchStartX = 0
let touchStartY = 0
let startOffsetX = 0
let startOffsetY = 0

const actions = [
  { name: '拍照', value: 'camera' },
  { name: '从相册选择', value: 'album' },
  { name: '查看大图', value: 'preview' }
]

const defaultAvatar = 'https://picsum.photos/seed/default-avatar/200/200'

const displayAvatar = computed(() => {
  return userStore.userInfo?.avatar || defaultAvatar
})

const cropImageStyle = computed(() => ({
  transform: `translate(${cropOffsetX.value}px, ${cropOffsetY.value}px) scale(${cropScale.value / 100})`
}))

function onActionSelect(action) {
  showActionSheet.value = false
  switch (action.value) {
    case 'camera':
      cameraInputRef.value?.click()
      break
    case 'album':
      fileInputRef.value?.click()
      break
    case 'preview':
      if (displayAvatar.value) {
        import('vant').then(({ showImagePreview }) => {
          showImagePreview({ images: [displayAvatar.value] })
        })
      }
      break
  }
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    showToast('图片不能超过10MB')
    return
  }

  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    cropImageUrl.value = event.target.result
    cropScale.value = 100
    cropOffsetX.value = 0
    cropOffsetY.value = 0
    showCropPopup.value = true
  }
  reader.readAsDataURL(file)

  // 重置input
  e.target.value = ''
}

function onCropTouchStart(e) {
  const touch = e.touches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
  startOffsetX = cropOffsetX.value
  startOffsetY = cropOffsetY.value
}

function onCropTouchMove(e) {
  const touch = e.touches[0]
  cropOffsetX.value = startOffsetX + (touch.clientX - touchStartX)
  cropOffsetY.value = startOffsetY + (touch.clientY - touchStartY)
}

function updateCropScale(val) {
  cropScale.value = val
}

async function confirmCrop() {
  if (!cropImageUrl.value) return

  uploading.value = true
  showLoadingToast({ message: '上传中...', forbidClick: true, duration: 0 })

  try {
    // 用Canvas裁剪为正方形
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const size = 400
    canvas.width = size
    canvas.height = size

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = cropImageUrl.value

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    const scale = cropScale.value / 100
    const drawWidth = img.width * scale
    const drawHeight = img.height * scale
    const drawX = (size - drawWidth) / 2 + cropOffsetX.value
    const drawY = (size - drawHeight) / 2 + cropOffsetY.value

    // 画圆形裁剪
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

    const avatarDataUrl = canvas.toDataURL('image/jpeg', 0.85)

    // 模拟上传延迟
    await new Promise(r => setTimeout(r, 800))

    // 更新到store
    userStore.updateAvatar(avatarDataUrl)

    closeToast()
    showToast('头像更新成功')
    showCropPopup.value = false
  } catch (e) {
    closeToast()
    showToast('上传失败，请重试')
    console.error(e)
  } finally {
    uploading.value = false
  }
}
</script>

<style lang="scss" scoped>
.avatar-upload {
  display: inline-block;
}

.hidden-input {
  display: none;
}

.avatar-wrapper {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer; // 移动到这里

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:active .avatar-overlay {
    opacity: 1;
  }
}

// 裁剪弹窗
.crop-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.crop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;

  .crop-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}

.crop-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;

  .crop-image {
    max-width: 100%;
    max-height: 100%;
    touch-action: none;
    user-select: none;
    transition: transform 0.05s linear;
  }

  .crop-mask {
    position: absolute;
    inset: 0;
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
    }
  }

  .crop-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 240px;
    height: 240px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  }
}

.crop-controls {
  padding: 16px 24px 24px;
  background: #fff;

  .crop-scale-label {
    display: block;
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }
}
</style>
