import dayjs from 'dayjs'

const systemMessages = [
  { title: '欢迎使用租房平台', content: '感谢注册！浏览房源、收藏对比、预约看房，找到您的理想住所。', type: 'system' },
  { title: '系统维护通知', content: '平台将于本周六凌晨2:00-4:00进行系统升级维护，届时部分功能可能暂不可用。', type: 'system' },
  { title: '安全提醒', content: '请勿向陌生人转账付款，所有交易请通过平台进行，保障您的资金安全。', type: 'system' },
  { title: '新功能上线', content: '地图找房功能已上线！您可以在地图上直观查看房源位置，快去试试吧。', type: 'system' }
]

const appointmentMessages = [
  { title: '预约确认', content: '您预约看房的申请已被房东确认，请准时到达。', type: 'appointment' },
  { title: '预约提醒', content: '您明天有一个看房预约，记得准时出发哦！', type: 'appointment' },
  { title: '预约变更', content: '房东申请将看房时间调整至下午3点，请确认是否方便。', type: 'appointment' }
]

const interactionMessages = [
  { title: '收到新回复', content: '房东回复了您的评论："感谢您的评价，祝您生活愉快！"', type: 'interaction' },
  { title: '评论被点赞', content: '您的房源评价获得了5个赞，继续分享您的体验吧！', type: 'interaction' },
  { title: '房源降价提醒', content: '您收藏的房源"阳光花园精装两居"价格下调了200元/月。', type: 'interaction' }
]

// --- 核心：定义一个持久化的缓存变量 ---
let cachedMessages = null; 

export function generateMessages() {
  const allTemplates = [...systemMessages, ...appointmentMessages, ...interactionMessages]
  // ID 计数器放在内部即可
  let idCounter = 1 
  const messages = allTemplates.map((tpl, idx) => {
    const daysAgo = idx * 2 + Math.floor(Math.random() * 3)
    return {
      messageId: `msg_${idCounter++}`, // 确保 ID 唯一且稳定
      ...tpl,
      read: idx > 3, // 初始状态：前4条未读
      createdAt: dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD HH:mm:ss')
    }
  })
  return messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// 获取消息列表
export function mockGetMessages({ page = 1, pageSize = 10, type = '' } = {}) {
  // --- 核心：如果没生成过数据，则生成一次；否则使用缓存的 ---
  if (!cachedMessages) {
    cachedMessages = generateMessages();
  }

  let list = [...cachedMessages]; // 使用缓存数据

  if (type) {
    list = list.filter(m => m.type === type)
  }
  
  const total = list.length
  const start = (page - 1) * pageSize
  const pageList = list.slice(start, start + pageSize)

  return {
    code: 200,
    data: {
      list: pageList,
      total,
      // 未读数是基于缓存数据动态计算的
      unreadCount: list.filter(m => !m.read).length, 
      page,
      pageSize
    }
  }
}

// 标记单条已读
export function mockMarkRead(messageId) {
  if (cachedMessages) {
    // --- 核心：真正修改缓存里的数据 ---
    const msg = cachedMessages.find(m => m.messageId === messageId);
    if (msg) msg.read = true;
  }
  return { code: 200, message: '已读' }
}

// 标记全部已读
export function mockMarkAllRead() {
  if (cachedMessages) {
    // --- 核心：真正修改缓存里的所有数据 ---
    cachedMessages.forEach(m => {
      m.read = true;
    });
  }
  return { code: 200, message: '全部已读' }
}
