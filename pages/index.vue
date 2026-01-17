<template>
  <div class="container">
    <AppHeader @open-create-modal="showCreateModal = true" />

    <PlanSearch v-model="searchQuery" />

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
      <DatePlanCard
        v-for="plan in localFilteredDatePlans"
        :key="plan.id"
        :plan="plan"
        @click="viewDatePlan"
      />
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

    <CreatePlanModal
      v-model="showCreateModal"
      :categories="categories"
      @create="handleCreateDatePlan"
    />

    <PlanDetailModal
      v-model="showDetailModal"
      :plan="selectedPlan"
    />
  </div>
</template>

<script setup lang="ts">
import type { DatePlan, CreateDatePlanRequest } from '~/composables/useDatePlans'

const {
  datePlans,
  loading,
  error,
  categories,
  fetchDatePlans,
  createDatePlan,
  clearError
} = useDatePlans()

const searchQuery = ref('')
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const selectedPlan = ref<DatePlan | null>(null)

// 検索フィルタリング
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

const viewDatePlan = (plan: DatePlan) => {
  selectedPlan.value = plan
  showDetailModal.value = true
}

const handleCreateDatePlan = async (newPlan: CreateDatePlanRequest) => {
  try {
    await createDatePlan(newPlan)
    showCreateModal.value = false
  } catch (err) {
    console.error('デートプランの作成に失敗しました:', err)
  }
}

onMounted(async () => {
  await fetchDatePlans()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

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

.date-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

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

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  .date-plans-grid {
    grid-template-columns: 1fr;
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
