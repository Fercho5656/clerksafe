<template>
  <DropdownMenu>
    <div class="flex flex-col p-2">
      <button @click="downloadFile" class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
        Download
      </button>
      <button v-if="isMyOwnFile" @click="deleteFile"
        class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
        Delete
      </button>
      <button v-if="isMyOwnFile" @click="shareFile"
        class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
        Share
      </button>
    </div>
  </DropdownMenu>
</template>

<script setup lang="ts">
import DropdownMenu from '@/components/ui/DropdownMenu.vue';
import { $shareModal, $shareFile } from '@/store/share';

interface Props {
  file: {
    id: string;
    object_path: string;
    file_name: string;
  };
  isMyOwnFile?: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(['file-deleted']);

async function downloadFile() {
  try {
    const response = await fetch(`/api/files/${props.file.id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = props.file.file_name;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

async function deleteFile() {
  try {
    const response = await fetch(`/api/files`, {
      method: 'DELETE',
      body: JSON.stringify({ fileName: props.file.file_name }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    console.log('File deleted:', props.file.file_name);
    emits('file-deleted', props.file.file_name);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

function shareFile() {
  $shareFile.set({
    fileId: props.file.id,
    fileName: props.file.object_path,
    name: props.file.file_name,
  });
  $shareModal.set(true);
}

</script>