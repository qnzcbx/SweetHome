module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      unitToConvert: 'px',       // 要转化的单位
      viewportWidth: 375,        // 设计稿宽度（375是主流移动端设计稿）
      unitPrecision: 5,          // 转换后保留几位小数
      propList: ['*'],           // 哪些属性要转换，* 代表全部
      viewportUnit: 'vw',        // 转成什么单位
      fontViewportUnit: 'vw',    // 字体转成什么单位
      selectorBlackList: ['.ignore-', '.hairline'],  // 不转换的class
      minPixelValue: 1,          // 小于1px不转换
      mediaQuery: false,         // 媒体查询中的px不转换
      replace: true,             // 直接替换而不是追加
      // 排除 vant 组件库（vant 本身已经做了适配）
      exclude: [/node_modules\/vant/]
    }
  }
}
