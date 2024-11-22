export interface Server {
  id: string;
  name: string;
  address: string;
  status: 'online' | 'offline';
  lastPing?: number;
  players: number;
  maxPlayers: number;
  version: string;
}

// Server Status Type
export interface ServerStatus {
  isActive: boolean;
  startTime: string;
}