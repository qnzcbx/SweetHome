<template>
  <van-popup
    :show="show"
    @update:show="$emit('update:show', $event)"
    round
    position="bottom"
    :style="{ padding: '16px' }"
  >
    <div class="popup-title">预约看房</div>
    <van-form @submit="handleSubmit">
      <van-field
        v-model="form.name"
        label="姓名"
        placeholder="请输入姓名"
        :rules="[{ required: true, message: '请输入姓名' }]"
      />
      <van-field
        v-model="form.mobile"
        label="手机号"
        placeholder="请输入手机号"
        type="tel"
        maxlength="11"
        :rules="[
          { required: true, message: '请输入手机号' },
          { pattern: /^1\d{10}$/, message: '手机号格式不正确' }
        ]"
      />
      <van-field
        v-model="form.time"
        label="预约时间"
        placeholder="如：周六下午3点"
        :rules="[{ required: true, message: '请输入预约时间' }]"
      />
      <div style="margin-top: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交预约
        </van-button>
      </div>
    </van-form>
  </van-popup>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  show: Boolean
})
const emit = defineEmits(['update:show', 'submit'])

const form = reactive({
  name: '',
  mobile: '',
  time: ''
})

const handleSubmit = () => {
  emit('submit', { ...form })
  // 清空表单
  form.name = ''
  form.mobile = ''
  form.time = ''
}
</script>

<style scoped>
.popup-title { text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 12px; }
</style>
