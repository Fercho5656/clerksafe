<template>
  <div class="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 grid-rows-auto gap-5">
    <File v-for="file in fileArray" :key="file.id" :file="file" @file-deleted="removeFile"
      :is-my-own-file="props.isMyOwnFile" />
  </div>
</template>

<script setup lang="ts">
import File from '@/components/File.vue'
import type { File as FileType } from '@/models/file'
import { $newFile } from '@/store/files'
import { ref } from 'vue'

interface Props {
  files: FileType[]
  isMyOwnFile?: boolean
}

const props = defineProps<Props>()

const fileArray = ref(props.files)

$newFile.subscribe((newFiles) => {
  if (newFiles.length > 0) {
    const newArray = [...fileArray.value, ...newFiles]
    fileArray.value = newArray
  }
})

const removeFile = (fileName: string) => {
  const newArray = fileArray.value.filter((file) => file.file_name !== fileName)
  fileArray.value = newArray
}
</script>