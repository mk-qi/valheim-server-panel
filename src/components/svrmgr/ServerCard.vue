<script setup lang="ts">
import { ref } from 'vue';
import { useServerStore } from '../../stores/server';
import { serverApi } from '../../utils/api';
import type { Server } from '../../types';

const props = defineProps<{
  server: Server;
}>();

const serverStore = useServerStore();
const showEditModal = ref(false);
const editForm = ref({
  name: props.server.name,
  address: props.server.address,
  maxPlayers: props.server.maxPlayers,
  version: props.server.version
});

const isEditing = ref(false);
const error = ref<string | null>(null);

const handleSubmit = async () => {
  if (isEditing.value) return;
  
  isEditing.value = true;
  error.value = null;
  
  try {
    await serverApi.updateServer(props.server.id, editForm.value);
    await serverStore.fetchServers();
    showEditModal.value = false;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to update server';
  } finally {
    isEditing.value = false;
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 space-y-4">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ server.name }}</h3>
        <p class="text-sm text-gray-500">{{ server.address }}</p>
      </div>
      <span 
        :class="[
          'px-2 py-1 text-xs font-medium rounded-full',
          server.status === 'online' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        ]"
      >
        {{ server.status }}
      </span>
    </div>

    <div class="grid grid-cols-2 gap-4 text-sm">
      <div class="space-y-1">
        <p class="text-gray-500">Players</p>
        <p class="font-medium">{{ server.players }}/{{ server.maxPlayers }}</p>
      </div>
      <div class="space-y-1">
        <p class="text-gray-500">Version</p>
        <p class="font-medium">{{ server.version }}</p>
      </div>
    </div>

    <div class="flex gap-2">
      <button 
        class="flex-1 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
        @click="showEditModal = true"
      >
        Edit
      </button>
      <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
      </button>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showEditModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Edit Server</h3>
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="showEditModal = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Server Name
            </label>
            <input
              v-model="editForm.name"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              v-model="editForm.address"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Max Players
            </label>
            <input
              v-model="editForm.maxPlayers"
              type="number"
              min="1"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            <input
              v-model="editForm.version"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div 
            v-if="error"
            class="bg-red-50 text-red-700 p-3 rounded-lg text-sm"
          >
            {{ error }}
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
              @click="showEditModal = false"
              :disabled="isEditing"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              :disabled="isEditing"
            >
              <svg
                v-if="isEditing"
                class="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isEditing ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>