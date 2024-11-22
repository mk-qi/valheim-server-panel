export interface ConsoleLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

export interface ServerCommand {
  id: string;
  command: string;
  timestamp: string;
  status: 'pending' | 'success' | 'error';
  response?: string;
}