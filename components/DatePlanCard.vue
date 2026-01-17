<template>
  <div class="date-plan-card" @click="$emit('click', plan)">
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
</template>

<script setup lang="ts">
import type { DatePlan } from '~/composables/useDatePlans'

defineProps<{
  plan: DatePlan
}>()

defineEmits(['click'])

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
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
</style>
