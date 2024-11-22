import { createServer } from 'miragejs';
import type { Server, Mod, ModConfig, ConsoleLog, ServerCommand } from '../src/types';
import { mockData } from './data';

export function makeServer() {
  return createServer({
    routes() {
      this.namespace = 'api';
      this.timing = 750;

      // Server endpoints
      this.get('/servers', () => {
        return {
          code: 0,
          data: mockData.servers,
          message: 'Success'
        };
      });

      this.get('/servers/:id', (schema, request) => {
        const server = mockData.servers.find(s => s.id === request.params.id);
        if (!server) {
          return {
            code: 404,
            data: null,
            message: 'Server not found'
          };
        }
        return {
          code: 0,
          data: server,
          message: 'Success'
        };
      });

      this.put('/servers/:id', (schema, request) => {
        const serverId = request.params.id;
        const data = JSON.parse(request.requestBody);
        const serverIndex = mockData.servers.findIndex(s => s.id === serverId);
        
        if (serverIndex === -1) {
          return {
            code: 404,
            data: null,
            message: 'Server not found'
          };
        }

        mockData.servers[serverIndex] = {
          ...mockData.servers[serverIndex],
          ...data,
          lastPing: Date.now()
        };

        return {
          code: 0,
          data: mockData.servers[serverIndex],
          message: 'Server updated successfully'
        };
      });

      this.post('/servers/:id/flush-pages', (schema, request) => {
        const server = mockData.servers.find(s => s.id === request.params.id);
        if (!server) {
          return {
            code: 404,
            data: null,
            message: 'Server not found'
          };
        }

        return {
          code: 0,
          data: null,
          message: 'Pages flushed successfully'
        };
      });

      // Mod endpoints
      this.get('/servers/:serverId/mods', (schema, request) => {
        const server = mockData.servers.find(s => s.id === request.params.serverId);
        if (!server) {
          return {
            code: 404,
            data: null,
            message: 'Server not found'
          };
        }
        return {
          code: 0,
          data: mockData.mods,
          message: 'Success'
        };
      });

      // Config endpoints
      this.get('/servers/:serverId/mods/configs', (schema, request) => {
        const server = mockData.servers.find(s => s.id === request.params.serverId);
        if (!server) {
          return {
            code: 404,
            data: null,
            message: 'Server not found'
          };
        }
        return {
          code: 0,
          data: mockData.configs,
          message: 'Success'
        };
      });

      this.get('/servers/:serverId/mods/:modId/config', (schema, request) => {
        const { serverId, modId } = request.params;
        const server = mockData.servers.find(s => s.id === serverId);
        if (!server) {
          return {
            code: 404,
            data: null,
            message: 'Server not found'
          };
        }

        const config = mockData.configs.find(c => c.modId === modId);
        if (!config) {
          return {
            code: 404,
            data: null,
            message: 'Config not found'
          };
        }

        return {
          code: 0,
          data: config,
          message: 'Success'
        };
      });

      this.put('/servers/:serverId/mods/:modId/config', (schema, request) => {
        const { serverId, modId } = request.params;
        const data = JSON.parse(request.requestBody);
        
        const server = mockData.servers.find(s => s.id === serverId);
        if (!server) {
          return {
            code: 404,
            data: null,
            message: 'Server not found'
          };
        }

        const configIndex = mockData.configs.findIndex(c => c.modId === modId);
        if (configIndex === -1) {
          return {
            code: 404,
            data: null,
            message: 'Config not found'
          };
        }

        const updatedConfig = {
          ...mockData.configs[configIndex],
          content: data.content,
          lastModified: new Date().toISOString()
        };

        mockData.configs[configIndex] = updatedConfig;

        return {
          code: 0,
          data: updatedConfig,
          message: 'Config updated successfully'
        };
      });

      // Console endpoints
      this.get('/servers/:serverId/logs', (schema, request) => {
        const server = mockData.servers.find(s => s.id === request.params.serverId);
        if (!server) {
          return {
            code: 404,
            data: null,
            message: 'Server not found'
          };
        }

        const limit = parseInt(request.queryParams.limit) || mockData.logs.length;
        const logs = mockData.logs.slice(-limit);

        return {
          code: 0,
          data: logs,
          message: 'Success'
        };
      });

      this.post('/servers/:serverId/execute', (schema, request) => {
        const server = mockData.servers.find(s => s.id === request.params.serverId);
        if (!server) {
          return {
            code: 404,
            data: null,
            message: 'Server not found'
          };
        }

        const { command } = JSON.parse(request.requestBody);
        const response: ServerCommand = {
          id: `cmd-${Date.now()}`,
          command,
          timestamp: new Date().toISOString(),
          status: 'success',
          response: `Executed command: ${command}`
        };

        mockData.logs.push({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `> ${command}`,
          source: 'user'
        });

        mockData.logs.push({
          id: `log-${Date.now() + 1}`,
          timestamp: new Date().toISOString(),
          level: 'info',
          message: response.response,
          source: 'system'
        });

        return {
          code: 0,
          data: response,
          message: 'Command executed successfully'
        };
      });
    }
  });
}