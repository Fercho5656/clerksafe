<template>
  <div class="flex w-full items-center justify-end bg-gray-800 text-gray-200 p-4 rounded-lg gap-x-8">
    <div class="flex items-center gap-x-8">
      <img :src="props.share.users.image_url"
        :alt="`${props.share.users.first_name} ${props.share.users.last_name}'s profile pic`"
        class="w-12 h-12 rounded-full border-2 border-gray-600 shadow-sm" />
      <div>
        <p class="font-semibold text-lg">
          {{ props.share.users.first_name }} {{ props.share.users.last_name }}
        </p>
        <p class="text-sm text-gray-400">
          {{ props.share.users.email }}
        </p>
      </div>
    </div>
    <div class="flex items-center gap-x-8">
      <div class="flex flex-col items-center">
        <label for="requires-mfa" class="text-sm font-medium cursor-pointer select-none">
          Require MFA?
        </label>
        <input v-model="hasMFA" @change="handleMFAChange" type="checkbox" name="requires_mfa" id="requires-mfa"
          class="bg-gray-700 border-gray-600 text-gray-200 rounded focus:ring focus:ring-blue-500" />
      </div>
      <div class="flex flex-col items-center">
        <label for="expiration-date" class="text-sm font-medium cursor-pointer select-none">
          Share Expiration Date
        </label>
        <input v-model="expireDate" @change="handleExpireDateChange" type="date" id="expiration-date"
          name="expiration_date"
          class="p-2 text-sm border border-gray-600 rounded bg-gray-700 text-gray-200 focus:ring focus:ring-blue-500"
          :min="new Date().toISOString().split('T')[0]" />
      </div>
      <button @click="deleteShare(props.share.id)"
        class="flex items-center justify-center p-2 text-red-400 hover:text-red-600 rounded-full hover:bg-gray-700 transition cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-trash-icon lucide-trash">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from '@pheralb/toast'
import type { ShareWithUserAndFile } from '@/models/share';
import { ref } from 'vue'

interface Props {
  share: ShareWithUserAndFile
}

const props = defineProps<Props>()
const emits = defineEmits(['share-deleted'])

const hasMFA = ref(props.share.requires_mfa)
const expireDate = ref(props.share.expires_at ? new Date(props.share.expires_at!).toISOString().split('T')[0] : undefined)

const handleMFAChange = async () => {
  // Logic to handle MFA change
  console.log(`MFA changed to: ${hasMFA.value}`)
  await updateShare(props.share.id)
}

const handleExpireDateChange = async () => {
  // Logic to handle expiration date change
  console.log(`Expiration date changed to: ${expireDate.value}`)
  await updateShare(props.share.id)
}

const deleteShare = async (id: string) => {
  try {
    const response = await fetch(`/api/shares/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // Optionally, you can handle the response or update the UI
    console.log(`Share with ID ${id} deleted successfully`)
    emits('share-deleted', id)
    toast.success({
      text: 'Share deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting share:', error)
    toast.error({
      text: 'Error deleting share',
    })
  }
}

async function updateShare(id: string) {

  const data = new FormData()
  if (expireDate.value) {
    data.append('expires_at', new Date(expireDate.value).toISOString())
  }
  if (hasMFA.value) {
    data.append('requires_mfa', hasMFA.value ? 'true' : 'false')
  }

  try {
    const response = await fetch(`/api/shares/${id}`, {
      method: 'PUT',
      body: data,
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // Optionally, you can handle the response or update the UI
    console.log(`Share with ID ${id} updated successfully`)
  } catch (error) {
    console.error('Error updating share:', error)
  }
}
</script>

<style scoped></style>