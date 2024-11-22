import { request } from './request';
import type { Server, Mod, ModConfig, ConsoleLog, ServerCommand } from '../types';

// Server endpoints
export const serverApi = {
  async getServers() {
    return request.get<Server[]>('/servers');
  },

  async getServerById(id: string) {
    return request.get<Server>(`/servers/${id}`);
  },

  async updateServer(id: string, data: Partial<Server>) {
    return request.put<Server>(`/servers/${id}`, data);
  },

  async flushPages(id: string) {
    return request.post<void>(`/servers/${id}/flush-pages`);
  }
};

// Mod endpoints
export const modApi = {
  async getMods(serverId: string) {
    return request.get<Mod[]>(`/servers/${serverId}/mods`);
  },

  async getModConfig(serverId: string, modId: string) {
    return request.get<ModConfig>(`/servers/${serverId}/mods/${modId}/config`);
  },

  async updateModConfig(serverId: string, modId: string, content: string) {
    return request.put<ModConfig>(`/servers/${serverId}/mods/${modId}/config`, { content });
  }
};

// Console endpoints
export const consoleApi = {
  async getLogs(serverId: string, params?: { limit?: number; offset?: number }) {
    return request.get<ConsoleLog[]>(`/servers/${serverId}/logs`, { params });
  },

  async executeCommand(serverId: string, command: string) {
    return request.post<ServerCommand>(`/servers/${serverId}/execute`, { command });
  }
};