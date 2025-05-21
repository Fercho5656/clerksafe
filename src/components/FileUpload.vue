<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 max-w-md p-6 bg-gray-800 shadow-md rounded-lg">
    <h2 class="text-xl font-semibold text-white">Upload New File</h2>

    <div>
      <label for="input-files" class="block text-sm font-medium text-gray-300 mb-1">
        Select a file
      </label>
      <input ref="fileInput" type="file" id="input-files" name="input-files"
        class="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        multiple required />
    </div>

    <button type="submit"
      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      Upload
    </button>
  </form>
</template>

<script setup lang="ts">
import { toast } from '@pheralb/toast'
import { $newFile } from '@/store/files'
import { $uploadFileModal } from '@/store/files'
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const actionUrl = '/api/files'
const method = 'POST'

const handleSubmit = async () => {
  const files = Array.from(fileInput.value?.files || [])
  const formData = new FormData()

  for (const file of files) {
    formData.append('input-files', file)
  }

  try {
    const response = await fetch(actionUrl, {
      method,
      body: formData
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const result = await response.json()
    $newFile.set(result.data)
    $uploadFileModal.set(false)
    toast.success({
      text: "Files uploaded successfully",
    });
  } catch (e) {
    console.error('Error uploading files:', e)
    toast.error({
      text: "Error uploading files",
    });
  }
}
</script>
