<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { $shareModal, $shareFile } from '@/store/share';
import { useStore } from '@nanostores/vue';
import Dialog from '@/components/ui/Dialog.vue';
import ShareRow from './ShareRow.vue';
import type { ShareWithUserAndFile } from '@/models/share';

const showModal = useStore($shareModal);
const shareFile = useStore($shareFile);
const shares = ref<ShareWithUserAndFile[]>(await getSharesCreated(shareFile.value.fileId));

const dialogTitle = computed(() => shareFile.value.name ? `Share "${shareFile.value.name}"` : 'Share File')

watch(showModal, async (newVal) => {
  if (newVal && shareFile.value?.fileId) {
    shares.value = await getSharesCreated(shareFile.value.fileId);
  }
})

const closeDialog = () => {
  $shareModal.set(false)
}

async function getSharesCreated(file: string) {

  if (!file) return []

  try {
    const response = await fetch(`/api/shares/${file}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    console.log({ data })
    return data
  } catch (error) {
    console.error('Error fetching shares:', error)
    return []
  }
}

const handleCreateShareForm = async (event: Event) => {
  event.preventDefault()
  const formData = new FormData(event.target as HTMLFormElement)
  formData.append('file_id', shareFile.value.fileId)

  try {
    const response = await fetch('/api/shares', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    shares.value.push(data[0])
  } catch (error) {
    console.error('Error creating share:', error)
  }
}
</script>

<template>
  <Dialog :show-modal=showModal :title=dialogTitle @update:show-modal="closeDialog">
    <div class="p-4 pt-0 text-center">
      <div v-if="shares.length === 0" class="flex flex-col items-center justify-center gap-y-2">
        <p class="text-gray-300">
          No share links created yet.
        </p>
        <p class="text-sm text-gray-400">
          Share this file to allow others to access it.
        </p>
      </div>
      <div v-else class="">
        <div class="flex items-center justify-around py-2 px-4 font-semibold text-gray-200 bg-gray-700 rounded">
          <span class="text-lg">Share</span>
          <span class="text-lg">Actions</span>
        </div>
        <ul class="w-full divide-y divide-gray-700">
          <li v-for="share in shares" :key="share.id"
            class="flex items-center justify-between py-4 px-4 bg-gray-800 rounded transition-colors duration-200">
            <ShareRow :share="share" />
          </li>
        </ul>
      </div>
    </div>
    <template v-slot:footer>
      <form action="/api/shares" method="POST" @submit="handleCreateShareForm"
        class="w-full flex flex-col items-start justify-center">
        <p class="text-gray-300">Share via email</p>
        <div class="flex w-full justify-center">
          <input type="text" name="shared_with" required
            class="p-2 border border-gray-600 bg-gray-800 text-gray-300 rounded" placeholder="example@mail.com" />
          <button class="ml-2 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600">
            &plus; Share
          </button>
        </div>
      </form>
    </template>
  </Dialog>
</template>