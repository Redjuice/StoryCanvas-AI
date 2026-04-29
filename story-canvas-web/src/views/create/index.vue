<template>
  <div class="min-h-screen bg-surface">
    <!-- Web端布局 (>= 768px) -->
    <template v-if="!isMobile">
      <WebHeader />

      <main class="max-w-screen-2xl mx-auto px-8 py-10">
        <header class="mb-12">
          <h1 class="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">开启您的故事奇旅</h1>
          <p class="text-on-surface-variant text-lg max-w-2xl leading-relaxed">用文字勾勒想象，让 AI 赋予灵魂。每一位创作者都是自己世界的建筑师。</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- 左侧：输入和配置 -->
          <div class="lg:col-span-7 space-y-10">
            <!-- 故事构思 -->
            <section class="bg-surface-container rounded-xl p-8 space-y-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">1</span>
                  <h2 class="text-xl font-bold text-on-surface">故事构思</h2>
                </div>
                <div class="px-4 py-1.5 bg-surface-container-lowest rounded-full text-sm font-medium text-primary border border-outline-variant/15">
                  AI 创作助手已就绪
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="relative group">
                  <textarea 
                    v-model="formData.theme"
                    class="w-full h-64 bg-surface-container-low border-2 border-transparent focus:border-primary focus:ring-0 focus:outline-none rounded-lg p-6 text-lg text-on-surface placeholder:text-outline leading-relaxed resize-none transition-all"
                    placeholder="在这里输入您的故事灵感..."
                    maxlength="2000"
                  ></textarea>
                  <div class="absolute bottom-4 right-4 text-sm text-outline-variant font-medium">
                    {{ formData.theme.length }} / 2000
                  </div>
                </div>

                <!-- 灵感示例 -->
                <div class="space-y-3">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-sm">tips_and_updates</span>
                    <span class="text-sm font-bold text-on-surface">灵感示例：</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                    <button 
                      v-for="example in examples" 
                      :key="example"
                      @click="formData.theme = example"
                      class="px-4 py-2 bg-surface-container-lowest rounded-xl text-sm font-medium text-primary border border-outline-variant/10 hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-2"
                    >
                      <span class="material-symbols-outlined text-sm">{{ getExampleIcon(example) }}</span>
                      {{ example }}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- 年龄段选择 -->
            <section class="bg-surface-container rounded-xl p-8 space-y-6">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">2</span>
                <h2 class="text-xl font-bold text-on-surface">目标年龄段</h2>
              </div>
              <div class="flex flex-wrap gap-4">
                <button 
                  v-for="age in ageRanges" 
                  :key="age.value"
                  @click="formData.ageRange = age.value"
                  :class="[
                    'px-6 py-3 rounded-xl font-medium transition-all',
                    formData.ageRange === age.value 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : 'bg-surface-container-lowest text-on-surface border border-outline-variant/10 hover:border-primary/40'
                  ]"
                >
                  {{ age.label }}
                </button>
              </div>
            </section>

            <!-- 视觉风格选择 -->
            <section class="space-y-6">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">3</span>
                <h2 class="text-xl font-bold text-on-surface">视觉风格</h2>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div 
                  v-for="style in styles" 
                  :key="style.value"
                  @click="formData.style = style.value"
                  class="group cursor-pointer relative"
                >
                  <div 
                    :class="[
                      'aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-low transition-all relative',
                      formData.style === style.value 
                        ? 'ring-4 ring-primary ring-offset-2 shadow-lg' 
                        : 'hover:ring-2 hover:ring-primary/40'
                    ]"
                  >
                    <img :alt="style.label" class="w-full h-full object-cover" :src="style.image"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-3 left-3 right-3">
                      <p class="text-white font-bold text-sm">{{ style.label }}</p>
                    </div>
                    <div v-if="formData.style === style.value" class="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <span class="material-symbols-outlined text-white text-4xl">check_circle</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- 右侧：预览和操作 -->
          <div class="lg:col-span-5 relative">
            <div class="sticky top-32 glass-panel rounded-xl p-8 shadow-xl shadow-primary/5 border border-outline-variant/10">
              <div class="space-y-8">
                <div class="text-center space-y-2">
                  <h3 class="text-2xl font-black text-on-surface">预览区域</h3>
                  <p class="text-on-surface-variant">在此查看创作进度</p>
                </div>

                <!-- 预览画布 -->
                <div class="aspect-square w-full rounded-lg bg-surface-container-lowest overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 relative">
                  <!-- 生成中状态 -->
                  <div v-if="isGenerating" class="flex flex-col items-center justify-center w-full px-12 space-y-8">
                    <div class="relative w-24 h-24">
                      <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                      <div class="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <span class="material-symbols-outlined text-3xl text-primary animate-pulse">brush</span>
                      </div>
                    </div>
                    <div class="w-full space-y-6">
                      <div class="space-y-3">
                        <div class="flex justify-between text-sm font-bold text-on-surface">
                          <span>{{ generatingStatus }}</span>
                          <span class="text-primary">{{ generationProgress }}%</span>
                        </div>
                        <div class="w-full bg-surface-container-low rounded-full h-2.5 overflow-hidden">
                          <div class="bg-primary h-full rounded-full transition-all duration-500" :style="{ width: generationProgress + '%' }"></div>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 gap-3 bg-surface-container rounded-lg p-4">
                        <div class="flex items-center gap-3 text-sm text-on-surface font-medium">
                          <span class="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                          分析创意大纲...
                        </div>
                        <div class="flex items-center gap-3 text-sm font-bold" :class="generationProgress > 30 ? 'text-primary' : 'text-outline-variant'">
                          <span :class="['relative flex h-2 w-2', generationProgress > 30 ? 'block' : 'hidden']">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                          <span :class="generationProgress > 30 ? 'text-primary' : 'text-outline-variant'">
                            {{ generationProgress > 30 ? '绘制故事插图中...' : '等待中...' }}
                          </span>
                        </div>
                        <div class="flex items-center gap-3 text-sm text-outline-variant font-medium">
                          <span class="material-symbols-outlined text-[20px]">pending</span>
                          优化页面排版...
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 默认状态 -->
                  <div v-else class="flex flex-col items-center justify-center p-8 text-center">
                    <div class="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
                      <span class="material-symbols-outlined text-5xl text-outline-variant">auto_stories</span>
                    </div>
                    <h4 class="text-lg font-bold text-on-surface mb-2">准备开始创作</h4>
                    <p class="text-on-surface-variant text-sm">填写故事构思，选择风格<br/>点击生成按钮开始创作</p>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="space-y-4">
                  <button 
                    @click="handleGenerate"
                    :disabled="!canGenerate || isGenerating"
                    :class="[
                      'w-full py-5 rounded-full text-xl font-extrabold shadow-lg transition-all flex items-center justify-center gap-3 group',
                      canGenerate && !isGenerating
                        ? 'bg-gradient-to-r from-primary to-primary-fixed-dim text-white hover:scale-[1.02] hover:shadow-xl shadow-primary/20' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    ]"
                  >
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">magic_button</span>
                    {{ isGenerating ? '生成中...' : '生成我的绘本' }}
                  </button>
                  <div class="flex items-center justify-center gap-6">
                    <div class="flex items-center gap-1 text-sm text-on-surface-variant font-medium">
                      <span class="material-symbols-outlined text-[16px]">bolt</span>
                      预计 ~ 30秒
                    </div>
                  </div>
                </div>

                <!-- 提示 -->
                <div class="bg-primary-container/30 rounded-lg p-5 border border-primary/10">
                  <div class="flex gap-3">
                    <span class="material-symbols-outlined text-primary">lightbulb</span>
                    <div class="text-sm text-on-primary-container leading-relaxed">
                      <strong class="block mb-1">小贴士</strong>
                      描述越具体，AI 生成的画面就越贴近您的想象。尝试加入颜色、天气或人物的情绪描写。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WebFooter />
    </template>

    <!-- H5端布局 (< 768px) -->
    <template v-else>
      <MobileHeader />

      <main class="flex flex-col gap-6 px-5 pb-52 max-w-md mx-auto w-full">
        <!-- Section 1: 故事构思 -->
        <section class="mb-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span class="text-primary material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">auto_stories</span>
              </div>
              <label class="text-sm font-bold tracking-wide text-on-surface">故事构思</label>
            </div>
          </div>
          <div class="bg-white rounded-2xl p-1.5 shadow-sm border-2 border-transparent transition-all focus-within:border-primary">
            <textarea 
              v-model="formData.theme"
              class="w-full min-h-[140px] bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-outline/60 p-3 text-base leading-relaxed"
              placeholder="写下一个奇妙的想法，或者试试：一只住在云端的小猫..."
            ></textarea>
          </div>
          
          <!-- 灵感快速启动 -->
          <div class="mt-4">
            <p class="text-[11px] font-bold text-outline uppercase tracking-wider mb-2 ml-1">灵感快速启动</p>
            <div class="overflow-x-auto flex gap-2 pb-2 -mx-5 px-5 scrollbar-hide">
              <button 
                v-for="example in examples" 
                :key="example"
                @click="formData.theme = example"
                class="flex-shrink-0 px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/60 text-sm text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5"
              >
                <span>{{ getExampleEmoji(example) }}</span> {{ example }}
              </button>
            </div>
          </div>
        </section>

        <!-- Section 2: 视觉风格 -->
        <section class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span class="text-primary material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">palette</span>
            </div>
            <label class="text-sm font-bold tracking-wide text-on-surface">视觉风格</label>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="style in styles" 
              :key="style.value"
              @click="formData.style = style.value"
              class="relative group cursor-pointer active:scale-95 transition-transform"
            >
              <div 
                :class="[
                  'aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container-lowest shadow-sm transition-all',
                  formData.style === style.value ? 'ring-4 ring-primary ring-offset-2 ring-offset-background' : 'border border-transparent'
                ]"
              >
                <img class="w-full h-full object-cover" :src="style.image" :alt="style.label"/>
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl"></div>
                <div class="absolute bottom-3 left-3 right-3">
                  <p class="text-white font-bold text-sm">{{ style.label }}</p>
                </div>
                <div v-if="formData.style === style.value" class="absolute top-3 right-3 w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center shadow-md">
                  <span class="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 生成状态 (显示中) -->
        <section v-if="isGenerating" class="mt-4">
          <div class="bg-primary/5 rounded-3xl p-6 border border-primary/10 relative overflow-hidden">
            <div class="flex items-center justify-between mb-4">
              <div class="flex flex-col">
                <div class="flex items-center gap-2 mb-1">
                  <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span class="text-xs font-bold text-primary uppercase tracking-widest">构思故事中...</span>
                </div>
                <p class="text-on-surface font-bold text-base">正在生成第一章：{{ formData.theme.slice(0, 10) }}...</p>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-primary font-black text-xl">{{ generationProgress }}<span class="text-sm font-bold">%</span></span>
              </div>
            </div>
          </div>
          <div class="h-2.5 w-full bg-primary/10 rounded-full overflow-hidden">
            <div class="h-full bg-primary rounded-full relative overflow-hidden transition-all duration-500" :style="{ width: generationProgress + '%' }">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-loading"></div>
            </div>
          </div>
          <div class="mt-4 py-2 px-3 bg-white/50 rounded-xl flex items-start gap-3">
            <span class="material-symbols-outlined text-[18px] text-primary mt-0.5" style="font-variation-settings: 'FILL' 1;">auto_fix_high</span>
            <p class="text-[13px] text-on-surface-variant leading-tight">
              AI 正在为您精心渲染每一处细节，这一步通常需要 15-30 秒...
            </p>
          </div>
        </section>

        <!-- 温馨提示 -->
        <section class="mt-2 opacity-80">
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-primary text-sm">info</span>
            <h3 class="font-bold text-xs uppercase tracking-widest text-on-surface-variant">温馨提示</h3>
          </div>
          <p class="text-on-surface-variant text-xs leading-relaxed px-1">
            您可以尝试输入具体的角色、场景描述或故事情节。AI 将根据您的风格选择生成独特且连贯的绘本。
          </p>
        </section>
      </main>

      <!-- FAB 按钮 -->
      <div class="fixed bottom-28 left-0 right-0 px-6 z-50">
        <button 
          @click="handleGenerate"
          :disabled="!canGenerate || isGenerating"
          :class="[
            'w-full h-16 rounded-full shadow-lg flex items-center justify-center gap-3 active:scale-[0.96] transition-all group overflow-hidden',
            canGenerate && !isGenerating
              ? 'bg-gradient-to-r from-primary to-primary-fixed-dim shadow-[0_8px_32px_-4px_rgba(88,71,210,0.4)]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >
          <div v-if="canGenerate && !isGenerating" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div :class="['flex items-center justify-center rounded-full p-2']">
            <span class="material-symbols-outlined text-2xl" :class="canGenerate && !isGenerating ? 'text-white' : 'text-gray-400'" style="font-variation-settings: 'FILL' 1;">{{ isGenerating ? 'hourglass_top' : 'magic_button' }}</span>
          </div>
          <span :class="['font-extrabold text-lg tracking-wider', canGenerate && !isGenerating ? 'text-white' : 'text-gray-400']">
            {{ isGenerating ? '生成中...' : '立刻生成绘本' }}
          </span>
        </button>
      </div>

      <MobileBottomNav />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import WebHeader from '@/components/WebHeader.vue'
import WebFooter from '@/components/WebFooter.vue'
import MobileHeader from '@/components/MobileHeader.vue'
import MobileBottomNav from '@/components/MobileBottomNav.vue'
import { createStory } from '@/api/story'

const router = useRouter()

const isMobile = ref(false)
const isGenerating = ref(false)
const generationProgress = ref(0)
const generatingStatus = ref('正在构思故事...')

const formData = ref({
  theme: '',
  ageRange: '3-6',
  style: 'anime'
})

const examples = [
  '一只小猫的冒险故事',
  '森林里的神奇图书馆',
  '飞向火星的宇航兔',
  '会说话的云朵城堡'
]

const ageRanges = [
  { value: '0-3', label: '0-3岁' },
  { value: '3-6', label: '3-6岁' },
  { value: '6-9', label: '6-9岁' },
  { value: '6+', label: '6岁以上' }
]

const styles = [
  { value: 'anime', label: '童趣动漫', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=533&fit=crop' },
  { value: 'watercolor', label: '温润水彩', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=533&fit=crop' },
  { value: 'sketch', label: '复古素描', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=533&fit=crop' },
  { value: '3d', label: '3D 立体', image: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=400&h=533&fit=crop' }
]

const canGenerate = computed(() => {
  return formData.value.theme.trim().length > 0
})

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

const getExampleIcon = (example) => {
  const iconMap = {
    '一只小猫的冒险故事': 'pets',
    '森林里的神奇图书馆': 'auto_stories',
    '飞向火星的宇航兔': 'rocket_launch',
    '会说话的云朵城堡': 'castle'
  }
  return iconMap[example] || 'lightbulb'
}

const getExampleEmoji = (example) => {
  const emojiMap = {
    '一只小猫的冒险故事': '🐱',
    '森林里的神奇图书馆': '📚',
    '飞向火星的宇航兔': '🚀',
    '会说话的云朵城堡': '🏰'
  }
  return emojiMap[example] || '💡'
}

const handleGenerate = async () => {
  if (!canGenerate.value || isGenerating.value) return

  isGenerating.value = true
  generationProgress.value = 0

  const progressInterval = setInterval(() => {
    if (generationProgress.value < 90) {
      generationProgress.value += Math.random() * 15
    }
  }, 1000)

  try {
    const res = await createStory({
      theme: formData.value.theme,
      ageRange: formData.value.ageRange,
      style: formData.value.style
    })

    clearInterval(progressInterval)
    generationProgress.value = 100
    generatingStatus.value = '生成完成！'

    setTimeout(() => {
      router.push(`/preview/${res.data.id}`)
    }, 500)
  } catch (error) {
    clearInterval(progressInterval)
    isGenerating.value = false
    generationProgress.value = 0
    console.error('创建故事失败:', error)
    alert('创建故事失败，请重试')
  }
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
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@keyframes loading-bar {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}

.animate-loading {
  animation: loading-bar 2s infinite ease-in-out;
}
</style>
