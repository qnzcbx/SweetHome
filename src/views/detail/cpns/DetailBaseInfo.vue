<template>
  <div class="content">
    <div class="title">{{ info.title }}</div>

    <div class="price-line">
      <!-- 假设 v-unit 是全局指令 -->
      <span class="price" v-unit>{{ info.price }}</span>
      <span class="unit">/月</span>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <span class="label">面积</span>
        <span class="val">{{ info.area }}㎡</span>
      </div>
      <div class="info-item">
        <span class="label">方式</span>
        <span class="val">{{ info.rentType }}</span>
      </div>
      <div class="info-item">
        <span class="label">城市</span>
        <span class="val">{{ info.city }}</span>
      </div>
    </div>

    <div class="meta">{{ info.district }} · {{ info.community }}</div>
    <div class="meta">
      发布时间：
      <!-- 假设 v-ftime 是全局指令 -->
      <span v-ftime="'YYYY-MM-DD HH:mm'">{{ info.publishTime }}</span>
    </div>

    <div class="tags" v-if="info.tags?.length">
      <van-tag
        v-for="tag in info.tags"
        :key="tag"
        type="primary"
        plain
        style="margin-right: 8px;"
      >
        {{ tag }}
      </van-tag>
    </div>

    <div class="desc">{{ info.desc }}</div>
  </div>
</template>

<script setup>
defineProps({
  info: { type: Object, required: true }
})
</script>

<style lang="scss" scoped>
.content { background: #fff; margin-top: 12px; padding: 16px; }
.title { font-size: 18px; font-weight: bold; color: #333; }
.price-line { margin-top: 12px; }
.price { font-size: 24px; color: #ee0a24; font-weight: bold; }
.unit { color: #ee0a24; margin-left: 2px; }
.info-grid {
  display: flex; margin-top: 16px; background: #f7f8fa; border-radius: 8px; padding: 12px;
  .info-item {
    flex: 1; text-align: center;
    .label { display: block; font-size: 12px; color: #999; }
    .val { display: block; font-size: 15px; font-weight: bold; color: #333; margin-top: 4px; }
  }
}
.meta { margin-top: 8px; color: #666; font-size: 14px; }
.tags { margin-top: 12px; }
.desc { margin-top: 12px; color: #333; line-height: 1.6; }
</style>
