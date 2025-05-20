<template>
  <article class="flex flex-col bg-gray-800 text-gray-300 shadow-md rounded-lg p-4 aspect-square">
    <header class="flex w-full justify-ender">
      <FileDropdown :file="file" :is-my-own-file class="ml-auto" @file-deleted="handleDelete" />
    </header>
    <img :src="props.file.thumbnail || genericThumbnail" alt="File Preview"
      class="w-64 h-auto object-cover rounded-xs" />
    <footer class="mt-2">
      <h3 class="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
        {{ props.file.file_name }}
      </h3>
      <p class="">
        {{ formatBytes(props.file.size) }} •
        {{ new Date(props.file.created_at).toLocaleDateString() }}
      </p>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { formatBytes } from '@/lib/string'
import FileDropdown from './FileDropdown.vue'
import type { File } from '@/models/file'

const genericThumbnail = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC'

interface Props {
  file: File
  isMyOwnFile?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['file-deleted'])

const handleDelete = () => {
  emit('file-deleted', props.file.file_name)
}
</script>