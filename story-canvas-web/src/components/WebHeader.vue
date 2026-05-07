<template>
  <header class="w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-md">
    <div class="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
      <!-- Logo -->
      <div class="text-2xl font-black text-primary tracking-tight">StoryCanvas AI</div>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center gap-8 text-base font-medium">
        <router-link
          to="/"
          :class="[$route.path === '/' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors']"
        >
          首页
        </router-link>
        <router-link
          to="/create"
          :class="[$route.path === '/create' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors']"
        >
          创作台
        </router-link>
        <router-link
          to="/bookshelf"
          :class="[$route.path === '/bookshelf' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors']"
        >
          我的书架
        </router-link>
      </nav>

      <!-- User Avatar -->
      <div class="flex items-center gap-4">
        <router-link to="/profile" class="w-10 h-10 rounded-full bg-surface-variant overflow-hidden hover:ring-2 hover:ring-primary transition-all">
          <img
            v-if="userInfo?.avatar"
            :src="userInfo.avatar"
            class="w-full h-full object-cover"
            alt="用户头像"
          />
          <span v-else class="w-full h-full flex items-center justify-center material-symbols-outlined text-gray-400">person</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const $route = useRoute()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
</script>
