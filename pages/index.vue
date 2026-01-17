<template>
  <div class="container">
    <!-- ヘッダー -->
    <header class="header">
      <h1>デートプラン一覧</h1>
      <button @click="showCreateModal = true" class="btn btn-primary create-btn">
        + 新しいデートプランを作成
      </button>
    </header>

    <!-- 検索・フィルター -->
    <div class="search-section">
      <div class="search-input">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="デートプランを検索..."
          class="search-field"
        >
        <span class="search-icon">🔍</span>
      </div>
    </div>

    <!-- エラーメッセージ -->
    <div v-if="error" class="error-message">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span>{{ error }}</span>
        <button @click="clearError" class="error-close">×</button>
      </div>
    </div>

    <!-- ローディング -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>デートプランを読み込み中...</p>
    </div>

    <!-- デートプラン一覧 -->
    <div v-else-if="!loading && localFilteredDatePlans.length > 0" class="date-plans-grid">
      <div
        v-for="plan in localFilteredDatePlans"
        :key="plan.id"
        class="date-plan-card"
        @click="viewDatePlan(plan)"
      >
        <div class="plan-image">
          <img :src="plan.imageUrl" :alt="plan.title">
          <div class="plan-category">{{ plan.category }}</div>
        </div>

        <div class="plan-content">
          <h3 class="plan-title">{{ plan.title }}</h3>

          <div class="plan-meta">
            <div class="meta-item">
              <span class="meta-icon">📍</span>
              <span>{{ plan.location }}</span>
            </div>

            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span>{{ formatDate(plan.date) }}</span>
            </div>

            <div class="meta-item">
              <span class="meta-icon">⏰</span>
              <span>{{ plan.time }}</span>
            </div>
          </div>

          <p class="plan-description">{{ plan.description }}</p>

          <div class="plan-footer">
            <div class="plan-author">
              <img :src="plan.author.avatar" :alt="plan.author.name" class="author-avatar">
              <span>{{ plan.author.name }}</span>
            </div>

            <div class="plan-stats">
              <span class="stat-item">
                <span class="stat-icon">👍</span>
                {{ plan.likes }}
              </span>
              <span class="stat-item">
                <span class="stat-icon">💬</span>
                {{ plan.comments }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- デートプランが見つからない場合 -->
    <div v-else-if="!loading && !error" class="no-plans">
      <div class="no-plans-icon">📅</div>
      <h3>デートプランが見つかりません</h3>
      <p>最初のデートプランを作成してみましょう！</p>
      <button @click="showCreateModal = true" class="btn btn-primary">
        デートプランを作成する
      </button>
    </div>

    <!-- デートプラン作成モーダル -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>新しいデートプランを作成</h2>
          <button @click="showCreateModal = false" class="close-btn">×</button>
        </div>

        <form @submit.prevent="handleCreateDatePlan" class="create-form">
          <div class="form-group">
            <label for="plan-title">プランタイトル *</label>
            <input
              id="plan-title"
              v-model="newPlan.title"
              type="text"
              placeholder="例: 東京タワーで夜景デート"
              required
            >
          </div>

          <div class="form-group">
            <label for="plan-category">カテゴリ</label>
            <select id="plan-category" v-model="newPlan.category">
              <option value="ロマンチック">ロマンチック</option>
              <option value="アクティブ">アクティブ</option>
              <option value="グルメ">グルメ</option>
              <option value="文化・芸術">文化・芸術</option>
              <option value="自然・アウトドア">自然・アウトドア</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="plan-location">場所</label>
              <input
                id="plan-location"
                v-model="newPlan.location"
                type="text"
                placeholder="例: 東京タワー"
              >
            </div>

            <div class="form-group">
              <label for="plan-date">日付</label>
              <input
                id="plan-date"
                v-model="newPlan.date"
                type="date"
              >
            </div>

            <div class="form-group">
              <label for="plan-time">時間</label>
              <input
                id="plan-time"
                v-model="newPlan.time"
                type="time"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="plan-description">説明</label>
            <textarea
              id="plan-description"
              v-model="newPlan.description"
              placeholder="デートプランの詳細を入力してください..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="plan-image">画像URL</label>
            <input
              id="plan-image"
              v-model="newPlan.imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
            >
          </div>

          <div class="form-actions">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">
              キャンセル
            </button>
            <button type="submit" class="btn btn-primary" :disabled="!newPlan.title.trim()">
              作成する
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- デートプラン詳細モーダル -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content detail-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedPlan?.title }}</h2>
          <button @click="showDetailModal = false" class="close-btn">×</button>
        </div>

        <div v-if="selectedPlan" class="plan-detail">
          <div class="detail-image">
            <img :src="selectedPlan.imageUrl" :alt="selectedPlan.title">
          </div>

          <div class="detail-content">
            <div class="detail-meta">
              <span class="category-tag">{{ selectedPlan.category }}</span>
              <div class="meta-info">
                <div class="meta-item">
                  <span class="meta-icon">📍</span>
                  <span>{{ selectedPlan.location }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span>{{ formatDate(selectedPlan.date) }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">⏰</span>
                  <span>{{ selectedPlan.time }}</span>
                </div>
              </div>
            </div>

            <div class="detail-description">
              <h3>プラン詳細</h3>
              <p>{{ selectedPlan.description }}</p>
            </div>

            <div class="detail-author">
              <div class="author-info">
                <img :src="selectedPlan.author.avatar" :alt="selectedPlan.author.name" class="author-avatar">
                <div>
                  <div class="author-name">{{ selectedPlan.author.name }}</div>
                  <div class="plan-date">{{ formatDateTime(selectedPlan.createdAt) }}</div>
                </div>
              </div>
            </div>

            <div class="detail-actions">
              <div class="plan-stats">
                <button class="stat-button">
                  <span class="stat-icon">👍</span>
                  {{ selectedPlan.likes }}
                </button>
                <button class="stat-button">
                  <span class="stat-icon">💬</span>
                  {{ selectedPlan.comments }}
                </button>
              </div>
              <button class="btn btn-primary">このプランを使う</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 型定義のインポート
import type { DatePlan, CreateDatePlanRequest } from '~/composables/useDatePlans'

// useDatePlansコンポーザブルを使用（自動インポート）
const {
  datePlans,
  filteredDatePlans,
  loading,
  error,
  categories,
  fetchDatePlans,
  createDatePlan,
  clearError
} = useDatePlans()

// UI用の状態管理
const searchQuery = ref('')
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const selectedPlan = ref<DatePlan | null>(null)

// 新しいデートプラン作成用のフォーム
const newPlan = ref<CreateDatePlanRequest>({
  title: '',
  description: '',
  location: '',
  date: '',
  time: '',
  category: 'ロマンチック',
  imageUrl: ''
})

// 検索でフィルタリングされたデートプラン一覧
const localFilteredDatePlans = computed(() => {
  if (!searchQuery.value.trim()) {
    return datePlans.value
  }

  const query = searchQuery.value.toLowerCase()
  return datePlans.value.filter(plan =>
    plan.title.toLowerCase().includes(query) ||
    plan.description.toLowerCase().includes(query) ||
    plan.location.toLowerCase().includes(query) ||
    plan.category.toLowerCase().includes(query)
  )
})

// 日付フォーマット関数
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// デートプラン詳細表示
const viewDatePlan = (plan: DatePlan) => {
  selectedPlan.value = plan
  showDetailModal.value = true
}

// デートプラン作成
const handleCreateDatePlan = async () => {
  if (!newPlan.value.title.trim()) return

  try {
    await createDatePlan({
      title: newPlan.value.title,
      description: newPlan.value.description,
      location: newPlan.value.location,
      date: newPlan.value.date,
      time: newPlan.value.time,
      category: newPlan.value.category,
      imageUrl: newPlan.value.imageUrl
    })

    // フォームをリセット
    newPlan.value = {
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      category: 'ロマンチック',
      imageUrl: ''
    }

    showCreateModal.value = false
  } catch (err) {
    console.error('デートプランの作成に失敗しました:', err)
  }
}

// ページ読み込み時にデートプランを取得
onMounted(async () => {
  await fetchDatePlans()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

/* ヘッダー */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
}

.create-btn {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* 検索セクション */
.search-section {
  margin-bottom: 30px;
}

.search-input {
  position: relative;
  max-width: 400px;
}

.search-field {
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 2px solid #e1e8ed;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-field:focus {
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
}

/* デートプラン一覧 */
.date-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.date-plan-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.date-plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.plan-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.plan-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.date-plan-card:hover .plan-image img {
  transform: scale(1.05);
}

.plan-category {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255,255,255,0.9);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.plan-content {
  padding: 20px;
}

.plan-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
}

.plan-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.meta-icon {
  font-size: 16px;
}

.plan-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.plan-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.plan-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.plan-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.stat-icon {
  font-size: 14px;
}

/* プランが見つからない場合 */
.no-plans {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.no-plans-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-plans h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 24px;
}

.no-plans p {
  margin: 0 0 30px 0;
  color: #666;
  font-size: 16px;
}

/* モーダル */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
}

/* フォーム */
.create-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* ボタン */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* デートプラン詳細 */
.detail-modal {
  max-width: 800px;
}

.detail-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-content {
  padding: 24px;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.category-tag {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  width: fit-content;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-description {
  margin-bottom: 24px;
}

.detail-description h3 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 20px;
}

.detail-description p {
  color: #666;
  line-height: 1.6;
}

.detail-author {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-name {
  font-weight: 600;
  color: #2c3e50;
}

.plan-date {
  font-size: 12px;
  color: #666;
}

.detail-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.plan-stats {
  display: flex;
  gap: 16px;
}

.stat-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #666;
}

.stat-button:hover {
  border-color: #667eea;
  color: #667eea;
}

/* エラーメッセージ */
.error-message {
  margin-bottom: 20px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 12px 16px;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #c33;
}

.error-icon {
  font-size: 18px;
}

.error-close {
  background: none;
  border: none;
  color: #c33;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  margin-left: auto;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.error-close:hover {
  background: #fcc;
}

/* ローディング */
.loading {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header h1 {
    font-size: 24px;
  }

  .date-plans-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .detail-actions {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .plan-stats {
    justify-content: center;
  }

  .error-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .error-close {
    margin-left: 0;
  }
}
</style>

<style>
/* グローバルスタイル */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

body {
  overflow-x: hidden;
}
</style>
