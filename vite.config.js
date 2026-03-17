import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import path from 'path'

const __dirname = import.meta.dirname;

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [VantResolver()]
    }),
    Components({
      resolvers: [VantResolver()]
    }),
    // gzip 压缩
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240,
      ext: '.gz',
      deleteOriginFile: false
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // 开发服务器配置
  server: {
    port: 5173,
    host: true // 允许本地局域网访问
  },
  // 使用 esbuild 移除 console
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // 1. 分包策略
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-vendor';
            }
            if (id.includes('vant')) {
              return 'vant-vendor';
            }
            if (id.includes('axios') || id.includes('dayjs')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }
        },
        // 2. 入口文件和代码块的分隔命名
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // 3. 静态资源命名
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || '';
          if (info.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]'
          }
          const imgRegRef = /\.(png|jpe?g|gif|svg|webp|ico)$/i;
          if (imgRegRef.test(info)) {
            return 'assets/img/[name]-[hash][extname]'
          }
          const fontRegRef = /\.(woff2?|eot|ttf|otf)$/i;
          if (fontRegRef.test(info)) {
            return 'assets/font/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  }
})
