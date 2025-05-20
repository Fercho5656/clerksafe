<template>
  <div class="fixed bottom-8 right-8">
    <button
      class="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center cursor-pointer transition hover:shadow-lg hover:scale-110 transform duration-200 ease-in-out"
      @click="openDialog">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      <span class="ml-2 text-xl">Upload File</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { $uploadFileModal } from '@/store/files'


const openDialog = () => {
  $uploadFileModal.set(true)
  console.log('Upload button clicked')
}
</script>