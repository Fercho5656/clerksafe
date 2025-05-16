<template>
  <article class="flex flex-col bg-white shadow-md rounded-lg p-4 aspect-square">
    <img :src="props.file.thumbnail || genericThumbnail" alt="File Preview"
      class="w-64 h-auto object-cover rounded-xs" />
    <footer class="mt-2">
      <h3 class="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
        {{ props.file.file_name }}
      </h3>
      <p class="text-gray-600">
        {{ formatBytes(125) }} •
        {{ new Date(props.file.created_at).toLocaleDateString() }}
      </p>
    </footer>
    <nav class="flex justify-evenly" :data-file-name="props.file.object_path">
      <button @click="downloadFile(props.file.file_name)"
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
      <button @click="deleteFile(props.file.file_name)" data-delete-button
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
      <button @click="handleShareClick"
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
import { $shareModal, $shareFile } from '@/store/share'

const genericThumbnail = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC'

interface File {
  id: string
  object_path: string
  bucket_name: string
  thumbnail: string
  created_at: string
  file_name: string
}

interface Props {
  file: File
}

const props = defineProps<Props>()
const emit = defineEmits(['file-deleted'])

async function downloadFile(fileName: string) {
  try {
    const response = await fetch(`/api/files/${fileName}`)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const blob = await response.blob()

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

async function deleteFile(fileName: string) {
  try {
    const response = await fetch(`/api/files`, {
      method: 'DELETE',
      body: JSON.stringify({ fileName }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const result = await response.json()
    emit('file-deleted', fileName)
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

const handleShareClick = () => {
  console.log('Sharing file: ', props.file.id)
  $shareFile.set({
    fileId: props.file.id,
    fileName: props.file.object_path,
  })
  $shareModal.set(true)
}
</script>