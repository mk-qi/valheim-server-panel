export interface User {
  name: string;
  avatar: string;
  status?: 'online' | 'offline';
  role?: 'admin' | 'moderator' | 'user';
}