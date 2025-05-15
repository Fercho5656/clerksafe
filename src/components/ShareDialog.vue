<script setup lang="ts">
import { ref } from 'vue';
import { $shareModal, $shareFileName } from '@/store/modalStore';
import { useStore } from '@nanostores/vue';
import Dialog from '@/components/ui/Dialog.vue';

const showModal = useStore($shareModal);
const fileName = useStore($shareFileName);

const dialogTitle = `Share "${fileName.value}"`;

const closeDialog = () => {
  $shareModal.set(false)
};

const fileShares = ref([])
</script>

<template>
  <Dialog :show-modal=showModal :title=dialogTitle v-on:update:show-modal="closeDialog">
    <div class="p-4">
      <div v-if="fileShares.length === 0" class="">
        <p class="">
          No share links created yet.
        </p>
        <p class="text-sm">
          Create a share link to allow others to access this file.
        </p>
      </div>
    </div>
    <template v-slot:footer>
      <form class="w-full flex justify-center">
        <input type="text" name="shareLabel" required class="p-2 border border-gray-300 rounded"
          placeholder="Share label" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          &plus; Create
        </button>
      </form>
    </template>
  </Dialog>
</template>