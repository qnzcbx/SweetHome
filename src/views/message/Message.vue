<template>
  <div class="message-page">
    <van-nav-bar
      title="消息中心"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    >
      <template #right>
        <span
          v-if="messageStore.unreadCount > 0"
          class="mark-all-read"
          @click="handleMarkAllRead"
        >
          全部已读
        </span>
      </template>
    </van-nav-bar>

    <van-tabs
      v-model:active="activeTab"
      sticky
      offset-top="46"
      @change="onRefresh"
    >
      <van-tab title="全部" name="" />
      <van-tab title="系统通知" name="system" />
      <van-tab title="预约消息" name="appointment" />
      <van-tab title="互动消息" name="interaction" />
    </van-tabs>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多消息了"
        @load="onLoad"
        :error="error"
        error-text="加载失败，点击重试"
      >
        <MessageItem
          v-for="msg in messageList"
          :key="msg.messageId"
          :item="msg"
          @click="handleClickMessage"
        />
      </van-list>
    </van-pull-refresh>

    <van-empty
      v-if="!loading && messageList.length === 0"
      description="暂无消息"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import {
  getMessages,
  markMessageRead,
  markAllMessagesRead
} from '@/service/modules/message'
import { useMessageStore } from '@/stores/modules/message'
import { useUserStore } from '@/stores/modules/user'
import { checkLogin } from '@/utils/auth'
import MessageItem from './cpns/MessageItem.vue'

const router = useRouter()
const route = useRoute()
const messageStore = useMessageStore()
const userStore = useUserStore()

const activeTab = ref('')
const messageList = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const error = ref(false)
const page = ref(0)

// 导航处理
const onClickLeft = () => {
  if (window.history.state?.back) router.back()
  else router.replace('/profile')
}

// 分页加载逻辑
async function onLoad() {
  // 1. 核心防御：如果没登录，不执行 onLoad 逻辑
  if (!userStore.isLogin) {
    loading.value = false
    return
  }

  try {
    page.value++
    const res = await getMessages({
      page: page.value,
      pageSize: 10,
      type: activeTab.value
    })

    const data = res.data || res
    const list = data.list || []

    if (refreshing.value) {
      messageList.value = list
      refreshing.value = false
    } else {
      messageList.value.push(...list)
    }

    // 只有第一页才同步未读总数，避免频繁覆盖
    if (page.value === 1) {
      messageStore.setUnreadCount(data.unreadCount || 0)
    }

    // 判断是否加载完成
    finished.value = messageList.value.length >= (data.total || 0)
  } catch (e) {
    error.value = true
    page.value--
  } finally {
    loading.value = false
  }
}

const onRefresh = () => {
  page.value = 0
  finished.value = false
  // 刷新时不立即清空列表，防止闪烁，等到 onLoad 拿到数据再替换
  loading.value = true
  onLoad()
}

async function handleClickMessage(msg) {
  if (!msg.read) {
    msg.read = true
    messageStore.decrementUnread()
    await markMessageRead(msg.messageId).catch(() => {})
  }
  // 根据消息类型跳转（可选逻辑）
  // if(msg.type === 'appointment') router.push('/appointment')
}

async function handleMarkAllRead() {
  try {
    await markAllMessagesRead()
    messageList.value = messageList.value.map(m => ({ ...m, read: true }))
    messageStore.clearUnread()
    showToast('已全部标为已读')
  } catch (e) {
    showToast('操作失败')
  }
}

onMounted(async () => {
  // 进入页面立即校验登录
  const isLogin = await checkLogin(route.fullPath)
  if (!isLogin) return
})
</script>

<style lang="scss" scoped>
.message-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: env(safe-area-inset-bottom);
}
.mark-all-read {
  font-size: 13px;
  color: var(--primary-color);
}
</style>
