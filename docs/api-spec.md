# Server Panel API Specification

## Base Configuration

```typescript
interface ApiResponse<T = any> {
  code: number;    // 0 for success, non-zero for errors
  data: T;        // Response payload
  message: string; // Status message
}
```

## Authentication

All endpoints require JWT authentication:
```
Authorization: Bearer <token>
```

## API Endpoints

### 1. Server Management

#### GET /api/servers
Retrieves list of all game servers.

**Response:**
```typescript
interface ServerListResponse {
  servers: Array<{
    id: string;
    name: string;
    address: string;
    status: 'online' | 'offline';
    lastPing?: number;
    players: number;
    maxPlayers: number;
    version: string;
    resources?: {
      cpu: number;    // CPU usage percentage
      memory: number; // Memory usage in MB
      disk: number;   // Disk usage in GB
    };
  }>;
}
```

#### GET /api/servers/:id
Get details for a specific server.

**Response:** Same as single server object from GET /servers

#### PUT /api/servers/:id
Update server configuration.

**Request Body:**
```typescript
interface UpdateServerRequest {
  name?: string;
  address?: string;
  maxPlayers?: number;
  version?: string;
  settings?: {
    autoRestart: boolean;
    backupEnabled: boolean;
    backupInterval: number;
  };
}
```

#### POST /api/servers/:id/start
Start a server.

#### POST /api/servers/:id/stop
Stop a server.

#### POST /api/servers/:id/restart
Restart a server.

#### POST /api/servers/:id/flush-pages
Flush server cache pages.

### 2. Mod Management

#### GET /api/servers/:serverId/mods
Get all mods for a server.

**Response:**
```typescript
interface ModListResponse {
  mods: Array<{
    id: string;
    name: string;
    title: string;
    description: string;
    version: string;
    author: string;
    enabled: boolean;
    configurable: boolean;
    dependencies: string[];
    lastUpdated: string;
    imageUrl: string | null;
  }>;
}
```

#### GET /api/servers/:serverId/mods/:modId
Get specific mod details.

#### PUT /api/servers/:serverId/mods/:modId
Update mod settings.

**Request Body:**
```typescript
interface UpdateModRequest {
  enabled?: boolean;
  version?: string;
  settings?: Record<string, any>;
}
```

### 3. Configuration Management

#### GET /api/servers/:serverId/mods/configs
Get all mod configurations.

**Response:**
```typescript
interface ModConfigListResponse {
  configs: Array<{
    id: string;
    modId: string;
    name: string;
    content: string;
    lastModified: string;
  }>;
}
```

#### GET /api/servers/:serverId/mods/:modId/config
Get specific mod configuration.

#### PUT /api/servers/:serverId/mods/:modId/config
Update mod configuration.

**Request Body:**
```typescript
interface UpdateConfigRequest {
  content: string;
}
```

### 4. Console Management

#### GET /api/servers/:serverId/logs
Get server console logs.

**Query Parameters:**
- limit?: number (default: 100)
- offset?: number (default: 0)
- level?: 'info' | 'warning' | 'error'

**Response:**
```typescript
interface ConsoleLogResponse {
  logs: Array<{
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    source: string;
  }>;
  total: number;
}
```

#### POST /api/servers/:serverId/execute
Execute console command.

**Request Body:**
```typescript
interface ExecuteCommandRequest {
  command: string;
}
```

**Response:**
```typescript
interface CommandResponse {
  id: string;
  command: string;
  timestamp: string;
  status: 'pending' | 'success' | 'error';
  response?: string;
}
```

### 5. Backup Management

#### GET /api/servers/:serverId/backups
List server backups.

**Response:**
```typescript
interface BackupListResponse {
  backups: Array<{
    id: string;
    timestamp: string;
    size: number;
    type: 'full' | 'incremental';
    status: 'completed' | 'failed';
  }>;
}
```

#### POST /api/servers/:serverId/backups
Create new backup.

#### GET /api/servers/:serverId/backups/:backupId
Get backup details.

#### POST /api/servers/:serverId/backups/:backupId/restore
Restore from backup.

### 6. User Management

#### GET /api/users
List users with access to servers.

**Response:**
```typescript
interface UserListResponse {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'moderator' | 'user';
    status: 'active' | 'inactive';
    lastLogin?: string;
  }>;
}
```

## Error Codes

```typescript
enum ErrorCode {
  SUCCESS = 0,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  SERVER_ERROR = 500,
  
  // Custom error codes
  SERVER_OFFLINE = 1001,
  MOD_CONFLICT = 1002,
  BACKUP_IN_PROGRESS = 1003,
  INVALID_COMMAND = 1004
}
```

## WebSocket Events

```typescript
interface WebSocketEvent {
  type: 'log' | 'status' | 'backup' | 'mod';
  serverId: string;
  data: any;
}

// Log event
interface LogEvent extends WebSocketEvent {
  type: 'log';
  data: {
    timestamp: string;
    level: string;
    message: string;
  };
}

// Status event
interface StatusEvent extends WebSocketEvent {
  type: 'status';
  data: {
    status: 'online' | 'offline';
    players: number;
    resources: {
      cpu: number;
      memory: number;
      disk: number;
    };
  };
}
```

## Rate Limiting

- Rate limit: 100 requests per minute per IP
- Burst: 200 requests
- WebSocket connections: 1 per client

## Security Requirements

1. All endpoints must validate:
   - JWT token validity
   - User permissions
   - Input data format
   - Resource ownership

2. Implement:
   - Request throttling
   - IP blocking after failed attempts
   - Audit logging
   - CORS restrictions