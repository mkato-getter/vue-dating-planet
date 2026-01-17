<template>
  <div v-if="modelValue && plan" class="modal-overlay" @click="$emit('update:modelValue', false)">
    <div class="modal-content detail-modal" @click.stop>
      <div class="modal-header">
        <h2>{{ plan.title }}</h2>
        <button @click="$emit('update:modelValue', false)" class="close-btn">×</button>
      </div>

      <div class="plan-detail">
        <div class="detail-image">
          <img :src="plan.imageUrl" :alt="plan.title">
        </div>

        <div class="detail-content">
          <div class="detail-meta">
            <span class="category-tag">{{ plan.category }}</span>
            <div class="meta-info">
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
          </div>

          <div class="detail-description">
            <h3>プラン詳細</h3>
            <p>{{ plan.description }}</p>
          </div>

          <div class="detail-author">
            <div class="author-info">
              <img :src="plan.author.avatar" :alt="plan.author.name" class="author-avatar">
              <div>
                <div class="author-name">{{ plan.author.name }}</div>
                <div class="plan-date">{{ formatDateTime(plan.createdAt) }}</div>
              </div>
            </div>
          </div>

          <div class="detail-actions">
            <div class="plan-stats">
              <button class="stat-button">
                <span class="stat-icon">👍</span>
                {{ plan.likes }}
              </button>
              <button class="stat-button">
                <span class="stat-icon">💬</span>
                {{ plan.comments }}
              </button>
            </div>
            <button class="btn btn-primary">このプランを使う</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DatePlan } from '~/composables/useDatePlans'

const props = defineProps<{
  modelValue: boolean
  plan: DatePlan | null
}>()

defineEmits(['update:modelValue'])

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
  max-width: 800px;
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

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
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

@media (max-width: 768px) {
  .detail-actions {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .plan-stats {
    justify-content: center;
  }
}
</style>
