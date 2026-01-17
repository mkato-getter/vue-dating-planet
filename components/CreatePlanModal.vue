<template>
  <div v-if="modelValue" class="modal-overlay" @click="$emit('update:modelValue', false)">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>新しいデートプランを作成</h2>
        <button @click="$emit('update:modelValue', false)" class="close-btn">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="create-form">
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
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
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
          <button type="button" @click="$emit('update:modelValue', false)" class="btn btn-secondary">
            キャンセル
          </button>
          <button type="submit" class="btn btn-primary" :disabled="!newPlan.title.trim()">
            作成する
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateDatePlanRequest } from '~/composables/useDatePlans'

const props = defineProps<{
  modelValue: boolean
  categories: string[]
}>()

const emit = defineEmits(['update:modelValue', 'create'])

const newPlan = ref<CreateDatePlanRequest>({
  title: '',
  description: '',
  location: '',
  date: '',
  time: '',
  category: 'ロマンチック',
  imageUrl: ''
})

const handleSubmit = () => {
  if (!newPlan.value.title.trim()) return
  emit('create', { ...newPlan.value })
  // フォームリセット
  newPlan.value = {
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    category: 'ロマンチック',
    imageUrl: ''
  }
}
</script>

<style scoped>
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
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .form-actions {
    flex-direction: column;
  }
}
</style>
