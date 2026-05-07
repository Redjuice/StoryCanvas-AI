<template>
  <header class="w-full top-0 sticky z-40 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-md">
    <div class="flex items-center gap-3">
      <h1 class="text-xl font-bold tracking-tight text-primary">StoryCanvas AI</h1>
    </div>
    <router-link to="/profile" class="w-10 h-10 rounded-full bg-surface-variant overflow-hidden hover:ring-2 hover:ring-primary transition-all">
      <img
        v-if="userInfo?.avatar"
        :src="userInfo.avatar"
        class="w-full h-full object-cover"
        alt="用户头像"
      />
      <span v-else class="w-full h-full flex items-center justify-center material-symbols-outlined text-gray-400">person</span>
    </router-link>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
</script>
