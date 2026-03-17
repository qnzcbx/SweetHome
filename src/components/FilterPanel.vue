<template>
  <div class="filter-wrapper" @click.stop>
    <!-- 增加 .stop 阻止整个面板的点击事件向上传递 -->
    <!-- 搜索框：增加 action 并在 submit 时阻止默认行为，防止手机键盘搜索键导致页面刷新 -->
    <form action="/" @submit.prevent>
      <van-search
        v-model="localFilter.keyword"
        shape="round"
        placeholder="搜索小区/标题"
        @search="handleSearch"
      />
    </form>

    <div class="quick-row">
      <van-button
        size="small"
        :type="localFilter.rentType === '' ? 'primary' : 'default'"
        @click.stop="setRentType('')"
      >
        全部
      </van-button>
      <van-button
        size="small"
        :type="localFilter.rentType === '整租' ? 'primary' : 'default'"
        @click.stop="setRentType('整租')"
      >
        整租
      </van-button>
      <van-button
        size="small"
        :type="localFilter.rentType === '合租' ? 'primary' : 'default'"
        @click.stop="setRentType('合租')"
      >
        合租
      </van-button>
    </div>

    <div class="quick-row">
      <van-button
        size="small"
        :type="isActivePriceRange(null, null) ? 'primary' : 'default'"
        @click.stop="setPriceRange(null, null)"
      >
        不限价格
      </van-button>
      <van-button
        size="small"
        :type="isActivePriceRange(0, 3000) ? 'primary' : 'default'"
        @click.stop="setPriceRange(0, 3000)"
      >
        3000以下
      </van-button>
      <van-button
        size="small"
        :type="isActivePriceRange(3000, 5000) ? 'primary' : 'default'"
        @click.stop="setPriceRange(3000, 5000)"
      >
        3000-5000
      </van-button>
      <van-button
        size="small"
        :type="isActivePriceRange(5000, null) ? 'primary' : 'default'"
        @click.stop="setPriceRange(5000, null)"
      >
        5000以上
      </van-button>
    </div>

    <div class="filter-action">
      <!-- 增加 native-type="button" 明确按钮类型，防止在 form 中被当作 submit -->
      <van-button
        type="primary"
        size="small"
        block
        native-type="button"
        @click.stop="togglePanel"
      >
        {{ showPanel ? '收起筛选' : '展开筛选' }}
      </van-button>
    </div>

    <div v-show="showPanel" class="panel">
      <van-field
        v-model="localFilter.city"
        label="城市"
        placeholder="如：北京"
      />
      <van-field
        v-model="localFilter.rentType"
        label="出租方式"
        placeholder="整租/合租"
      />
      <van-field
        v-model="localFilter.minPrice"
        type="number"
        label="最低价格"
        placeholder="最低价格"
      />
      <van-field
        v-model="localFilter.maxPrice"
        type="number"
        label="最高价格"
        placeholder="最高价格"
      />

      <div class="btns">
        <van-button
          size="small"
          plain
          type="default"
          native-type="button"
          @click.stop="resetFilter"
          >重置</van-button
        >
        <van-button
          size="small"
          type="primary"
          native-type="button"
          @click.stop="emitFilter"
          >确定</van-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue' // 修复：必须导入 watch
import { normalizeFilterParams } from '@/utils/format'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['change', 'search'])

const showPanel = ref(false)

const localFilter = reactive({
  keyword: '',
  city: '',
  rentType: '',
  minPrice: '',
  maxPrice: ''
})

// 同步 Props 到本地状态
const syncFromProps = (value = {}) => {
  const filters = normalizeFilterParams(value)
  localFilter.keyword = filters.keyword || ''
  localFilter.city = filters.city || ''
  localFilter.rentType = filters.rentType || ''
  localFilter.minPrice = filters.minPrice ?? ''
  localFilter.maxPrice = filters.maxPrice ?? ''
}

watch(
  () => props.modelValue,
  val => {
    syncFromProps(val)
  },
  { immediate: true, deep: true }
)

const togglePanel = () => {
  showPanel.value = !showPanel.value
}

const setRentType = type => {
  localFilter.rentType = type
  emitFilter()
}

const setPriceRange = (min, max) => {
  localFilter.minPrice = min ?? ''
  localFilter.maxPrice = max ?? ''
  emitFilter()
}

const isActivePriceRange = (min, max) => {
  const currentMin =
    localFilter.minPrice === '' ? null : Number(localFilter.minPrice)
  const currentMax =
    localFilter.maxPrice === '' ? null : Number(localFilter.maxPrice)
  return currentMin === min && currentMax === max
}

const resetFilter = () => {
  localFilter.keyword = ''
  localFilter.city = ''
  localFilter.rentType = ''
  localFilter.minPrice = ''
  localFilter.maxPrice = ''
  emitFilter()
}

const handleSearch = () => {
  if (localFilter.keyword.trim()) {
    emit('search', localFilter.keyword.trim())
  }
  emitFilter()
}

const emitFilter = () => {
  emit('change', {
    keyword: localFilter.keyword.trim(),
    city: localFilter.city.trim(),
    rentType: localFilter.rentType.trim(),
    minPrice: localFilter.minPrice === '' ? null : Number(localFilter.minPrice),
    maxPrice: localFilter.maxPrice === '' ? null : Number(localFilter.maxPrice)
  })
}
</script>

<style scoped lang="scss">
.filter-wrapper {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 12px;
  position: relative;
  z-index: 10; // 确保筛选面板层级高于列表，防止点击穿透
}

.quick-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.filter-action {
  margin-top: 10px;
}

.panel {
  margin-top: 12px;
  background: #fff;
}

.btns {
  display: flex;
  gap: 12px;
  margin-top: 12px;

  .van-button {
    flex: 1;
  }
}
</style>
