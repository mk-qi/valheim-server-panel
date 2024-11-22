<script setup lang="ts">
import { computed } from 'vue';
import { useServerStore } from '../../stores/server';
import ServerSelect from './ServerSelect.vue';
import type { ServerStatus as ServerStatusType } from '../../types';

defineProps<{
  status: ServerStatusType;
}>();

const serverStore = useServerStore();

const handleServerChange = async (serverId: string) => {
  try {
    await serverStore.selectServer(serverId);
  } catch (e) {
    // Error is handled by the store
  }
};

const handleFlushPages = async () => {
  if (!serverStore.selectedServer) return;
  try {
    await serverStore.flushPages(serverStore.selectedServer);
  } catch (e) {
    // Error is handled by the store
  }
};

const selectedServerInfo = computed(() => 
  serverStore.servers.find(s => s.id === serverStore.selectedServer)
);

const statusColor = computed(() => {
  if (serverStore.error) return 'bg-red-100';
  if (!serverStore.selectedServer) return 'bg-gray-100';
  return 'bg-green-100';
});

const statusMessage = computed(() => {
  if (serverStore.error) return serverStore.error;
  if (!selectedServerInfo.value) return 'No server selected';
  return `Connected to ${selectedServerInfo.value.name} (${selectedServerInfo.value.players}/${selectedServerInfo.value.maxPlayers} players)`;
});

const isDisabled = computed(() => 
  Boolean(serverStore.isLoading || !serverStore.selectedServer || serverStore.error)
);
</script>

<template>
  <div :class="['rounded-lg p-4 flex justify-between items-center', statusColor]">
    <div class="flex items-center gap-2">
      <div 
        :class="[
          'w-4 h-4 rounded-full',
          serverStore.error ? 'bg-red-500' : serverStore.selectedServer ? 'bg-green-500' : 'bg-gray-500'
        ]"
      ></div>
      <span :class="[
        serverStore.error ? 'text-red-700' : serverStore.selectedServer ? 'text-green-700' : 'text-gray-700'
      ]">
        {{ statusMessage }}
      </span>
    </div>
    <div class="flex flex-col items-end gap-2">
      <div class="flex items-center gap-4">
        <ServerSelect
          :servers="serverStore.servers"
          :selected-server="serverStore.selectedServer"
          :is-loading="serverStore.isLoading"
          @select="handleServerChange"
        />
        <button 
          class="p-2 hover:bg-green-50 rounded-full text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleFlushPages"
          :disabled="isDisabled"
          :title="!serverStore.selectedServer ? 'Select a server first' : serverStore.error ? serverStore.error : 'Flush pages'"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke-width="1.5" 
            stroke="currentColor" 
            class="w-6 h-6"
            :class="{ 'animate-spin': serverStore.isLoading }"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" 
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>