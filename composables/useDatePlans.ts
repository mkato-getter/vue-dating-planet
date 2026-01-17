// useApiは自動インポートされる

export interface DatePlan {
  id: number
  title: string
  description: string
  location: string
  date: string
  time: string
  category: string
  imageUrl: string
  author: {
    id: number
    name: string
    avatar: string
  }
  likes: number
  comments: number
  createdAt: string
  updatedAt: string
}

export interface CreateDatePlanRequest {
  title: string
  description: string
  location: string
  date: string
  time: string
  category: string
  imageUrl?: string
}

interface DatePlanFilters {
  category?: string
  location?: string
  dateRange?: {
    start: string
    end: string
  }
}

export const useDatePlans = () => {
  const { get, post, put, delete: del } = useApi()

  // 状態管理
  const datePlans = ref<DatePlan[]>([])
  const loading = ref(false)
  const error = ref<string>('')

  // フィルタリングされたデートプラン一覧
  const filteredDatePlans = computed(() => {
    return datePlans.value
  })

  // カテゴリ一覧
  const categories = [
    'ロマンチック',
    'アクティブ',
    'グルメ',
    '文化・芸術',
    '自然・アウトドア',
    'その他'
  ]

  // デートプラン一覧を取得
  const fetchDatePlans = async (filters?: DatePlanFilters) => {
    loading.value = true
    error.value = ''

    try {
      // 実際のAPIエンドポイントを試行
      try {
        let endpoint = '/api/date-plans'
        if (filters?.category || filters?.location) {
          const params = new URLSearchParams()
          if (filters.category) params.append('category', filters.category)
          if (filters.location) params.append('location', filters.location)
          endpoint += `?${params.toString()}`
        }
        const result = await get(endpoint)
        // APIレスポンスの構造に対応（PagedDatePlanResponseDtoの場合）
        // result.data.content または result.data.datePlans または result.data を確認
        if (result.data && Array.isArray(result.data)) {
          // 直接配列の場合
          datePlans.value = result.data
        } else if (result.data?.content && Array.isArray(result.data.content)) {
          // PagedDatePlanResponseDto形式の場合
          datePlans.value = result.data.content
        } else if (result.data?.datePlans && Array.isArray(result.data.datePlans)) {
          // 別の形式の場合
          datePlans.value = result.data.datePlans
        } else {
          console.warn('予期しないAPIレスポンス形式:', result.data)
          datePlans.value = []
        }
      } catch (apiError) {
        console.warn('APIが利用できないため、デモデータを使用します:', apiError)
        throw apiError // デモデータにフォールバック
      }

    } catch (err: any) {
      // APIが利用できない場合、デモデータを使用
      const demoData: DatePlan[] = [
        {
          id: 1,
          title: '東京タワーで夜景デート',
          description: '東京の象徴、東京タワーから見る夜景は格別です。展望台から見る360度の夜景に感動すること間違いなし！',
          location: '東京タワー',
          date: '2024-12-25',
          time: '19:00',
          category: 'ロマンチック',
          imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
          author: {
            id: 1,
            name: 'デートマスター',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
          },
          likes: 24,
          comments: 8,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          title: '浅草で食べ歩き',
          description: '浅草の老舗店舗で食べ歩きを楽しむプラン。雷門から仲見世通りを散策しながら、伝統的なお菓子や食べ物を味わいましょう。',
          location: '浅草',
          date: '2024-12-28',
          time: '14:00',
          category: 'グルメ',
          imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
          author: {
            id: 2,
            name: 'グルメ探検家',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
          },
          likes: 18,
          comments: 5,
          createdAt: '2024-01-16T15:20:00Z',
          updatedAt: '2024-01-16T15:20:00Z'
        },
        {
          id: 3,
          title: '代々木公園でピクニック',
          description: '天気の良い日に代々木公園でピクニック。緑豊かな公園でゆったりとした時間を過ごすのにぴったりです。',
          location: '代々木公園',
          date: '2024-12-30',
          time: '11:00',
          category: '自然・アウトドア',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          author: {
            id: 3,
            name: 'アウトドア好き',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
          },
          likes: 12,
          comments: 3,
          createdAt: '2024-01-17T09:15:00Z',
          updatedAt: '2024-01-17T09:15:00Z'
        },
        {
          id: 4,
          title: '美術館でアートデート',
          description: '国立新美術館で現代アートを鑑賞。特別展もチェックして、アートについて語り合う時間を楽しみましょう。',
          location: '国立新美術館',
          date: '2024-12-27',
          time: '13:00',
          category: '文化・芸術',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          author: {
            id: 4,
            name: 'アート好き',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face'
          },
          likes: 15,
          comments: 6,
          createdAt: '2024-01-18T14:45:00Z',
          updatedAt: '2024-01-18T14:45:00Z'
        },
        {
          id: 5,
          title: 'アクティブにボルダリング',
          description: '初心者大歓迎のボルダリングジムで体を動かそう！運動した後の達成感と絆が深まること間違いなしです。',
          location: 'クライミングジム',
          date: '2024-12-29',
          time: '15:00',
          category: 'アクティブ',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
          author: {
            id: 5,
            name: 'アクティブ派',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
          },
          likes: 9,
          comments: 2,
          createdAt: '2024-01-19T11:30:00Z',
          updatedAt: '2024-01-19T11:30:00Z'
        }
      ]

      // フィルタリング処理
      let filteredData = demoData
      if (filters?.category) {
        filteredData = filteredData.filter(plan => plan.category === filters.category)
      }
      if (filters?.location) {
        filteredData = filteredData.filter(plan =>
          plan.location.toLowerCase().includes(filters.location!.toLowerCase())
        )
      }

      datePlans.value = filteredData

      // APIが利用できないことを通知（ただしエラーとしては扱わない）
      if (err.message?.includes('HTTP error! status:') || 
          err.message?.includes('APIサーバーに接続できません') ||
          err.status === 500 || 
          err.status === 0) {
        error.value = 'APIサーバーが起動していないため、デモデータを使用しています。'
      }
    } finally {
      loading.value = false
    }
  }

  // デートプランを作成
  const createDatePlan = async (planData: CreateDatePlanRequest): Promise<DatePlan | null> => {
    loading.value = true
    error.value = ''

    try {
      // 実際のAPIエンドポイントを試行
      try {
        const result = await post('/api/date-plans', planData)
        const newPlan = result.data
        datePlans.value.unshift(newPlan)
        return newPlan
      } catch (apiError) {
        console.warn('APIが利用できないため、デモデータとして作成します:', apiError)
        throw apiError // デモデータにフォールバック
      }

    } catch (err: any) {
      // APIが利用できない場合、デモデータとして作成
      const newPlan: DatePlan = {
        id: Math.max(...datePlans.value.map(p => p.id)) + 1,
        title: planData.title,
        description: planData.description,
        location: planData.location,
        date: planData.date,
        time: planData.time,
        category: planData.category,
        imageUrl: planData.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop',
        author: {
          id: 999,
          name: 'あなた',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      datePlans.value.unshift(newPlan)

      // APIが利用できないことを通知（ただしエラーとしては扱わない）
      if (err.message?.includes('HTTP error! status:') || 
          err.message?.includes('APIサーバーに接続できません') ||
          err.status === 500 || 
          err.status === 0) {
        error.value = 'APIサーバーが起動していないため、ローカルデータとして保存されました。'
      }

      return newPlan
    } finally {
      loading.value = false
    }
  }

  // デートプランを更新
  const updateDatePlan = async (id: number, planData: Partial<CreateDatePlanRequest>): Promise<boolean> => {
    loading.value = true
    error.value = ''

    try {
      // TODO: 実際のAPIエンドポイントに変更
      // await put(`/api/date-plans/${id}`, planData)

      // デモ用の更新処理
      const index = datePlans.value.findIndex(plan => plan.id === id)
      if (index !== -1) {
        datePlans.value[index] = {
          ...datePlans.value[index],
          ...planData,
          updatedAt: new Date().toISOString()
        }
      }

      return true

    } catch (err: any) {
      error.value = err.message || 'デートプランの更新に失敗しました'
      console.error('Error updating date plan:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // デートプランを削除
  const deleteDatePlan = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = ''

    try {
      // TODO: 実際のAPIエンドポイントに変更
      // await del(`/api/date-plans/${id}`)

      // デモ用の削除処理
      datePlans.value = datePlans.value.filter(plan => plan.id !== id)
      return true

    } catch (err: any) {
      error.value = err.message || 'デートプランの削除に失敗しました'
      console.error('Error deleting date plan:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // デートプランにいいねをする
  const likeDatePlan = async (id: number): Promise<boolean> => {
    try {
      // TODO: 実際のAPIエンドポイントに変更
      // await post(`/api/date-plans/${id}/like`)

      // デモ用のいいね処理
      const plan = datePlans.value.find(p => p.id === id)
      if (plan) {
        plan.likes += 1
      }

      return true

    } catch (err: any) {
      error.value = err.message || 'いいねに失敗しました'
      console.error('Error liking date plan:', err)
      return false
    }
  }

  // デートプランのコメントを取得
  const fetchComments = async (id: number) => {
    try {
      // TODO: 実際のAPIエンドポイントに変更
      // const result = await get(`/api/date-plans/${id}/comments`)
      // return result.data

      // デモデータ
      return [
        {
          id: 1,
          content: '素敵なプランですね！参考にします。',
          author: { name: 'デート初心者' },
          createdAt: '2024-01-16T10:30:00Z'
        },
        {
          id: 2,
          content: '実際に実行してみました。最高でした！',
          author: { name: '経験者' },
          createdAt: '2024-01-17T14:20:00Z'
        }
      ]

    } catch (err: any) {
      error.value = err.message || 'コメントの取得に失敗しました'
      console.error('Error fetching comments:', err)
      return []
    }
  }

  // コメントを追加
  const addComment = async (id: number, content: string): Promise<boolean> => {
    try {
      // TODO: 実際のAPIエンドポイントに変更
      // await post(`/api/date-plans/${id}/comments`, { content })

      // デモ用のコメント追加処理
      const plan = datePlans.value.find(p => p.id === id)
      if (plan) {
        plan.comments += 1
      }

      return true

    } catch (err: any) {
      error.value = err.message || 'コメントの追加に失敗しました'
      console.error('Error adding comment:', err)
      return false
    }
  }

  // エラーをクリア
  const clearError = () => {
    error.value = ''
  }

  return {
    // 状態
    datePlans: readonly(datePlans),
    filteredDatePlans,
    loading: readonly(loading),
    error: readonly(error),
    categories,

    // メソッド
    fetchDatePlans,
    createDatePlan,
    updateDatePlan,
    deleteDatePlan,
    likeDatePlan,
    fetchComments,
    addComment,
    clearError
  }
}
