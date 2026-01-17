// Nuxt 3のサーバーAPIルート - 全ての/api/**リクエストをプロキシ
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:8080'
  
  // リクエストパスを取得
  // server/api/[...].ts は /api/** をキャッチする
  // /api プレフィックスを削除してAPIサーバーに転送
  const fullPath = event.node.req.url || '/'
  const path = fullPath.startsWith('/api') 
    ? fullPath.replace('/api', '') 
    : fullPath
  
  // クエリパラメータを取得
  const query = getQuery(event)
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const url = `${apiBaseUrl}${path}${queryString ? `?${queryString}` : ''}`
  
  // デバッグ用ログ
  if (import.meta.dev) {
    console.log(`[Nitro Proxy] ${event.node.req.method} ${fullPath} -> ${url}`)
  }
  
  // プロキシリクエスト
  try {
    // リクエストヘッダーをコピー（hostヘッダーを削除）
    const headers: Record<string, string> = {}
    for (const [key, value] of Object.entries(event.node.req.headers)) {
      const lowerKey = key.toLowerCase()
      // host, connection, upgrade などのプロキシ関連ヘッダーを除外
      if (lowerKey !== 'host' && lowerKey !== 'connection' && lowerKey !== 'upgrade') {
        headers[key] = Array.isArray(value) ? value[0] : value
      }
    }
    
    // Content-Typeが設定されていない場合は、JSONをデフォルトに
    if (!headers['content-type'] && event.node.req.method !== 'GET' && event.node.req.method !== 'HEAD') {
      headers['content-type'] = 'application/json'
    }
    
    return await $fetch(url, {
      method: event.node.req.method as any,
      headers,
      body: event.node.req.method !== 'GET' && event.node.req.method !== 'HEAD' 
        ? await readBody(event).catch(() => undefined)
        : undefined,
    })
  } catch (error: any) {
    // エラーログ
    if (import.meta.dev) {
      console.error(`[Nitro Proxy Error] ${fullPath} -> ${url}:`, error.message || error)
    }
    throw error
  }
})

