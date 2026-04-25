<template>
  <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-5 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_32px_rgba(88,71,210,0.06)] rounded-t-[2rem]">
    <router-link 
      to="/" 
      :class="[$route.path === '/' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant', 'flex flex-col items-center justify-center rounded-full px-5 py-1.5 active:scale-90 transition-transform duration-200']"
    >
      <svg class="w-5 h-5" :fill="$route.path === '/' ? 'currentColor' : 'none'" :stroke="$route.path === '/' ? 'none' : 'currentColor'" viewBox="0 0 24 24">
        <path v-if="$route.path === '/'" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
      <span class="text-xs font-medium">首页</span>
    </router-link>
    <router-link 
      to="/create" 
      :class="[$route.path === '/create' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant', 'flex flex-col items-center justify-center rounded-full px-5 py-1.5 active:scale-90 transition-transform duration-200']"
    >
      <svg class="w-5 h-5" :fill="$route.path === '/create' ? 'currentColor' : 'none'" :stroke="$route.path === '/create' ? 'none' : 'currentColor'" viewBox="0 0 24 24">
        <path v-if="$route.path === '/create'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="text-xs font-medium">创作</span>
    </router-link>
    <router-link 
      to="/bookshelf" 
      :class="[$route.path === '/bookshelf' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant', 'flex flex-col items-center justify-center rounded-full px-5 py-1.5 active:scale-90 transition-transform duration-200']"
    >
      <svg class="w-5 h-5" :fill="$route.path === '/bookshelf' ? 'currentColor' : 'none'" :stroke="$route.path === '/bookshelf' ? 'none' : 'currentColor'" viewBox="0 0 24 24">
        <path v-if="$route.path === '/bookshelf'" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
      <span class="text-xs font-medium">书架</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const $route = useRoute()
</script>
