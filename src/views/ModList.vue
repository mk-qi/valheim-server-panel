<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useServerStore } from '../stores/server';
import { ModCard } from '../components/svrmgr';
import SvrMgr from '../components/svrmgr/index.vue';
import { request } from '../utils/request';
import type { Mod } from '../types';

const serverStore = useServerStore();
const mods = ref<Mod[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchMods = async () => {
  if (!serverStore.selectedServer) {
    error.value = 'Please select a server first';
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const response = await request.get<Mod[]>(`/servers/${serverStore.selectedServer}/mods`);
    mods.value = response;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch mods';
    console.error('Failed to fetch mods:', e);
  } finally {
    isLoading.value = false;
  }
};

// Watch for server changes and fetch mods when server changes
watch(() => serverStore.selectedServer, (newServer) => {
  if (newServer) {
    fetchMods();
  } else {
    mods.value = [];
    error.value = null;
  }
});

onMounted(async () => {
  if (serverStore.selectedServer) {
    await fetchMods();
  }
});
</script>

<template>
  <SvrMgr>
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div 
      v-else-if="error" 
      class="bg-red-50 text-red-700 p-4 rounded-lg text-center"
    >
      {{ error }}
    </div>

    <div 
      v-else-if="!serverStore.selectedServer" 
      class="bg-gray-50 text-gray-500 p-12 rounded-lg text-center"
    >
      Select a server to view installed mods
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModCard
          v-for="mod in mods"
          :key="mod.id"
          :mod="mod"
        />
      </div>

      <div 
        v-if="mods.length === 0" 
        class="bg-gray-50 text-gray-500 p-12 rounded-lg text-center"
      >
        No mods installed
      </div>
    </template>
  </SvrMgr>
</template>