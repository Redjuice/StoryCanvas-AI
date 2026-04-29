<template>
  <div class="min-h-screen bg-surface">
    <!-- Web端布局 (>= 768px) -->
    <template v-if="!isMobile">
      <WebHeader />

      <main class="max-w-screen-2xl mx-auto px-8 py-12">
        <!-- Hero Section -->
        <div class="mb-12">
          <h1 class="text-5xl font-black text-on-surface mb-4 tracking-tight">我的书架</h1>
          <p class="text-on-surface-variant text-xl max-w-xl">
            这里收藏着你创作的每一个奇妙故事
          </p>
        </div>

        <!-- Search & Filter -->
        <div class="mb-10">
          <div class="relative max-w-md">
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-outline">search</span>
            </div>
            <input 
              v-model="searchKeyword"
              class="w-full bg-surface-container border-none rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300"
              placeholder="搜索你的故事书..."
              type="text"
            />
          </div>
        </div>

        <!-- Book Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          <!-- Book Cards -->
          <div 
            v-for="book in filteredBooks" 
            :key="book.id"
            class="group cursor-pointer"
          >
            <router-link :to="`/preview/${book.id}`">
              <div class="aspect-[3/4] rounded-2xl bg-surface-container-lowest shadow-lg overflow-hidden relative book-spine">
                <img 
                  :alt="book.title" 
                  class="absolute inset-0 w-full h-full object-cover"
                  :src="book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=533&fit=crop'"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                <!-- Kebab Menu -->
                <button 
                  @click.prevent="showBookMenu(book.id)"
                  class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:bg-black/40"
                >
                  <span class="material-symbols-outlined text-lg">more_vert</span>
                </button>
                
                <!-- Status Tag -->
                <div class="absolute top-2 left-2">
                  <span 
                    :class="[
                      'text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md uppercase tracking-wider',
                      book.status === 'published' ? 'bg-emerald-400/90 text-emerald-950' : 'bg-amber-400/90 text-amber-950'
                    ]"
                  >
                    {{ book.status === 'published' ? 'Published' : 'Draft' }}
                  </span>
                </div>
                
                <div class="absolute bottom-3 left-3 right-3 space-y-2">
                  <p class="text-white font-bold text-sm leading-tight line-clamp-2">{{ book.title }}</p>
                  <p v-if="book.status !== 'published'" class="w-full py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white text-[11px] font-bold uppercase tracking-wider text-center">
                    继续编辑
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredBooks.length === 0" class="text-center py-20">
          <div class="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-5xl text-outline">auto_stories</span>
          </div>
          <h3 class="text-xl font-bold text-on-surface mb-2">还没有创作任何故事</h3>
          <p class="text-on-surface-variant mb-6">点击下方按钮开始你的第一个故事</p>
          <router-link 
            to="/create"
            class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            <span class="material-symbols-outlined">add</span>
            创作新故事
          </router-link>
        </div>
      </main>

      <WebFooter />
    </template>

    <!-- H5端布局 (< 768px) -->
    <template v-else>
      <MobileHeader />

      <main class="px-6 pt-4 pb-32">
        <!-- Search & Filter Section -->
        <section class="mb-6 space-y-4">
          <div class="relative group">
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-outline">search</span>
            </div>
            <input 
              v-model="searchKeyword"
              class="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline/60"
              placeholder="搜索你的故事书..."
              type="text"
            />
          </div>
        </section>

        <!-- Shelf Title -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold tracking-tight">我的书架</h2>
          <span class="text-xs font-bold tracking-widest text-outline uppercase">{{ books.length }} BOOKS</span>
        </div>

        <!-- Book Grid (Double Column) -->
        <div class="grid grid-cols-2 gap-x-5 gap-y-8">

          <!-- Book Cards -->
          <router-link 
            v-for="book in filteredBooks" 
            :key="book.id"
            :to="`/preview/${book.id}`"
            class="relative group"
          >
            <div class="aspect-[3/4] rounded-2xl bg-surface-container-lowest shadow-lg overflow-hidden relative book-spine">
              <img 
                :alt="book.title" 
                class="absolute inset-0 w-full h-full object-cover"
                :src="book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=533&fit=crop'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              
              <!-- Kebab Menu -->
              <button 
                @click.prevent="showBookMenu(book.id)"
                class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:bg-black/40"
              >
                <span class="material-symbols-outlined text-lg">more_vert</span>
              </button>
              
              <!-- Status Tag -->
              <div class="absolute top-2 left-2">
                <span 
                  :class="[
                    'text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md uppercase tracking-wider',
                    book.status === 'published' ? 'bg-emerald-400/90 text-emerald-950' : 'bg-amber-400/90 text-amber-950'
                  ]"
                >
                  {{ book.status === 'published' ? 'Published' : 'Draft' }}
                </span>
              </div>
              
              <div class="absolute bottom-3 left-3 right-3 space-y-2">
                <p class="text-white font-bold text-sm leading-tight line-clamp-1">{{ book.title }}</p>
                <div v-if="book.status !== 'published'" class="w-full py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white text-[11px] font-bold uppercase tracking-wider text-center">
                  继续编辑
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Empty State -->
        <div v-if="filteredBooks.length === 0" class="text-center py-16">
          <div class="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-4xl text-outline">auto_stories</span>
          </div>
          <h3 class="text-lg font-bold text-on-surface mb-2">还没有创作任何故事</h3>
          <p class="text-on-surface-variant text-sm">点击下方按钮开始创作</p>
        </div>
      </main>

      <!-- FAB Button -->
      <router-link to="/create" class="fixed bottom-28 right-6 z-40">
        <button class="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary-fixed-dim text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">add</span>
        </button>
      </router-link>

      <MobileBottomNav />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import WebHeader from '@/components/WebHeader.vue'
import WebFooter from '@/components/WebFooter.vue'
import MobileHeader from '@/components/MobileHeader.vue'
import MobileBottomNav from '@/components/MobileBottomNav.vue'
import { getStoryList } from '@/api/story'

const isMobile = ref(false)
const searchKeyword = ref('')
const activeFilter = ref('all')

const filters = [
  { label: '全部故事', value: 'all' },
  { label: '草稿箱', value: 'draft' },
  { label: '已发布', value: 'published' }
]

const books = ref([
  {
    id: 1,
    title: '小猫的城市冒险',
    coverImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=533&fit=crop',
    status: 'draft'
  },
  {
    id: 2,
    title: '星际小航海家',
    coverImage: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=533&fit=crop',
    status: 'published'
  },
  {
    id: 3,
    title: '森林里的秘密',
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=533&fit=crop',
    status: 'draft'
  },
  {
    id: 4,
    title: '神奇画笔',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=533&fit=crop',
    status: 'published'
  },
  {
    id: 5,
    title: '极地滑雪赛',
    coverImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=533&fit=crop',
    status: 'published'
  }
])

const filteredBooks = computed(() => {
  let result = books.value
  
  if (activeFilter.value !== 'all') {
    result = result.filter(book => book.status === activeFilter.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(book => book.title.toLowerCase().includes(keyword))
  }
  
  return result
})

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

const showBookMenu = (bookId) => {
  console.log('显示菜单', bookId)
}

const loadBooks = async () => {
  try {
    const res = await getStoryList()
    if (res.data) {
      books.value = res.data
    }
  } catch (error) {
    console.log('使用默认数据')
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  loadBooks()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.book-spine {
  box-shadow: inset 12px 0 15px -10px rgba(0,0,0,0.3);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
