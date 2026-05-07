<template>
  <div class="min-h-screen bg-surface">
    <!-- Web端布局 (>= 768px) -->
    <template v-if="!isMobile">
      <WebHeader />

      <!-- Hero Section -->
      <section class="relative overflow-hidden px-8 py-20 lg:py-32 bg-surface">
        <div class="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <!-- 左侧文案 -->
          <div class="flex-1 text-center lg:text-left z-10">
            <div class="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-container text-on-primary-container text-sm font-bold tracking-wide uppercase">
              AI Powered Storytelling
            </div>
            <h1 class="text-5xl lg:text-7xl font-extrabold text-on-background leading-tight mb-8">
              让想象力插上翅膀，<br/>
              <span class="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-fixed-dim">一键生成精美绘本</span>
            </h1>
            <p class="text-xl text-on-surface-variant max-w-2xl mb-12 leading-relaxed">
              每一个孩子心中都藏着一个奇妙的世界。StoryCanvas AI 将您的文字灵感转化为充满魔力的艺术绘本，让创作变得从未如此简单。
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <router-link
                to="/create"
                class="px-12 py-5 bg-gradient-to-r from-primary to-primary-fixed-dim text-white rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform text-center"
              >
                立即开启创作之旅
              </router-link>
            </div>
          </div>
          
          <!-- 右侧图片展示 -->
          <div class="flex-1 relative w-full max-w-xl">
            <div class="absolute -top-10 -right-10 w-64 h-64 bg-secondary-container rounded-full blur-3xl opacity-30"></div>
            <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-30"></div>
            <div class="relative z-10 grid grid-cols-2 gap-4">
              <div class="space-y-4">
                <div class="bg-surface-container-lowest p-3 rounded-lg shadow-lg rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                  <img class="rounded-lg aspect-[3/4] object-cover w-full" src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=533&fit=crop" alt="童话绘本插图"/>
                </div>
                <div class="bg-surface-container-lowest p-3 rounded-lg shadow-lg rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                  <img class="rounded-lg aspect-square object-cover w-full" src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop" alt="梦幻插画"/>
                </div>
              </div>
              <div class="space-y-4 pt-8">
                <div class="bg-surface-container-lowest p-3 rounded-lg shadow-lg rotate-[4deg] hover:rotate-0 transition-transform duration-500">
                  <img class="rounded-lg aspect-square object-cover w-full" src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop" alt="机器人冒险"/>
                </div>
                <div class="bg-surface-container-lowest p-3 rounded-lg shadow-lg rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  <img class="rounded-lg aspect-[3/4] object-cover w-full" src="https://images.unsplash.com/photo-1633477189729-9290b3261d0a?w=400&h=533&fit=crop" alt="魔法龙洞穴"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Style Showcase Section -->
      <section class="py-24 bg-surface-container-low px-8 overflow-hidden">
        <div class="max-w-screen-2xl mx-auto">
          <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 class="text-4xl font-extrabold text-on-background mb-4">探索无限艺术风格</h2>
              <p class="text-on-surface-variant text-lg max-w-xl">
                从温馨的水彩到动感的漫画，我们提供数十种经过专业训练的 AI 艺术风格，完美契合每一个故事的灵魂。
              </p>
            </div>
            <div class="flex gap-2">
              <button class="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button class="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Style Bento Grid -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="md:col-span-2 group relative overflow-hidden rounded-lg bg-surface-container-lowest transition-all hover:scale-[1.02]">
              <div class="h-[400px] w-full overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop" alt="梦幻水彩风格"/>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <span class="text-white/70 text-sm font-bold tracking-widest uppercase mb-2">梦幻水彩</span>
                <h3 class="text-3xl font-bold text-white mb-2">Watercolor Dream</h3>
                <p class="text-white/80 line-clamp-2">柔和的晕染与清新的色调，适合温馨、治愈系的童话故事。</p>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-lg bg-surface-container-lowest transition-all hover:scale-[1.02]">
              <div class="h-[400px] w-full overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1560421683-6856ea585c78?w=400&h=600&fit=crop" alt="简约漫画风格"/>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span class="text-white/70 text-xs font-bold tracking-widest uppercase mb-1">简约漫画</span>
                <h3 class="text-xl font-bold text-white mb-2">Cartoon Pop</h3>
                <p class="text-white/80 text-sm">线条明快，色彩鲜艳，让冒险故事跃然纸上。</p>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-lg bg-surface-container-lowest transition-all hover:scale-[1.02]">
              <div class="h-[400px] w-full overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=600&fit=crop" alt="古典油画风格"/>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span class="text-white/70 text-xs font-bold tracking-widest uppercase mb-1">古典油画</span>
                <h3 class="text-xl font-bold text-white mb-2">Oil Master</h3>
                <p class="text-white/80 text-sm">富有质感的笔触与光影，赋予故事传奇般的艺术深度。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-24 px-8 bg-surface">
        <div class="max-w-screen-2xl mx-auto">
          <div class="text-center mb-20">
            <h2 class="text-4xl font-extrabold text-on-background mb-4">为什么选择 StoryCanvas AI？</h2>
            <div class="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div class="p-10 rounded-xl bg-surface-container-low border border-outline-variant/10 text-center hover:shadow-xl transition-all">
              <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold mb-4">秒级生成</h3>
              <p class="text-on-surface-variant">输入一段文字，AI 即可在数秒内为您渲染出一整本插画级的绘本内容。</p>
            </div>
            <div class="p-10 rounded-xl bg-surface-container-low border border-outline-variant/10 text-center hover:shadow-xl transition-all">
              <div class="w-20 h-20 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg class="w-10 h-10 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold mb-4">风格定制</h3>
              <p class="text-on-surface-variant">您可以自由调整角色的样貌、背景的细节，确保每一张画面都符合您的预期。</p>
            </div>
            <div class="p-10 rounded-xl bg-surface-container-low border border-outline-variant/10 text-center hover:shadow-xl transition-all">
              <div class="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg class="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold mb-4">一键排版</h3>
              <p class="text-on-surface-variant">内置多种绘本模板，生成画面后自动为您完成精美的图文排版，直接导出预览。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-24 px-8">
        <div class="max-w-screen-xl mx-auto rounded-xl bg-primary overflow-hidden relative">
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary-container/20 rounded-full blur-[100px]"></div>
            <div class="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-tertiary-container/10 rounded-full blur-[100px]"></div>
          </div>
          <div class="relative z-10 py-20 px-12 flex flex-col items-center text-center">
            <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-6">准备好讲述你的故事了吗？</h2>
            <p class="text-primary-container text-xl max-w-2xl mb-12">
              加入成千上万的创作者，开始用 AI 创作属于你和孩子的独一无二的绘本世界。
            </p>
            <router-link
              to="/create"
              class="px-12 py-6 bg-white text-primary rounded-full font-black text-xl hover:bg-primary-container hover:scale-105 transition-all shadow-2xl"
            >
              立即开启创作之旅
            </router-link>
            <p class="mt-8 text-white/60 text-sm">无需信用卡，免费注册体验</p>
          </div>
        </div>
      </section>

      <WebFooter />
    </template>

    <!-- H5端布局 (< 768px) -->
    <template v-else>
      <MobileHeader />

      <main class="flex flex-col gap-8 px-5 pb-32">
        <!-- Hero Section -->
        <section class="mt-4 rounded-2xl overflow-hidden relative aspect-[4/5] flex flex-col justify-end p-6 text-white">
          <div class="absolute inset-0 z-0">
            <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=750&fit=crop" alt="Hero背景"/>
            <div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
          </div>
          <div class="relative z-10 space-y-4">
            <h2 class="text-2xl font-extrabold leading-tight tracking-tight">让想象力插上翅膀，一键生成精美绘本</h2>
            <router-link
              to="/create"
              class="block bg-gradient-to-r from-primary to-primary-fixed-dim text-white px-8 py-4 rounded-full font-bold text-base shadow-lg active:scale-95 transition-transform text-center"
            >
              立即开启创作之旅
            </router-link>
          </div>
        </section>

        <!-- Feature Chips -->
        <section class="grid grid-cols-3 gap-3">
          <div class="bg-surface-container-lowest p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm">
            <div class="bg-primary-container text-primary p-2 rounded-full">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span class="text-xs font-bold tracking-wider text-on-surface-variant uppercase">秒级生成</span>
          </div>
          <div class="bg-surface-container-lowest p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm">
            <div class="bg-secondary-container text-secondary p-2 rounded-full">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
            <span class="text-xs font-bold tracking-wider text-on-surface-variant uppercase">风格定制</span>
          </div>
          <div class="bg-surface-container-lowest p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm">
            <div class="bg-tertiary-container text-tertiary p-2 rounded-full">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
              </svg>
            </div>
            <span class="text-xs font-bold tracking-wider text-on-surface-variant uppercase">一键排版</span>
          </div>
        </section>

        <!-- Style Showcase -->
        <section class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h3 class="text-xl font-bold text-on-surface tracking-tight">探索画风</h3>
            <span class="text-primary font-medium text-sm">查看全部</span>
          </div>
          <div class="flex overflow-x-auto gap-4 pb-4 -mx-5 px-5 snap-x scrollbar-hide">
            <div class="flex-shrink-0 w-40 snap-start">
              <div class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm active:scale-95 transition-transform">
                <div class="aspect-square relative">
                  <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop" alt="Watercolor Style"/>
                </div>
                <div class="p-3 text-center">
                  <p class="font-bold text-on-surface text-sm">梦幻水彩</p>
                </div>
              </div>
            </div>
            <div class="flex-shrink-0 w-40 snap-start mt-4">
              <div class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm active:scale-95 transition-transform">
                <div class="aspect-square relative">
                  <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1560421683-6856ea585c78?w=300&h=300&fit=crop" alt="Cartoon Pop Style"/>
                </div>
                <div class="p-3 text-center">
                  <p class="font-bold text-on-surface text-sm">简约漫画</p>
                </div>
              </div>
            </div>
            <div class="flex-shrink-0 w-40 snap-start">
              <div class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm active:scale-95 transition-transform">
                <div class="aspect-square relative">
                  <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300&h=300&fit=crop" alt="Classic Sketch Style"/>
                </div>
                <div class="p-3 text-center">
                  <p class="font-bold text-on-surface text-sm">古典油画</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- AI Promotion Banner -->
        <section class="bg-surface-container-low rounded-2xl p-5 flex items-center justify-between gap-4">
          <div class="flex-1">
            <p class="text-xs font-bold tracking-widest text-primary uppercase mb-1">全新升级</p>
            <h4 class="text-base font-bold text-on-surface mb-2 leading-snug">输入一个故事梗概<br/>即刻获得完整绘本</h4>
            <div class="flex gap-2">
              <span class="text-xs bg-white px-2 py-1 rounded-full text-outline font-medium">✨ 智能排版</span>
              <span class="text-xs bg-white px-2 py-1 rounded-full text-outline font-medium">🎨 连贯画风</span>
            </div>
          </div>
          <div class="w-20 h-20 bg-primary-fixed rounded-lg overflow-hidden flex-shrink-0 -rotate-3 shadow-md">
            <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop" alt="AI Magic"/>
          </div>
        </section>
      </main>

      <MobileBottomNav />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import WebHeader from '@/components/WebHeader.vue'
import WebFooter from '@/components/WebFooter.vue'
import MobileHeader from '@/components/MobileHeader.vue'
import MobileBottomNav from '@/components/MobileBottomNav.vue'

const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
