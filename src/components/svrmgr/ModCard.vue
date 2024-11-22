<script setup lang="ts">
import type { Mod } from '../../types/mod';

defineProps<{
  mod: Mod;
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 class="text-xl font-bold mb-2">{{ mod.title }}</h3>
    <p class="text-gray-600 mb-4">{{ mod.description }}</p>
    <div class="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
      <img 
        v-if="mod.imageUrl" 
        :src="mod.imageUrl" 
        :alt="mod.title"
        class="w-full h-full object-cover rounded-lg"
      />
      <svg 
        v-else
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor" 
        class="w-12 h-12 text-gray-400"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
        />
      </svg>
    </div>
    <div v-if="mod.enabled !== undefined" class="mt-4 flex justify-between items-center">
      <span class="text-sm text-gray-500">
        {{ mod.enabled ? 'Enabled' : 'Disabled' }}
      </span>
      <button 
        v-if="mod.configurable"
        class="text-sm text-blue-600 hover:text-blue-800"
      >
        Configure
      </button>
    </div>
  </div>
</template>