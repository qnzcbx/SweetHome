const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都']
const districts = {
  '北京': ['朝阳区', '海淀区', '西城区', '东城区'],
  '上海': ['浦东新区', '静安区', '徐汇区', '长宁区'],
  '广州': ['天河区', '越秀区', '海珠区', '白云区'],
  '深圳': ['南山区', '福田区', '罗湖区', '宝安区'],
  '杭州': ['西湖区', '滨江区', '余杭区', '拱墅区'],
  '成都': ['武侯区', '锦江区', '青羊区', '高新区']
}
const communities = [
  '阳光花园', '翠竹苑', '金色家园', '银河湾', '星河城',
  '碧水蓝天', '名门世家', '龙湖天街', '万科城', '绿地中心',
  '融创壹号', '保利天悦', '中海锦城', '华润橡树湾', '招商雍景',
  '恒大名都', '碧桂园', '金地自在城', '世茂滨江', '新城悦隽'
]
const titles = [
  '近地铁精装一居室', '温馨主卧采光好', '高层电梯两居室',
  '青年公寓拎包入住', '品质三居家庭首选', '近商圈小户型',
  '地铁口豪华大平层', '江景房视野开阔', '花园洋房带露台',
  '复式公寓年轻人最爱', '安静小区适合养老', '学区房黄金地段',
  '全新装修首次出租', '独栋别墅带车库', '精装LOFT创意空间',
  '河景三居南北通透', '温馨两居拎包入住', '简约一居交通便利',
  '地铁旁品质公寓', '商务精装单身公寓'
]
const tagPool = [
  '近地铁', '精装修', '随时看房', '采光好', '家具齐全',
  '电梯房', '交通便利', '拎包入住', '押一付一', '南北通透',
  '家庭优选', '商圈房', '独卫', '阳台', '车位',
  '新装修', '安静', '绿化好', '物业好', '配套齐全'
]
const facilityPool = ['空调', '洗衣机', '热水器', '衣柜', '床', 'WiFi', '冰箱', '电视', '微波炉', '书桌']

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomTags() {
  const count = 2 + Math.floor(Math.random() * 3)
  const shuffled = [...tagPool].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function randomFacilities() {
  const count = 3 + Math.floor(Math.random() * 5)
  const shuffled = [...facilityPool].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function generateMockHouseList(total = 20) {
  const list = []

  for (let i = 1; i <= total; i++) {
    const city = randomItem(cities)
    const district = randomItem(districts[city])
    const community = randomItem(communities)
    const rentType = Math.random() > 0.5 ? '整租' : '合租'
    const area = rentType === '整租'
      ? 50 + Math.floor(Math.random() * 80)
      : 15 + Math.floor(Math.random() * 25)
    const price = rentType === '整租'
      ? 2500 + Math.floor(Math.random() * 60) * 100
      : 800 + Math.floor(Math.random() * 25) * 100

    list.push({
      id: i,
      title: titles[(i - 1) % titles.length],
      city,
      district,
      community,
      price,
      area,
      rentType,
      cover: `https://picsum.photos/400/300?random=${i}`,
      publishTime: 1719993600 + i * 100000,
      tags: randomTags()
    })
  }

  return list
}

export const mockHouseList = generateMockHouseList(20)

export const mockHouseDetail = mockHouseList.map((item) => ({
  ...item,
  images: [
    `https://picsum.photos/800/400?random=${item.id}a`,
    `https://picsum.photos/800/400?random=${item.id}b`,
    `https://picsum.photos/800/400?random=${item.id}c`
  ],
  desc: `${item.title}，位于${item.city}${item.district}${item.community}，${item.area}㎡，交通便利，周边配套完善，适合上班族居住。小区环境优美，物业管理规范，生活氛围浓厚。`,
  landlord: {
    name: ['张管家', '李管家', '王管家', '赵管家'][item.id % 4],
    mobile: `138${String(item.id).padStart(8, '0')}`
  },
  facilities: randomFacilities()
}))
