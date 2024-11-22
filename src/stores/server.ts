import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Server } from '../types';
import { serverApi } from '../utils/api';

export const useServerStore = defineStore('server', () => {
  const servers = ref<Server[]>([]);
  const selectedServer = ref<string>('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchServers = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      servers.value = await serverApi.getServers();
      
      // If no server is selected and we have online servers, select the first online one
      if (!selectedServer.value && servers.value.length > 0) {
        const firstOnlineServer = servers.value.find(server => server.status === 'online');
        if (firstOnlineServer) {
          await selectServer(firstOnlineServer.id);
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch servers';
      servers.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const selectServer = async (serverId: string) => {
    error.value = null;
    isLoading.value = true;
    
    try {
      const server = await serverApi.getServerById(serverId);
      if (server.status === 'offline') {
        throw new Error('Cannot connect to offline server');
      }
      selectedServer.value = serverId;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to connect to server';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const flushPages = async (serverId: string) => {
    if (!serverId) return;
    
    error.value = null;
    isLoading.value = true;
    
    try {
      await serverApi.flushPages(serverId);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to flush pages';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    servers,
    selectedServer,
    isLoading,
    error,
    fetchServers,
    selectServer,
    flushPages
  };
});