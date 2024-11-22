import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ConsoleLog } from '../types';
import { request } from '../utils/request';

export const useConsoleStore = defineStore('console', () => {
  const logs = ref<ConsoleLog[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchLogs = async (serverId: string, params?: { limit?: number; offset?: number }) => {
    if (!serverId) {
      error.value = 'Server ID is required';
      return;
    }

    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await request.get<ConsoleLog[]>(`/servers/${serverId}/logs`, { params });
      logs.value = response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch logs';
      logs.value = []; // Initialize with empty array on error
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const executeCommand = async (serverId: string, command: string) => {
    if (!serverId || !command) {
      error.value = 'Server ID and command are required';
      return;
    }

    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await request.post<ConsoleLog>(`/servers/${serverId}/execute`, { command });
      await fetchLogs(serverId, { limit: 100 }); // Refresh logs after command execution
      return response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to execute command';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    logs,
    isLoading,
    error,
    fetchLogs,
    executeCommand
  };
});