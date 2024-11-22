<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '../../types/user';

const users = ref<User[]>([
  {
    name: 'Admin User',
    avatar: '',
    status: 'online',
    role: 'admin'
  },
  {
    name: 'John Doe',
    avatar: '',
    status: 'offline',
    role: 'moderator'
  },
  {
    name: 'Jane Smith',
    avatar: '',
    status: 'offline',
    role: 'user'
  }
]);
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg">
    <div class="p-4 border-b">
      <h2 class="text-lg font-semibold">Online Users</h2>
    </div>
    <div class="divide-y">
      <div
        v-for="user in users"
        :key="user.name"
        class="p-4 flex items-center justify-between hover:bg-gray-50"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <img
              v-if="user.avatar"
              :src="user.avatar"
              :alt="user.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6 text-gray-400"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <div class="font-medium">{{ user.name }}</div>
            <div class="text-sm text-gray-500">{{ user.role }}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span
            :class="[
              'px-2 py-1 text-xs rounded-full',
              user.status === 'online'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ user.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>