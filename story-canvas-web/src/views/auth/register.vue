<template>
  <div class="min-h-screen bg-[#f7f9fc] font-sans text-[#191c1e] flex flex-col">
    <!-- 主容器 -->
    <main class="flex-grow flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <!-- 背景装饰元素 -->
      <div class="hidden md:block absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#e4dfff] opacity-20 rounded-full blur-[100px]"></div>
      <div class="hidden md:block absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#63fbcf] opacity-20 rounded-full blur-[100px]"></div>
      
      <!-- 注册卡片包装器 -->
      <div class="w-full max-w-sm z-10">
        <!-- Logo 区域 -->
        <div class="text-center mb-8 md:mb-10">
          <div class="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#5847d2] rounded-xl mb-3 md:mb-4 shadow-lg shadow-[#5847d2]/20">
            <svg class="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-[#191c1e] mb-2">StoryCanvas AI</h1>
          <p class="text-sm md:text-base text-[#494458] font-medium">绘梦画布，开启您的AI创作之旅</p>
        </div>

        <!-- 卡片内容 -->
        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-[0_32px_64px_-12px_rgba(88,71,210,0.06)] border border-[#cbc3dc]/15">
          <!-- 标签页头 -->
          <div class="flex justify-center gap-6 md:gap-8 mb-6 md:mb-8">
            <router-link to="/auth/login" class="text-base md:text-lg font-medium text-[#494458] hover:text-[#5847d2] transition-colors pb-1">登录</router-link>
            <button class="text-base md:text-lg font-bold text-[#5847d2] border-b-2 border-[#5847d2] pb-1">注册</button>
          </div>

          <form @submit.prevent="onRegister" class="space-y-4 md:space-y-5">
            <!-- 邮箱字段 -->
            <div class="space-y-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#7a748a] px-1">邮箱地址</label>
              <div class="relative group">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a748a] group-focus-within:text-[#5847d2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <input v-model="form.email" type="email" class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-[#f2f4f7] border-none rounded-lg focus:ring-2 focus:ring-[#5847d2]/20 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#7a748a]/60" placeholder="example@storycanvas.ai" required />
              </div>
            </div>

            <!-- 密码字段 -->
            <div class="space-y-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#7a748a] px-1">密码</label>
              <div class="relative group">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a748a] group-focus-within:text-[#5847d2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="w-full pl-12 pr-12 py-3 md:py-3.5 bg-[#f2f4f7] border-none rounded-lg focus:ring-2 focus:ring-[#5847d2]/20 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#7a748a]/60" placeholder="••••••••" required />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a748a] hover:text-[#5847d2]">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 确认密码字段 -->
            <div class="space-y-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#7a748a] px-1">确认密码</label>
              <div class="relative group">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a748a] group-focus-within:text-[#5847d2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="w-full pl-12 pr-12 py-3 md:py-3.5 bg-[#f2f4f7] border-none rounded-lg focus:ring-2 focus:ring-[#5847d2]/20 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#7a748a]/60" placeholder="••••••••" required />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a748a] hover:text-[#5847d2]">
                  <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 注册按钮 -->
            <button type="submit" :disabled="loading" class="w-full py-3.5 md:py-4 bg-gradient-to-r from-[#5847d2] to-[#c6bfff] text-white font-bold rounded-full shadow-lg shadow-[#5847d2]/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
              {{ loading ? '注册中...' : '注册' }}
            </button>

            <!-- 分隔线 -->
            <div class="flex items-center gap-4 py-1 md:py-2">
              <div class="h-[1px] flex-grow bg-[#cbc3dc]/30"></div>
              <span class="text-xs font-bold text-[#7a748a] uppercase tracking-widest">或通过以下方式</span>
              <div class="h-[1px] flex-grow bg-[#cbc3dc]/30"></div>
            </div>

            <!-- 社交登录 -->
            <button type="button" class="w-full flex items-center justify-center gap-3 py-3 md:py-3.5 bg-white border border-[#cbc3dc]/30 rounded-full hover:bg-[#f2f4f7] hover:scale-[1.02] active:scale-95 transition-all duration-200">
              <div class="w-6 h-6 flex items-center justify-center bg-[#07C160] rounded-full">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"></path>
                </svg>
              </div>
              <span class="font-bold text-[#494458]">微信注册</span>
            </button>
          </form>
        </div>

        <!-- 底部提示 -->
        <div class="mt-8 md:mt-12 flex flex-col items-center gap-3 md:gap-4 opacity-70">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#5847d2] to-[#c6bfff] border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
            <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#a83639] to-[#ffb3b0] border-2 border-white flex items-center justify-center text-white text-xs font-bold">B</div>
            <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#006b54] to-[#63fbcf] border-2 border-white flex items-center justify-center text-white text-xs font-bold">C</div>
          </div>
          <p class="text-xs md:text-sm font-medium text-[#494458] text-center max-w-[260px] md:max-w-[280px]">
            加入超过 <span class="text-[#5847d2] font-bold">10,000+</span> 位创作者，<br/>用 AI 编织你的梦幻画卷。
          </p>
        </div>
      </div>

      <!-- 浮动装饰图标 (仅 PC 端) -->
      <div class="hidden lg:block absolute left-20 top-1/4 scale-150 opacity-20 rotate-[-12deg]">
        <svg class="w-24 h-24 text-[#5847d2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path>
        </svg>
      </div>
      <div class="hidden lg:block absolute right-32 bottom-20 scale-125 opacity-10 rotate-[15deg]">
        <svg class="w-20 h-20 text-[#006b54]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96a.996.996 0 000-1.41z"></path>
        </svg>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="w-full py-6 md:py-12 px-4 md:px-8 mt-auto bg-[#eceef1]">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 max-w-screen-2xl mx-auto">
        <div class="text-base md:text-lg font-bold text-[#5847d2]">StoryCanvas AI</div>
        <div class="flex flex-wrap justify-center gap-4 md:gap-6">
          <a href="#" class="text-xs md:text-sm text-[#494458] hover:text-[#5847d2] hover:underline decoration-2 underline-offset-4 transition-all duration-300">联系我们</a>
          <a href="#" class="text-xs md:text-sm text-[#494458] hover:text-[#5847d2] hover:underline decoration-2 underline-offset-4 transition-all duration-300">服务条款</a>
          <a href="#" class="text-xs md:text-sm text-[#494458] hover:text-[#5847d2] hover:underline decoration-2 underline-offset-4 transition-all duration-300">隐私政策</a>
        </div>
        <div class="text-xs md:text-sm text-[#494458]">© 2024 StoryCanvas AI. 绘梦画布版权所有</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'

const router = useRouter()
const form = ref({ email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const onRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('两次密码输入不一致')
    return
  }
  loading.value = true
  try {
    await register({ 
      email: form.value.email, 
      password: form.value.password,
      nickname: form.value.email.split('@')[0]
    })
    alert('注册成功')
    router.push('/auth/login')
  } catch (error) {
    alert(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>
