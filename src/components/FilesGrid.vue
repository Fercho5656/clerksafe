<template>
  <div class="p-5 grid grid-cols-3 md:grid-cols-5 xl:grid-cols-8 grid-rows-5 gap-5">
    <File v-for="file in fileArray" :key="file.id" :file="file" @file-deleted="removeFile" />
  </div>
</template>

<script setup lang="ts">
import File from '@/components/File.vue'
import type FileObject from '@supabase/supabase-js'
import { ref } from 'vue'

interface Props {
  files: Record<string, any>[]
}

const props = defineProps<Props>()

const fileArray = ref(props.files)

const removeFile = (fileName: string) => {
  fileArray.value = fileArray.value.filter((file) => file.name !== fileName)
}
</script>