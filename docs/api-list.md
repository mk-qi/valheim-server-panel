# Server Panel API Documentation

## Base URL
```
http://blog.oozk.com:8000/api
```

## API Endpoints

### 1. Server Management

#### 1.1 Get All Servers
- **URL**: `/servers`
- **Method**: `GET`
- **Response**:
```typescript
{
  code: number;
  data: {
    servers: Array<{
      id: string;
      name: string;
      address: string;
      status: 'online' | 'offline';
      lastPing?: number;
      players: number;
      maxPlayers: number;
      version: string;
    }>;
  };
  message: string;
}
```

#### 1.2 Flush Server Pages
- **URL**: `/servers/:serverId/flush-pages`
- **Method**: `POST`
- **Response**:
```typescript
{
  code: number;
  data: null;
  message: string;
}
```

### 2. Mod Configuration

#### 2.1 Get All Mod Configs
- **URL**: `/servers/:serverId/mods/configs`
- **Method**: `GET`
- **Response**:
```typescript
{
  code: number;
  data: Array<{
    id: string;
    modId: string;
    name: string;
    content: string;
    lastModified: string;
  }>;
  message: string;
}
```

#### 2.2 Get Single Mod Config
- **URL**: `/servers/:serverId/mods/:modId/config`
- **Method**: `GET`
- **Response**:
```typescript
{
  code: number;
  data: {
    id: string;
    modId: string;
    name: string;
    content: string;
    lastModified: string;
  };
  message: string;
}
```

#### 2.3 Update Mod Config
- **URL**: `/servers/:serverId/mods/:modId/config`
- **Method**: `PUT`
- **Request Body**:
```typescript
{
  content: string;
}
```
- **Response**:
```typescript
{
  code: number;
  data: {
    id: string;
    modId: string;
    name: string;
    content: string;
    lastModified: string;
  };
  message: string;
}
```

### 3. Console Management

#### 3.1 Get Console Logs
- **URL**: `/servers/:serverId/logs`
- **Method**: `GET`
- **Query Parameters**:
  - `limit`: number (optional)
  - `offset`: number (optional)
- **Response**:
```typescript
{
  code: number;
  data: Array<{
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    source: string;
  }>;
  message: string;
}
```

#### 3.2 Execute Console Command
- **URL**: `/servers/:serverId/execute`
- **Method**: `POST`
- **Request Body**:
```typescript
{
  command: string;
}
```
- **Response**:
```typescript
{
  code: number;
  data: {
    id: string;
    command: string;
    timestamp: string;
    status: 'pending' | 'success' | 'error';
    response?: string;
  };
  message: string;
}
```

## Error Handling

All API endpoints follow a standard error response format:

```typescript
{
  code: number;    // Non-zero indicates error
  data: null;      // No data on error
  message: string; // Error description
}
```

Common error codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Notes

1. All endpoints require authentication via Bearer token in the Authorization header
2. All timestamps are in ISO 8601 format
3. Server IDs and Mod IDs are unique strings
4. The API implements rate limiting and request throttling
5. All responses are wrapped in a standard format with code, data, and message fields