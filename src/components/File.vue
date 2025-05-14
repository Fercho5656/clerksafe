<template>
  <article class="flex flex-col bg-white shadow-md rounded-lg p-4 aspect-square">
    <img :src="props.file.metadata.thumbnail || genericThumbnail" alt="File Preview"
      class="w-64 h-auto object-cover rounded-xs" />
    <footer class="mt-2">
      <h3 class="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
        {{ props.file.name }}
      </h3>
      <p class="text-gray-600">
        {{ formatBytes(props.file.metadata.size) }} •
        {{ new Date(props.file.created_at).toLocaleDateString() }}
      </p>
    </footer>
    <nav class="flex justify-evenly" :data-file-name="props.file.name">
      <button @click="downloadFile(props.file.name)"
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors duration-100"
        aria-label="Download file">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-download-icon lucide-download">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      </button>
      <button @click="deleteFile(props.file.name)" data-delete-button
        class="mt-2 px-4 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 transition-colors duration-100"
        aria-label="Delete file">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-trash-icon lucide-trash">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
      <button
        class="mt-2 px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 transition-colors duration-100"
        aria-label="Share file">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-share2-icon lucide-share-2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
      </button>
    </nav>
  </article>
</template>

<script setup lang="ts">
import { formatBytes } from '@/lib/string'
import Download from '@/icons/download.svg'
import Share from '@/icons/share.svg'
import Delete from '@/icons/delete.svg'
import type FileObject from '@supabase/supabase-js'

const genericThumbnail = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC'

interface File {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: Record<string, any>
}

interface Props {
  file: File
}

const props = defineProps<Props>()
const emit = defineEmits(['file-deleted'])

async function downloadFile(fileName: string) {
  try {
    const response = await fetch(`/api/files/${fileName}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const { data } = await response.json()

    const a = document.createElement('a')
    a.href = data.signedUrl
    a.download = fileName
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    console.log({ a })
    a.click()
    a.remove()
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

async function deleteFile(fileName: string) {
  console.log('Deleting file:', fileName)
  try {
    const response = await fetch(`/api/files`, {
      method: 'DELETE',
      body: JSON.stringify({ fileName }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const result = await response.json()
    console.log('File deleted successfully:', result)
    emit('file-deleted', fileName)
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}
</script>