<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useServerStore } from '../../stores/server';
import { request } from '../../utils/request';
import FileTree from './FileTree.vue';
import CodeEditor from './CodeEditor.vue';
import type { ModConfig } from '../../types';

const serverStore = useServerStore();

const currentFile = ref<string>('');
const editedContent = ref<string>('');
const hasChanges = ref(false);
const isSaving = ref(false);
const error = ref<string | null>(null);
const configs = ref<ModConfig[]>([]);
const isLoading = ref(false);

const fetchConfigs = async () => {
  if (!serverStore.selectedServer) {
    error.value = 'Please select a server first';
    return;
  }

  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await request.get<ModConfig[]>(`/servers/${serverStore.selectedServer}/mods/configs`);
    configs.value = response;
    
    if (configs.value.length > 0 && !currentFile.value) {
      await loadConfig(configs.value[0].modId);
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch configs';
    console.error('Failed to fetch configs:', e);
  } finally {
    isLoading.value = false;
  }
};

const loadConfig = async (modId: string) => {
  if (!modId || !serverStore.selectedServer) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const config = await request.get<ModConfig>(`/servers/${serverStore.selectedServer}/mods/${modId}/config`);
    currentFile.value = modId;
    editedContent.value = config.content;
    hasChanges.value = false;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load config';
    console.error('Failed to load config:', e);
  } finally {
    isLoading.value = false;
  }
};

const handleContentChange = (newContent: string) => {
  editedContent.value = newContent;
  hasChanges.value = true;
};

const saveChanges = async () => {
  if (!currentFile.value || !hasChanges.value || !serverStore.selectedServer) return;
  
  isSaving.value = true;
  error.value = null;
  
  try {
    await request.put(`/servers/${serverStore.selectedServer}/mods/${currentFile.value}/config`, {
      content: editedContent.value
    });
    hasChanges.value = false;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save changes';
    console.error('Failed to save changes:', e);
  } finally {
    isSaving.value = false;
  }
};

const handleFileSelect = async (modId: string) => {
  if (hasChanges.value) {
    if (confirm('You have unsaved changes. Do you want to discard them?')) {
      await loadConfig(modId);
    }
  } else {
    await loadConfig(modId);
  }
};

// Watch for server changes and fetch configs when server changes
watch(() => serverStore.selectedServer, (newServer) => {
  if (newServer) {
    currentFile.value = '';
    editedContent.value = '';
    hasChanges.value = false;
    fetchConfigs();
  } else {
    configs.value = [];
    currentFile.value = '';
    editedContent.value = '';
    hasChanges.value = false;
    error.value = null;
  }
});

onMounted(() => {
  if (serverStore.selectedServer) {
    fetchConfigs();
  }
});
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <div class="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
      <h2 class="text-xl font-semibold">Mod CFG Editor</h2>
      <div class="flex items-center gap-2">
        <span v-if="error" class="text-sm bg-red-500 px-2 py-1 rounded">
          {{ error }}
        </span>
        <span v-if="hasChanges" class="text-sm bg-yellow-500 px-2 py-1 rounded">
          Unsaved changes
        </span>
        <button
          class="px-4 py-1 bg-green-500 hover:bg-green-600 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasChanges || isSaving"
          @click="saveChanges"
        >
          <svg
            v-if="isSaving"
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
          <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
        </button>
      </div>
    </div>
    <div class="flex">
      <div class="w-1/4 border-r">
        <FileTree
          :configs="configs"
          :selected-file="currentFile"
          @select="handleFileSelect"
        />
      </div>
      <div class="w-3/4">
        <div class="bg-gray-700 text-white p-2 flex items-center gap-2">
          <button class="bg-gray-600 px-3 py-1 rounded">File</button>
          <span class="text-sm">
            {{ configs.find(c => c.modId === currentFile)?.name || 'No file selected' }}
          </span>
        </div>
        <div v-if="isLoading" class="h-[600px] flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <CodeEditor
          v-else-if="currentFile"
          :content="editedContent"
          :readonly="isSaving"
          @update:content="handleContentChange"
        />
        <div
          v-else
          class="h-[600px] flex items-center justify-center text-gray-500"
        >
          {{ error || (!serverStore.selectedServer ? 'Select a server first' : 'Select a file to edit') }}
        </div>
      </div>
    </div>
  </div>
</template>