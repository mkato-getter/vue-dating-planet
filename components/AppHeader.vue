<template>
  <header class="header">
    <h1>デートプラン一覧</h1>
    <button @click="$emit('open-create-modal')" class="btn btn-primary create-btn">
      + 新しいデートプランを作成
    </button>
  </header>
</template>

<script setup lang="ts">
defineEmits(['open-create-modal'])
</script>

<style scoped>
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
  /* .btn class styles are in layouts/default.vue */
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header h1 {
    font-size: 24px;
  }
}
</style>
