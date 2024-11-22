export interface Mod {
  id: string;
  title: string;
  name: string;
  description: string;
  imageUrl?: string;
  version: string;
  author: string;
  enabled?: boolean;
  configurable?: boolean;
  dependencies: string[];
  lastUpdated: string;
}
