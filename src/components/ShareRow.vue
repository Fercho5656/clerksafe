<template>
  <tr class="flex items-center justify-between">
    <td class="text-gray-500 flex font-semibold justify-start items-center gap-x-2">
      <img :src="props.share.users.image_url"
        :alt="`${props.share.users.first_name} ${props.share.users.last_name}'s profile pic'`"
        class="w-10 h-10 rounded-full" />
      <p>
        {{ props.share.users.first_name }} {{ props.share.users.last_name }}
      </p>
    </td>
    <td class="text-sm text-gray-500">
      <div class="flex gap-x-5 items-end">
        <div class="flex flex-col justify-center">
          <label for="requires-mfa" class="text-sm text-gray-500 cursor-pointer select-none">
            MFA
          </label>
          <input v-model="hasMFA" @change="handleMFAChange" type="checkbox" name="requires_mfa" id="requires-mfa"
            class="" />
        </div>
        <div class="flex flex-col ml-2">
          <label for="expiration-date" class="text-sm text-gray-500 cursor-pointer select-none">
            Expires
          </label>
          <input v-model="expireDate" @change="handleExpireDateChange" type="date" id="expiration-date"
            name="expiration_date" class="p-1 text-xs border border-gray-300 rounded"
            :min="new Date().toISOString().split('T')[0]" />
        </div>
        <button @click="deleteShare(props.share.id)" class="text-red-500 hover:text-red-700 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-trash-icon lucide-trash">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { ShareWithUserAndFile } from '@/models/share';
import { ref } from 'vue'

interface Props {
  share: ShareWithUserAndFile
}

const props = defineProps<Props>()

const hasMFA = ref(props.share.requires_mfa)
const expireDate = ref(props.share.expires_at ? new Date(props.share.expires_at!).toISOString().split('T')[0] : undefined)

const handleMFAChange = () => {
  // Logic to handle MFA change
  console.log(`MFA changed to: ${hasMFA.value}`)
}

const handleExpireDateChange = () => {
  // Logic to handle expiration date change
  console.log(`Expiration date changed to: ${expireDate.value}`)
}

const deleteShare = (id: string) => {
  // Logic to delete the share
  console.log(`Deleting share with ID: ${id}`)
}
</script>

<style scoped></style>