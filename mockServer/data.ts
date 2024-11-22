import type { Server, Mod, ModConfig, ConsoleLog } from '../src/types';

// Helper function to generate random server data
function generateServers(count: number): Server[] {
  const statuses: ('online' | 'offline')[] = ['online', 'offline'];
  const versions = ['1.2.3', '1.2.4', '1.3.0-beta', '1.3.0', '1.2.5-rc1'];
  const serverTypes = ['Production', 'Development', 'Testing', 'Staging', 'QA'];
  const regions = ['US', 'EU', 'AP', 'JP', 'AU'];

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const maxPlayers = [10, 20, 30, 50, 100][Math.floor(Math.random() * 5)];
    const players = status === 'online' ? Math.floor(Math.random() * maxPlayers) : 0;
    const region = regions[Math.floor(Math.random() * regions.length)];
    const type = serverTypes[Math.floor(Math.random() * serverTypes.length)];
    const version = versions[Math.floor(Math.random() * versions.length)];

    return {
      id: `srv-${(i + 1).toString().padStart(3, '0')}`,
      name: `${region} ${type} Server ${i + 1}`,
      address: `${region.toLowerCase()}-${i + 1}.gameserver.com:${2456 + i}`,
      status,
      lastPing: status === 'online' ? Date.now() - Math.floor(Math.random() * 300000) : undefined,
      players,
      maxPlayers,
      version
    };
  });
}

// Generate mock data
export const mockData = {
  servers: generateServers(100),
  mods: [
    {
      id: 'mod-001',
      name: 'CLLC',
      title: 'Creature Level and Loot Control',
      description: 'Puts YOU in control of creature level and loot!',
      version: '1.0.0',
      author: 'Author1',
      enabled: true,
      configurable: true,
      dependencies: [],
      lastUpdated: '2024-02-20',
      imageUrl: null
    },
    {
      id: 'mod-002',
      name: 'EpicLoot',
      title: 'Epic Loot',
      description: 'Adds loot drops, magic items, and enchanting.',
      version: '2.0.0',
      author: 'Author2',
      enabled: true,
      configurable: true,
      dependencies: [],
      lastUpdated: '2024-02-20',
      imageUrl: null
    }
  ] as Mod[],
  configs: [
    {
      id: 'cfg-001',
      modId: 'mod-001',
      name: 'CLLC',
      content: `[General]
enabled=true
debugMode=false

[Creatures]
levelMin=1
levelMax=10
bossLevelMultiplier=2`,
      lastModified: '2024-02-20T12:00:00Z'
    },
    {
      id: 'cfg-002',
      modId: 'mod-002',
      name: 'Epic Loot',
      content: `[General]
enabled=true
debugMode=false

[Loot]
dropChance=0.25
magicItemChance=0.6
rareItemChance=0.3
legendaryItemChance=0.1`,
      lastModified: '2024-02-19T16:00:00Z'
    }
  ] as ModConfig[],
  logs: [
    {
      id: 'log-001',
      timestamp: '2024-02-20T10:00:00Z',
      level: 'info',
      message: 'Server started successfully',
      source: 'system'
    },
    {
      id: 'log-002',
      timestamp: '2024-02-20T10:00:01Z',
      level: 'info',
      message: 'Loading world data...',
      source: 'system'
    }
  ] as ConsoleLog[]
};