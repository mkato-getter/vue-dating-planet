<template>
  <div class="search-section">
    <div class="search-input">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="デートプランを検索..."
        class="search-field"
      >
      <span class="search-icon">🔍</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
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
</style>
