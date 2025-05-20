<template>
  <transition name="fade">
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div class="bg-gray-800 text-white rounded-lg shadow-lg max-w-3xl p-6">
        <header class="flex justify-between items-center border-b border-gray-700 pb-2">
          <h2 class="text-lg font-semibold truncate">{{ title }}</h2>
          <button @click="closeDialog" class="text-gray-400 hover:text-gray-200 cursor-pointer -mr-3 -mt-5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </header>
        <main class="my-3">
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