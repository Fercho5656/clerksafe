<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { $shareModal, $shareFile } from '@/store/share';
import { useStore } from '@nanostores/vue';
import Dialog from '@/components/ui/Dialog.vue';
import type { ShareWithUserAndFile } from '@/models/share';

const showModal = useStore($shareModal);
const shareFile = useStore($shareFile);
const shares = ref<ShareWithUserAndFile[]>(await getSharesCreated(shareFile.value.fileId));

const dialogTitle = computed(() => shareFile.value.fileName ? `Share "${shareFile.value.fileName}"` : 'Share File')

watch(showModal, async (newVal) => {
  if (newVal && shareFile.value?.fileId) {
    shares.value = await getSharesCreated(shareFile.value.fileId);
  }
})

const closeDialog = () => {
  $shareModal.set(false)
};

const deleteShare = async (shareId: string) => {

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
    <div class="p-4 text-center">
      <div v-if="shares.length === 0" class="flex flex-col items-center justify-center gap-y-2">
        <p class="">
          No share links created yet.
        </p>
        <p class="text-sm">
          Share this file to allow others to access it.
        </p>
      </div>
      <div v-else class="">
        <ul class="flex flex-col gap-y-2 mt-4">
          <li v-for="share in shares" :key="share.id" class="flex items-center justify-between">
            <table class="w-full">
              <tbody>
                <tr>
                  <td class="text-gray-500 flex font-semibold justify-start items-center gap-x-2">
                    <img :src="share.users.image_url"
                      :alt="`${share.users.first_name} ${share.users.last_name}'s profile pic'`"
                      class="w-10 h-10 rounded-full" />
                    <p>
                      {{ share.users.first_name }} {{ share.users.last_name }}
                    </p>
                  </td>
                  <td class="text-sm text-gray-500">
                    <button @click="deleteShare(share.id)" class="text-red-500 hover:text-red-700 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-trash-icon lucide-trash">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
        </ul>
      </div>
    </div>
    <template v-slot:footer>
      <form action="/api/shares" method="POST" @submit="handleCreateShareForm"
        class="w-full flex flex-col items-start justify-center">
        <p>Share via email</p>
        <div class="flex w-full justify-center">
          <input type="text" name="shared_with" required class="p-2 border border-gray-300 rounded"
            placeholder="example@mail.com" />
          <button class="ml-2 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600">
            &plus; Share
          </button>
        </div>
      </form>
    </template>
  </Dialog>
</template>