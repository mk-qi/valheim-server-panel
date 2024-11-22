import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Mod, ModConfig } from '../types';
import { request } from '../utils/request';

export const useModStore = defineStore('mod', () => {
  const mods = ref<Mod[]>([]);
  const configs = ref<ModConfig[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchMods = async (serverId: string) => {
    if (!serverId) {
      error.value = 'Server ID is required';
      return;
    }

    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await request.get<Mod[]>(`/servers/${serverId}/mods`);
      mods.value = response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch mods';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchConfigs = async (serverId: string) => {
    if (!serverId) {
      error.value = 'Server ID is required';
      return;
    }

    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await request.get<ModConfig[]>(`/servers/${serverId}/mods/configs`);
      configs.value = response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch configs';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const updateConfig = async (serverId: string, modId: string, content: string) => {
    if (!serverId || !modId) {
      error.value = 'Server ID and Mod ID are required';
      return;
    }

    isLoading.value = true;
    error.value = null;
    
    try {
      await request.put(`/servers/${serverId}/mods/${modId}/config`, { content });
      await fetchConfigs(serverId);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update config';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    mods,
    configs,
    isLoading,
    error,
    fetchMods,
    fetchConfigs,
    updateConfig
  };
});