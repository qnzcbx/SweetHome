import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import registerDirectives from './directives'

import '@/assets/css/reset.css'
import '@/assets/css/common.scss'
import '@/assets/css/transition.scss'

// 统一引入 Vant 常用的函数式组件样式
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

const app = createApp(App)

registerDirectives(app)

app.use(pinia)
app.use(router)
app.mount('#app')
