<template>
  <header class="w-full top-0 sticky z-40 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-md">
    <div class="flex items-center gap-3">
      <h1 class="text-xl font-bold tracking-tight text-primary">StoryCanvas AI</h1>
    </div>
    <router-link to="/profile" class="w-10 h-10 rounded-full bg-surface-variant overflow-hidden hover:ring-2 hover:ring-primary transition-all">
      <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="用户头像"/>
    </router-link>
  </header>
</template>
