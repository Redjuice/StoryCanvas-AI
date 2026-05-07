<template>
  <div class="min-h-screen bg-surface">
    <!-- Web端布局 (>= 768px) -->
    <template v-if="!isMobile">
      <WebHeader />

      <main class="max-w-screen-2xl mx-auto px-8 py-12">
        <!-- Hero Header -->
        <div class="mb-16">
          <span class="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">AI Generation Preview</span>
          <h1 class="text-5xl font-black text-on-surface mb-6 tracking-tight leading-tight">
            你的奇幻故事已<span class="text-primary italic">跃然纸上</span>
          </h1>
          <p class="text-on-surface-variant text-xl max-w-2xl leading-relaxed">
            这是 AI 为你生成的故事画册。你可以微调文字，或者对不满意的插图进行重新生成。
          </p>
        </div>

        <!-- Editor Canvas Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <!-- Left: Sidebar -->
          <aside class="lg:col-span-3 sticky top-32 space-y-6">
            <div class="glass-panel p-8 rounded-xl border border-outline-variant/15">
              <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">auto_stories</span>
                故事详情
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">书名</label>
                  <input 
                    v-model="storyTitle"
                    class="w-full bg-surface-container-low border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                    type="text"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">画风</label>
                  <div class="bg-surface-container-low rounded-md px-4 py-3 text-on-surface text-sm flex items-center justify-between">
                    <span>{{ currentStyleLabel }}</span>
                    <span class="material-symbols-outlined text-sm">palette</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-8 rounded-xl bg-primary-container text-on-primary-container">
              <h4 class="font-bold mb-2">准备好了吗？</h4>
              <p class="text-sm opacity-80 mb-6 leading-relaxed">满意所有页面后，即可导出高清 PDF 文件进行分享或打印。</p>
              <button class="w-full bg-primary text-on-primary py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">picture_as_pdf</span>
                导出 PDF
              </button>
            </div>
          </aside>

          <!-- Right: Story Grid -->
          <div class="lg:col-span-9">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div 
                v-for="(page, index) in pages" 
                :key="index"
                class="group bg-surface-container-lowest p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_32px_64px_-12px_rgba(88,71,210,0.06)]"
              >
                <div class="relative mb-6 rounded-lg overflow-hidden">
                  <div :class="getImageGridClass(page.image)">
                    <img 
                      v-for="(img, imgIndex) in getPageImages(page.image)"
                      :key="imgIndex"
                      :alt="page.text" 
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      :src="img || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=450&fit=crop'"
                    />
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button 
                      @click="regenerateImage(index)"
                      :disabled="regeneratingIndex === index"
                      class="bg-surface-container-lowest text-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                      <span class="material-symbols-outlined text-sm" :class="{ 'animate-spin': regeneratingIndex === index }">refresh</span>
                      {{ regeneratingIndex === index ? '生成中...' : '重新生成图片' }}
                    </button>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-primary uppercase tracking-widest">Page {{ index + 1 }}</span>
                    <button 
                      @click="savePageText(index)"
                      :disabled="savingIndex === index"
                      class="material-symbols-outlined text-on-surface-variant/40 hover:text-primary cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {{ savingIndex === index ? 'sync' : 'edit_note' }}
                    </button>
                  </div>
                  <textarea 
                    v-model="page.text"
                    @blur="savePageText(index)"
                    class="w-full bg-surface-container-low border-none rounded-md p-4 text-on-surface-variant text-sm leading-relaxed focus:ring-2 focus:ring-primary/20 h-32 resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- Add New Page -->
              <div class="bg-surface-container border-2 border-dashed border-outline-variant/30 p-6 rounded-lg flex flex-col items-center justify-center min-h-[400px] hover:bg-surface-container-high hover:border-primary/40 transition-all cursor-pointer">
                <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-primary text-3xl">add</span>
                </div>
                <p class="font-bold text-on-surface-variant">添加新页面</p>
                <p class="text-xs text-on-surface-variant/60 mt-1">扩展你的故事内容</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Global Action Bar -->
        <div class="mt-20 flex justify-center pb-12">
          <div class="glass-panel p-2 rounded-full border border-outline-variant/20 shadow-xl flex items-center gap-2">
            <button 
              @click="saveStory"
              :disabled="isSaving"
              class="px-8 py-3 rounded-full hover:bg-surface-container-high transition-colors font-bold text-on-surface-variant flex items-center gap-2 disabled:opacity-50"
            >
              <span class="material-symbols-outlined text-sm" :class="{ 'animate-spin': isSaving }">save</span>
              {{ isSaving ? '保存中...' : '保存草稿' }}
            </button>
            <div class="w-[1px] h-6 bg-outline-variant/30"></div>
            <button class="bg-primary text-on-primary px-10 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-2">
              <span class="material-symbols-outlined">publish</span>
              立即发布
            </button>
          </div>
        </div>
      </main>

      <WebFooter />
    </template>

    <!-- H5端布局 (< 768px) -->
    <template v-else>
      <MobileHeader />

      <main class="px-6 pt-8 pb-44 max-w-2xl mx-auto">
        <!-- Hero Section -->
        <div class="mb-10 text-center">
          <h2 class="text-3xl font-extrabold tracking-tight text-on-background leading-tight mb-3">
            你的奇幻故事已跃然纸上
          </h2>
          <p class="text-on-surface-variant text-lg">正在编辑：{{ storyTitle }}</p>
          <button class="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-surface-container-lowest text-primary font-semibold rounded-full shadow-sm border border-outline-variant/20 hover:bg-primary/5 transition-colors active:scale-95">
            <span class="material-symbols-outlined">picture_as_pdf</span>
            导出 PDF
          </button>
        </div>

        <!-- Story Canvas Cards -->
        <div class="space-y-12">
          <div 
            v-for="(page, index) in pages" 
            :key="index"
            class="relative group"
          >
            <div class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(88,71,210,0.06)] transform transition-transform hover:scale-[1.01] duration-300">
              <div class="relative overflow-hidden" :class="getMobileImageContainerClass(page.image)">
                <div :class="getImageGridClass(page.image)">
                  <img 
                    v-for="(img, imgIndex) in getPageImages(page.image)"
                    :key="imgIndex"
                    class="w-full h-full object-cover" 
                    :src="img || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop'"
                    :alt="page.text"
                  />
                </div>
                <button 
                  @click="regenerateImage(index)"
                  :disabled="regeneratingIndex === index"
                  class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-surface-container-lowest/90 backdrop-blur rounded-full text-primary shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <span class="material-symbols-outlined" :class="{ 'animate-spin': regeneratingIndex === index }">refresh</span>
                </button>
              </div>
              <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-xs font-bold tracking-widest text-outline uppercase bg-surface-container px-3 py-1 rounded-full">
                    PAGE {{ String(index + 1).padStart(2, '0') }}
                  </span>
                  <button 
                      @click="savePageText(index)"
                      :disabled="savingIndex === index"
                      class="material-symbols-outlined text-on-surface-variant/40 hover:text-primary cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {{ savingIndex === index ? 'sync' : 'edit_note' }}
                  </button>
                </div>
                <textarea
                  v-model="page.text"
                  @blur="savePageText(index)"
                  class="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface-variant leading-relaxed text-base focus:ring-2 focus:ring-primary/20 resize-none"
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Add New Page -->
          <button class="w-full py-12 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-3 text-outline hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-[0.98]">
            <span class="material-symbols-outlined text-4xl">add_photo_alternate</span>
            <span class="font-bold tracking-wide">添加新章节</span>
          </button>
        </div>
      </main>

      <!-- Persistent Action Bar -->
      <div class="fixed bottom-20 left-0 w-full z-40 px-4 py-3 ">
        <div class="max-w-2xl mx-auto flex gap-4">
          <button 
            @click="saveStory"
            :disabled="isSaving"
            class="flex-1 py-4 px-6 bg-surface-container-high text-on-surface font-bold rounded-full hover:bg-surface-variant transition-colors active:scale-95 duration-200 disabled:opacity-50"
          >
            {{ isSaving ? '保存中...' : '保存草稿' }}
          </button>
          <button class="flex-[1.5] py-4 px-6 bg-gradient-to-r from-primary to-primary-fixed-dim text-white font-bold rounded-full shadow-[0_8px_24px_rgba(88,71,210,0.3)] hover:opacity-90 transition-opacity active:scale-95 duration-200">
            立即发布
          </button>
        </div>
      </div>

      <MobileBottomNav />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import WebHeader from '@/components/WebHeader.vue'
import WebFooter from '@/components/WebFooter.vue'
import MobileHeader from '@/components/MobileHeader.vue'
import MobileBottomNav from '@/components/MobileBottomNav.vue'
import { getStoryDetail, updateStory, regeneratePage } from '@/api/story'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const toastStore = useToastStore()
const isMobile = ref(false)

const storyId = ref('')
const storyTitle = ref('')
const storyStyle = ref('')

const pages = ref([])

const regeneratingIndex = ref(-1)
const savingIndex = ref(-1)
const isSaving = ref(false)

const styleLabels = {
  anime: '童趣动漫',
  watercolor: '温润水彩',
  sketch: '复古素描',
  '3d': '3D 立体'
}

const currentStyleLabel = computed(() => styleLabels[storyStyle.value] || '童趣动漫')

const getPageImages = (imageStr) => {
  if (!imageStr) return ['']
  return imageStr.split(',').filter(img => img.trim())
}

const getImageGridClass = (imageStr) => {
  const count = getPageImages(imageStr).length
  if (count === 1) return 'aspect-[4/3]'
  if (count === 2) return 'grid grid-cols-2 gap-1 aspect-[4/3]'
  if (count >= 3) return 'grid grid-cols-2 gap-1 aspect-square'
  return 'aspect-[4/3]'
}

const getMobileImageContainerClass = (imageStr) => {
  const count = getPageImages(imageStr).length
  if (count <= 2) return 'aspect-square'
  return 'aspect-[3/4]'
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

const regenerateImage = async (index) => {
  if (regeneratingIndex.value !== -1) return
  
  regeneratingIndex.value = index
  try {
    const res = await regeneratePage(storyId.value, index + 1)
    // 后端返回完整的故事对象，包含 pages 数组
    const storyData = res.data
    if (storyData && storyData.pages) {
      const updatedPage = storyData.pages.find(p => p.pageNum === index + 1)
      if (updatedPage && updatedPage.image) {
        pages.value[index].image = updatedPage.image
        toastStore.success('图片重新生成成功')
      }
    }
  } catch (error) {
    console.error('重新生成图片失败:', error)
    toastStore.error('图片生成失败，请重试')
  } finally {
    regeneratingIndex.value = -1
  }
}

const savePageText = async (index) => {
  if (savingIndex.value !== -1) return
  
  savingIndex.value = index
  try {
    await updateStory(storyId.value, {
      pages: pages.value.map((page, i) => ({
        pageNumber: i + 1,
        content: page.text,
        imageUrl: page.image
      }))
    })
    toastStore.success('页面内容已保存')
  } catch (error) {
    console.error('保存页面失败:', error)
    toastStore.error('保存失败，请重试')
  } finally {
    savingIndex.value = -1
  }
}

const saveStory = async () => {
  if (isSaving.value) return
  
  isSaving.value = true
  try {
    await updateStory(storyId.value, {
      title: storyTitle.value,
      pages: pages.value.map((page, index) => ({
        pageNumber: index + 1,
        content: page.text,
        imageUrl: page.image
      }))
    })
    toastStore.success('故事已保存')
  } catch (error) {
    console.error('保存故事失败:', error)
    toastStore.error('保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}

const loadStory = async () => {
  try {
    const id = route.params.id
    if (id) {
      storyId.value = id
      const res = await getStoryDetail(id)
      if (res.data) {
        storyTitle.value = res.data.title
        storyStyle.value = res.data.style
        if (res.data.pages) {
          pages.value = res.data.pages
        }
      }
    }
  } catch (error) {
    console.log('使用默认数据')
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  loadStory()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
</style>
