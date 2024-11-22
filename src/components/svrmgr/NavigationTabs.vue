<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const tabs = [
  { id: 'mods', label: 'Installed Mods', path: '/mods' },
  { id: 'config', label: 'Mod CFG Editor', path: '/config' },
  { id: 'console', label: 'Console', path: '/console' },
];

const currentPath = computed(() => router.currentRoute.value.path);
</script>

<template>
  <div class="border-b">
    <nav class="flex gap-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'px-4 py-2 font-medium',
          currentPath === tab.path ? 'border-b-2 border-black' : 'text-gray-500'
        ]"
        @click="router.push(tab.path)"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>