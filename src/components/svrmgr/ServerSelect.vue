<script setup lang="ts">
import { computed } from 'vue';
import type { Server } from '../../types';

const props = defineProps<{
  servers: Server[];
  selectedServer: string;
  isLoading: boolean;
}>();

defineEmits<{
  (e: 'select', serverId: string): void;
}>();

const selectedServerInfo = computed(() => 
  props.servers?.find(s => s.id === props.selectedServer)
);

const onlineServers = computed(() => 
  props.servers?.filter(server => server.status === 'online') ?? []
);
</script>

<template>
  <div class="relative">
    <select
      :value="selectedServer"
      @change="$emit('select', ($event.target as HTMLSelectElement).value)"
      class="appearance-none px-4 py-2 pr-10 border rounded-lg bg-white min-w-[300px] focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
      :disabled="isLoading"
    >
      <option value="" disabled>
        {{ onlineServers.length === 0 ? 'No online servers available' : 'Select a server' }}
      </option>
      <option
        v-for="server in servers"
        :key="server.id"
        :value="server.id"
        :disabled="server.status === 'offline'"
        :class="{ 'text-gray-400': server.status === 'offline' }"
      >
        {{ server.name }} - {{ server.address }}
        {{ server.status === 'offline' ? '(Offline)' : `(${server.players}/${server.maxPlayers} players)` }}
      </option>
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <div v-if="isLoading" class="animate-spin">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </div>
      <div v-else>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  </div>
  <div v-if="selectedServerInfo" class="mt-2 text-sm text-gray-500">
    Version: {{ selectedServerInfo.version }}
  </div>
  <div v-else-if="!isLoading && onlineServers.length === 0" class="mt-2 text-sm text-red-500">
    No online servers available
  </div>
</template>