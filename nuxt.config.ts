// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      // コンテナ間通信では localhost ではなく backend を使用
      apiBaseUrl: process.env.API_BASE_URL || 'http://backend:8080',
      apiUsername: process.env.API_USERNAME || 'user',
      apiPassword: process.env.API_PASSWORD || 'password'
    }
  },

  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },

  ssr: true,

  vite: {
    server: {
      fs: { strict: false },
      watch: { usePolling: true },
      hmr: { protocol: 'ws', host: 'localhost' },
      proxy: {
        '/api': {
          target: 'http://backend:8080', // ←ここを変更
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path
        }
      }
    }
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://backend:8080', // ←ここも変更
        changeOrigin: true,
        prependPath: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'デートプラン共有アプリ',
      meta: [
        { name: 'description', content: 'デートプランを共有して、素敵な思い出を作りましょう' }
      ]
    }
  }
})
