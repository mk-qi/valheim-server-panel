<script setup lang="ts">
import TopBar from './TopBar.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <TopBar />
    <main class="container mx-auto px-4 py-6">
      <slot></slot>
    </main>
  </div>
</template>