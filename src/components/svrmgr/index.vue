<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useServerStore } from '../../stores/server';
import StatusBar from './StatusBar.vue';
import ControlPanel from './ControlPanel.vue';
import NavigationTabs from './NavigationTabs.vue';
import type { ServerStatus } from '../../types';

const serverStore = useServerStore();
const serverStatus = ref<ServerStatus>({
  isActive: true,
  startTime: new Date().toISOString()
});

onMounted(async () => {
  try {
    await serverStore.fetchServers();
  } catch (error) {
    console.error('Failed to fetch servers:', error);
  }
});
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <StatusBar :status="serverStatus" />
      <ControlPanel />
    </div>
    <NavigationTabs />
    <slot></slot>
  </div>
</template>