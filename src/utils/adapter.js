// ============ 房源适配 ============

export function adaptHouseItem(raw = {}) {
  return {
    id: Number(raw.id ?? 0),
    title: raw.title ?? raw.houseTitle ?? '未知房源',
    city: raw.city ?? raw.cityName ?? '',
    community: raw.community ?? raw.communityName ?? '',
    district: raw.district ?? raw.districtName ?? '',
    price: Number(raw.price ?? raw.monthRent ?? 0),
    area: Number(raw.area ?? raw.square ?? 0),
    rentType: raw.rentType ?? raw.rent_mode ?? '整租',
    cover:
      raw.cover ??
      raw.imageUrl ??
      raw.pic ??
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    publishTime: Number(raw.publishTime ?? raw.createTime ?? Date.now()),
    tags: Array.isArray(raw.tags) ? raw.tags : []
  }
}

export function adaptHouseDetail(raw = {}) {
  const base = adaptHouseItem(raw)

  return {
    ...base,
    images:
      Array.isArray(raw.images) && raw.images.length
        ? raw.images
        : [base.cover],
    desc: raw.desc ?? raw.description ?? '暂无描述',
    landlord: raw.landlord ?? {
      name: '官方管家',
      mobile: '400-000-0000'
    },
    facilities: Array.isArray(raw.facilities) ? raw.facilities : []
  }
}

export function adaptHouseList(list = []) {
  if (!Array.isArray(list)) return []
  return list.map(adaptHouseItem)
}

// ============ 预约适配 ============

const STATUS_MAP = {
  pending: '待看房',
  done: '已完成',
  cancelled: '已取消'
}

export function adaptAppointmentItem(raw = {}) {
  const status = raw.status ?? 'pending'

  return {
    id: Number(raw.id ?? Date.now()),
    houseId: Number(raw.houseId ?? 0),
    houseTitle: raw.houseTitle ?? '未知房源',
    name: raw.name ?? '',
    mobile: raw.mobile ?? '',
    time: raw.time ?? '',
    status,
    statusText: STATUS_MAP[status] || '未知状态',
    createTime: Number(raw.createTime ?? Date.now())
  }
}

export function adaptAppointmentList(list = []) {
  if (!Array.isArray(list)) return []
  return list.map(adaptAppointmentItem)
}
