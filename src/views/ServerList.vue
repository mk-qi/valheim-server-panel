<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useServerStore } from '../stores/server';
import { ServerCard } from '../components/svrmgr';

const serverStore = useServerStore();
const isLoading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');

const filteredServers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return serverStore.servers;
  
  return serverStore.servers.filter(server => 
    server.name.toLowerCase().includes(query) ||
    server.address.toLowerCase().includes(query) ||
    server.version.toLowerCase().includes(query)
  );
});

const handleConnect = async (serverId: string) => {
  try {
    await serverStore.selectServer(serverId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to connect to server';
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    await serverStore.fetchServers();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch servers';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Servers</h1>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Server
        </button>
      </div>

      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search servers by name, address, or version..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div 
        v-else-if="error" 
        class="bg-red-50 text-red-700 p-4 rounded-lg text-center"
      >
        {{ error }}
      </div>

      <template v-else>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ServerCard
            v-for="server in filteredServers"
            :key="server.id"
            :server="server"
            :onConnect="handleConnect"
          />
        </div>

        <div 
          v-if="serverStore.servers.length === 0" 
          class="bg-gray-50 text-gray-500 p-12 rounded-lg text-center"
        >
          No servers found
        </div>

        <div 
          v-else-if="filteredServers.length === 0" 
          class="bg-gray-50 text-gray-500 p-12 rounded-lg text-center"
        >
          No servers match your search
        </div>
      </template>
    </div>
  </div>
</template>