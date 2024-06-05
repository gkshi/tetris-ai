<template>
  <div class="page -home flex a-start">
    <main>
      <game-field />
    </main>

    <game-aside />
  </div>
</template>

<script setup>
import GameField from '@/components/GameField.vue'
import GameAside from '@/components/GameAside.vue'
</script>

<style lang="scss" scoped>
.page.-home {
  padding: 40px;
  gap: 40px;
}
</style>
