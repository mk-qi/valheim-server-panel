<script setup lang="ts">
import type { ModConfig } from '../../types';

defineProps<{
  configs: ModConfig[];
  selectedFile: string;
}>();

defineEmits<{
  (e: 'select', modId: string): void;
}>();
</script>

<template>
  <div class="p-4">
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
        </svg>
        <span class="font-medium">Config Files</span>
      </div>
      <div class="pl-6 space-y-1">
        <div
          v-for="config in configs"
          :key="config.modId"
          class="flex items-center gap-2 p-1 rounded cursor-pointer"
          :class="{
            'bg-blue-50 text-blue-700': selectedFile === config.modId,
            'hover:bg-gray-100': selectedFile !== config.modId
          }"
          @click="$emit('select', config.modId)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span class="text-sm truncate">{{ config.name }}.cfg</span>
        </div>
      </div>
    </div>
  </div>
</template>