<template>
  <div class="detail-skeleton">
    <!-- 顶部大图骨架 -->
    <van-skeleton-image class="skeleton-banner" />

    <!-- 内容骨架 -->
    <div class="skeleton-section">
      <van-skeleton title :row="4" />
    </div>

    <div class="skeleton-section">
      <van-skeleton title :row="2" />
    </div>

    <div class="skeleton-section">
      <van-skeleton title :row="3" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-skeleton {
  background: #f7f8fa;
  min-height: 100vh;
}

.skeleton-banner {
  width: 100% !important;
  height: 220px !important;
}

.skeleton-section {
  background: #fff;
  margin-top: 12px;
  padding: 16px;
}
</style>
