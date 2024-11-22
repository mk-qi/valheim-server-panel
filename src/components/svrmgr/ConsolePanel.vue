<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import dayjs from 'dayjs';
import { useServerStore } from '../../stores/server';
import { request } from '../../utils/request';
import type { ConsoleLog, ServerCommand } from '../../types';

const serverStore = useServerStore();

const command = ref('');
const logs = ref<ConsoleLog[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const autoScroll = ref(true);

const fetchLogs = async () => {
  if (!serverStore.selectedServer) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await request.get<ConsoleLog[]>(`/servers/${serverStore.selectedServer}/logs`, { params: { limit: 100 } });
    logs.value = response;
    if (autoScroll.value) {
      scrollToBottom();
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch logs';
    console.error('Failed to fetch logs:', e);
  } finally {
    isLoading.value = false;
  }
};

const sendCommand = async () => {
  if (!command.value.trim() || !serverStore.selectedServer) return;
  
  const commandText = command.value;
  command.value = '';
  
  try {
    logs.value.push({
      id: `input-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `> ${commandText}`,
      source: 'user'
    });
    
    const result = await request.post<ServerCommand>(`/servers/${serverStore.selectedServer}/execute`, { command: commandText });
    
    if (result.response) {
      logs.value.push({
        id: `response-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: result.status === 'error' ? 'error' : 'info',
        message: result.response,
        source: 'system'
      });
    }
    
    if (autoScroll.value) {
      scrollToBottom();
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to execute command';
    console.error('Failed to execute command:', e);
  }
};

const clearLogs = () => {
  logs.value = [];
};

const exportLogs = () => {
  const content = logs.value
    .map(log => `[${dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}] [${log.level}] ${log.message}`)
    .join('\n');
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `server-logs-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const scrollToBottom = () => {
  setTimeout(() => {
    const container = document.getElementById('console-logs');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, 0);
};

const getLevelColor = (level: ConsoleLog['level']) => {
  switch (level) {
    case 'error': return 'text-red-600';
    case 'warning': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
};

const getSelectedServerName = () => {
  if (!serverStore.selectedServer) return null;
  const server = serverStore.servers.find(s => s.id === serverStore.selectedServer);
  return server?.name;
};

watch(() => serverStore.selectedServer, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (newValue) {
      fetchLogs();
    } else {
      logs.value = [];
      error.value = null;
    }
  }
});

onMounted(() => {
  if (serverStore.selectedServer) {
    fetchLogs();
  }
});
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <div class="bg-gray-800 p-4 rounded-t-lg flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h2 class="text-white font-semibold">Console</h2>
        <span v-if="getSelectedServerName()" class="text-sm text-gray-400">
          {{ getSelectedServerName() }}
        </span>
        <span v-if="error" class="text-sm bg-red-500 px-2 py-1 rounded">
          {{ error }}
        </span>
      </div>
      <div class="flex gap-2">
        <button
          class="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="clearLogs"
          :disabled="!serverStore.selectedServer || logs.length === 0"
        >
          Clear
        </button>
        <button
          class="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="exportLogs"
          :disabled="!serverStore.selectedServer || logs.length === 0"
        >
          Export
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="[autoScroll ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white']"
          @click="autoScroll = !autoScroll"
          :disabled="!serverStore.selectedServer"
        >
          Auto-scroll
        </button>
      </div>
    </div>
    <div
      id="console-logs"
      class="h-[500px] overflow-y-auto p-4 font-mono text-sm space-y-1 bg-gray-50"
    >
      <div v-if="!serverStore.selectedServer" class="flex items-center justify-center h-full text-gray-500">
        Select a server to view console logs
      </div>
      <div v-else-if="isLoading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
      <template v-else>
        <div
          v-for="log in logs"
          :key="log.id"
          :class="[
            'flex gap-4',
            getLevelColor(log.level)
          ]"
        >
          <span class="text-gray-400 select-none">
            {{ dayjs(log.timestamp).format('HH:mm:ss') }}
          </span>
          <span>{{ log.message }}</span>
        </div>
        <div v-if="logs.length === 0" class="text-center text-gray-500 py-4">
          No logs available
        </div>
      </template>
    </div>
    <div class="p-4 border-t bg-gray-800 rounded-b-lg">
      <div class="flex gap-2">
        <input
          v-model="command"
          type="text"
          placeholder="Enter command..."
          class="flex-1 px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          @keyup.enter="sendCommand"
          :disabled="!serverStore.selectedServer"
        />
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="sendCommand"
          :disabled="!serverStore.selectedServer || !command.trim()"
        >
          Send
        </button>
      </div>
      <div v-if="!serverStore.selectedServer" class="mt-2 text-sm text-gray-400">
        Select a server to use the console
      </div>
    </div>
  </div>
</template>