import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    rules: {
      // 允许单个单词的组件名
      'vue/multi-word-component-names': 'off',

      'no-unused-vars': 'off',
      'no-console': 'off',
      'no-debugger': 'warn',
      'vue/no-unused-vars': 'warn',
      'vue/no-unused-components': 'warn',
      'no-undef': 'off',
    }
  },
  {
    // 忽略目录
    ignores: ['dist/', 'node_modules/', 'auto-imports.d.ts', 'components.d.ts']
  }
]
