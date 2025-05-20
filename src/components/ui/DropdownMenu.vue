<template>
  <div ref="dropdown" class="relative inline-block">
    <button @click="toggleMenu"
      class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none cursor-pointer">
      <span class="sr-only">Open menu</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v.01M12 12v.01M12 18v.01" />
      </svg>
    </button>
    <transition name="fade">
      <div v-if="isOpen"
        class="absolute left-10 z-10 mt-2 w-48 bg-gray-900 rounded-md shadow-lg ring-1 ring-white ring-opacity-10 focus:outline-none">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isOpen = ref(false);
const dropdown = ref(null);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function handleClickOutside(event) {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
