<template>
  <div class="p-5 grid grid-cols-3 md:grid-cols-5 xl:grid-cols-8 grid-rows-5 gap-5">
    <File v-for="file in fileArray" :key="file.id" :file="file" @file-deleted="removeFile"
      :is-my-own-file="props.isMyOwnFile" />
  </div>
</template>

<script setup lang="ts">
import File from '@/components/File.vue'
import { $newFile } from '@/store/files'
import { ref } from 'vue'

interface Props {
  files: Record<string, any>[]
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