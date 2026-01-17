interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
}

interface ApiError {
  message: string
  status: number
}

export const useApi = () => {
  const config = useRuntimeConfig()

  // APIベースURLの設定
  const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:8080'
  
  // デバッグ用: 設定されたAPIベースURLをログ出力
  if (import.meta.dev) {
    console.log(`[useApi] API Base URL: ${apiBaseUrl}`)
  }

  const request = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    let url: string
    let useNativeFetch = false

    if (import.meta.client) {
      // クライアント側（ブラウザ）: 直接localhost:8080に接続
      // /apiプレフィックスを削除してAPIサーバーに直接接続
      const finalEndpoint = endpoint.startsWith('/api') ? endpoint.replace('/api', '') : endpoint
      url = `${apiBaseUrl}${finalEndpoint}`
      useNativeFetch = true  // クライアント側ではfetchを直接使用
    } else {
      // サーバー側（SSR）: server/api/[...].ts経由でプロキシ（相対パスを使用）
      url = endpoint  // 相対パスでserver/api/[...].ts経由
      useNativeFetch = false  // サーバー側では$fetchを使用
    }
    
    // デバッグ用: リクエストURLをログ出力
    if (import.meta.dev) {
      console.log(`[useApi] Request URL: ${url}, Client: ${import.meta.client}, Endpoint: ${endpoint}`)
    }

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        // Basic認証ヘッダーを追加
        'Authorization': `Basic ${btoa(`${config.public.apiUsername}:${config.public.apiPassword}`)}`,
        ...options.headers,
      },
      ...options,
    }

    try {
      let data: T

      if (useNativeFetch) {
        // クライアント側: 直接fetchを使用してAPIサーバーに接続
        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: defaultOptions.headers as HeadersInit,
          body: options.body,
        })

        if (!response.ok) {
          const errorData = await response.text().catch(() => response.statusText)
          if (response.status >= 500) {
            console.error(`API Server Error (${response.status}):`, errorData)
          }
          throw {
            status: response.status,
            message: errorData || `HTTP error! status: ${response.status}`,
          }
        }

        data = await response.json()
      } else {
        // サーバー側: $fetchを使用してserver/api/[...].ts経由でプロキシ
        data = await $fetch<T>(url, {
          method: (options.method || 'GET') as any,
          headers: defaultOptions.headers as Record<string, string>,
          body: options.body,
          onResponseError({ response }) {
            // エラーの詳細をコンソールに出力（デバッグ用）
            if (response.status >= 500) {
              console.error(`API Server Error (${response.status}):`, response._data || response.statusText)
            }
          }
        })
      }

      return {
        data,
        status: 200,
      }
    } catch (error: any) {
      // $fetchのエラーハンドリング
      const status = error.status || error.statusCode || 0
      const message = error.message || error.data?.message || 'API request failed'
      
      // エラーの詳細をコンソールに出力
      console.error('API request failed:', { url, status, message, error })
      
      throw {
        message: status >= 500 
          ? 'APIサーバーでエラーが発生しました。APIサーバーが起動しているか確認してください。'
          : message,
        status,
      } as ApiError
    }
  }

  // GETリクエスト
  const get = <T = any>(endpoint: string) =>
    request<T>(endpoint, { method: 'GET' })

  // POSTリクエスト
  const post = <T = any>(endpoint: string, data?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })

  // PUTリクエスト
  const put = <T = any>(endpoint: string, data?: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })

  // DELETEリクエスト
  const del = <T = any>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' })

  return {
    get,
    post,
    put,
    delete: del,
    request,
  }
}
