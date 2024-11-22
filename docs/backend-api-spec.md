# Server Panel Backend API Development Specification

## Overview

This document provides technical specifications for implementing the Server Panel backend API. The API follows RESTful principles and uses JSON for data exchange.

## Technical Requirements

- Base URL: `http://blog.oozk.com:8000/api`
- Protocol: HTTPS
- Content-Type: application/json
- Authentication: JWT Bearer token
- Response Format: Standard JSON envelope

## Standard Response Format

All API responses must follow this format:

```typescript
{
  code: number;    // 0 for success, non-zero for errors
  data: T | null;  // Response payload or null for errors
  message: string; // Success/error message
}
```

## Authentication

### Requirements
- All endpoints require JWT authentication
- Token format: `Bearer <token>`
- Token expiration: 24 hours
- Token refresh mechanism required

### Headers
```
Authorization: Bearer <token>
```

## API Endpoints Implementation Guide

### 1. Server Management

#### GET /servers
Returns list of game servers.

```typescript
interface ServerResponse {
  servers: Array<{
    id: string;          // Unique server identifier
    name: string;        // Display name
    address: string;     // IP:Port format
    status: string;      // 'online' | 'offline'
    lastPing?: number;   // Unix timestamp
    players: number;     // Current player count
    maxPlayers: number;  // Maximum allowed players
    version: string;     // Server version
  }>;
}
```

**Implementation Notes:**
- Cache server list with 30s TTL
- Include real-time status monitoring
- Implement server health checks
- Handle server timeouts gracefully

#### POST /servers/:serverId/flush-pages
Flushes server cache pages.

**Implementation Requirements:**
- Validate server exists and is online
- Implement proper locking mechanism
- Log flush operations
- Handle timeout scenarios

### 2. Mod Configuration

#### GET /servers/:serverId/mods/configs
Returns all mod configurations for a server.

```typescript
interface ModConfig {
  id: string;         // Config identifier
  modId: string;      // Associated mod ID
  name: string;       // Display name
  content: string;    // Configuration content
  lastModified: string; // ISO 8601 timestamp
}
```

**Implementation Notes:**
- Validate file permissions
- Implement file locking
- Cache configurations with versioning
- Handle large config files

#### PUT /servers/:serverId/mods/:modId/config
Updates mod configuration.

**Request Validation:**
- Validate config syntax
- Check file size limits
- Verify mod compatibility
- Backup existing config

### 3. Console Management

#### GET /servers/:serverId/logs
Retrieves server console logs.

```typescript
interface ConsoleLog {
  id: string;
  timestamp: string;   // ISO 8601
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}
```

**Implementation Requirements:**
- Implement log rotation
- Support pagination
- Real-time log streaming
- Log level filtering

#### POST /servers/:serverId/execute
Executes console commands.

```typescript
interface CommandExecution {
  command: string;     // Command to execute
  timeout?: number;    // Execution timeout
}
```

**Security Requirements:**
- Command whitelist
- Rate limiting
- Command validation
- Execution timeout

## Error Handling

### Standard Error Codes
```typescript
enum ErrorCode {
  SUCCESS = 0,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}
```

### Error Response Format
```typescript
interface ErrorResponse {
  code: number;
  message: string;
  details?: {
    field?: string;
    reason?: string;
  }[];
}
```

### Implementation Requirements
1. Use consistent error codes
2. Provide detailed error messages
3. Include validation errors
4. Log all errors with stack traces

## Security Requirements

### Authentication & Authorization
1. Implement JWT validation
2. Role-based access control
3. Rate limiting per endpoint
4. IP whitelisting support

### Data Validation
1. Sanitize all inputs
2. Validate request parameters
3. Check file content types
4. Implement request size limits

### Server Security
1. HTTPS only
2. CORS configuration
3. Security headers
4. Request throttling

## Performance Considerations

### Caching Strategy
1. Implement Redis caching
2. Cache server status
3. Cache mod configurations
4. Use ETags for resources

### Database Optimization
1. Index frequently queried fields
2. Implement query optimization
3. Use connection pooling
4. Monitor query performance

### Rate Limiting
```typescript
interface RateLimit {
  window: number;     // Time window in seconds
  max: number;        // Maximum requests per window
  user: boolean;      // Per-user or per-IP
}
```

## Monitoring & Logging

### Required Metrics
1. Request response times
2. Error rates
3. Server status changes
4. Command execution times

### Log Format
```typescript
interface LogEntry {
  timestamp: string;
  level: string;
  category: string;
  message: string;
  metadata: Record<string, any>;
}
```

## Development Guidelines

### Code Organization
1. Use modular architecture
2. Implement service layer
3. Separate business logic
4. Use dependency injection

### Testing Requirements
1. Unit tests for all endpoints
2. Integration tests
3. Load testing
4. Security testing

### Documentation
1. OpenAPI/Swagger specs
2. Inline code documentation
3. Setup instructions
4. Deployment guide

## Deployment

### Requirements
1. Docker support
2. Environment configuration
3. Health check endpoints
4. Backup strategy

### Configuration
```typescript
interface ServerConfig {
  port: number;
  dbConnection: string;
  jwtSecret: string;
  corsOrigins: string[];
  logLevel: string;
}
```