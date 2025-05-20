<template>
  <Dialog :showModal="showModal" title="Upload Files" @update:showModal="closeModal">
    <FileUpload />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '@/components/ui/Dialog.vue'
import FileUpload from './FileUpload.vue'
import { useStore } from '@nanostores/vue'
import { $uploadFileModal } from '@/store/files'


const showModal = useStore($uploadFileModal)
const closeModal = () => {
  $uploadFileModal.set(false)
}
</script>