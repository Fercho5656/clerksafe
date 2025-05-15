<template>
  <transition name="fade">
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-lg w-96 p-6">
        <header class="flex justify-between items-center border-b pb-2 mb-4">
          <h2 class="text-lg font-semibold truncate">{{ title }}</h2>
          <button @click="closeDialog" class="text-5xl cursor-pointer text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </header>
        <main>
          <slot />
        </main>
        <footer class="flex justify-end mt-4">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Dialog',
  },
});

const emit = defineEmits(['update:showModal']);

const closeDialog = () => {
  emit('update:showModal', false);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>