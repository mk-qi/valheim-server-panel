<script setup lang="ts">
defineProps<{
  content: string;
  readonly?: boolean;
}>();

defineEmits<{
  (e: 'update:content', value: string): void;
}>();
</script>

<template>
  <div class="font-mono text-sm bg-white">
    <textarea
      :value="content"
      :readonly="readonly"
      @input="$emit('update:content', ($event.target as HTMLTextAreaElement).value)"
      class="w-full h-[600px] p-4 font-mono text-sm resize-none focus:outline-none"
      :class="{
        'bg-gray-50': readonly
      }"
    ></textarea>
  </div>
</template>