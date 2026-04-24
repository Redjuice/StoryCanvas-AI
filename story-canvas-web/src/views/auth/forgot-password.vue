<template>
  <div class="min-h-screen bg-[#f7f9fc] font-sans text-[#191c1e] flex flex-col">
    <!-- 主容器 -->
    <main class="flex-grow flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <!-- 背景装饰元素 -->
      <div class="hidden md:block absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#e4dfff] opacity-20 rounded-full blur-[100px]"></div>
      <div class="hidden md:block absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#63fbcf] opacity-20 rounded-full blur-[100px]"></div>
      
      <!-- 忘记密码卡片包装器 -->
      <div class="w-full max-w-sm z-10">
        <!-- Logo 区域 -->
        <div class="text-center mb-8 md:mb-10">
          <div class="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#5847d2] rounded-xl mb-3 md:mb-4 shadow-lg shadow-[#5847d2]/20">
            <svg class="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-[#191c1e] mb-2">重置密码</h1>
          <p class="text-sm md:text-base text-[#494458] font-medium">输入邮箱获取验证码，重置您的密码</p>
        </div>

        <!-- 卡片内容 -->
        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-[0_32px_64px_-12px_rgba(88,71,210,0.06)] border border-[#cbc3dc]/15">
          <form @submit.prevent="onSubmit" class="space-y-5 md:space-y-6">
            <!-- 邮箱字段 -->
            <div class="space-y-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#7a748a] px-1">邮箱地址</label>
              <div class="relative group">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a748a] group-focus-within:text-[#5847d2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <input v-model="form.email" type="email" class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-[#f2f4f7] border-none rounded-lg focus:ring-2 focus:ring-[#5847d2]/20 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#7a748a]/60" placeholder="example@storycanvas.ai" required :disabled="codeSent" />
              </div>
            </div>

            <!-- 验证码字段 -->
            <div class="space-y-2" v-if="codeSent">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#7a748a] px-1">验证码</label>
              <div class="flex gap-2">
                <div class="relative group flex-1">
                  <input v-model="form.code" type="text" class="w-full px-4 py-3 md:py-3.5 bg-[#f2f4f7] border-none rounded-lg focus:ring-2 focus:ring-[#5847d2]/20 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#7a748a]/60 text-center tracking-widest" placeholder="000000" maxlength="6" required />
                </div>
              </div>
            </div>

            <!-- 新密码字段 -->
            <div class="space-y-2" v-if="codeSent">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#7a748a] px-1">新密码</label>
              <div class="relative group">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a748a] group-focus-within:text-[#5847d2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <input v-model="form.newPassword" :type="showPassword ? 'text' : 'password'" class="w-full pl-12 pr-12 py-3 md:py-3.5 bg-[#f2f4f7] border-none rounded-lg focus:ring-2 focus:ring-[#5847d2]/20 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#7a748a]/60" placeholder="••••••••" required />
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

            <!-- 确认新密码字段 -->
            <div class="space-y-2" v-if="codeSent">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#7a748a] px-1">确认新密码</label>
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

            <!-- 发送验证码按钮 -->
            <button v-if="!codeSent" type="button" @click="sendCode" :disabled="sending || countdown > 0" class="w-full py-3.5 md:py-4 bg-gradient-to-r from-[#5847d2] to-[#c6bfff] text-white font-bold rounded-full shadow-lg shadow-[#5847d2]/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
              {{ countdown > 0 ? `${countdown}秒后重试` : (sending ? '发送中...' : '发送验证码') }}
            </button>

            <!-- 重置密码按钮 -->
            <button v-else type="submit" :disabled="loading" class="w-full py-3.5 md:py-4 bg-gradient-to-r from-[#5847d2] to-[#c6bfff] text-white font-bold rounded-full shadow-lg shadow-[#5847d2]/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
              {{ loading ? '重置中...' : '重置密码' }}
            </button>

            <!-- 返回登录 -->
            <div class="text-center">
              <router-link to="/auth/login" class="text-sm font-semibold text-[#5847d2] hover:underline decoration-2 underline-offset-4">
                ← 返回登录
              </router-link>
            </div>
          </form>
        </div>
      </div>

      <!-- 浮动装饰图标 (仅 PC 端) -->
      <div class="hidden lg:block absolute left-20 top-1/4 scale-150 opacity-20 rotate-[-12deg]">
        <svg class="w-24 h-24 text-[#5847d2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { sendResetCode, resetPassword } from '@/api/auth'

const router = useRouter()
const form = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})
const loading = ref(false)
const sending = ref(false)
const codeSent = ref(false)
const countdown = ref(0)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const sendCode = async () => {
  if (!form.email) {
    alert('请输入邮箱地址')
    return
  }
  sending.value = true
  try {
    await sendResetCode({ email: form.email })
    codeSent.value = true
    startCountdown()
    alert('验证码已发送，请查收邮件')
  } catch (error) {
    alert(error.message || '发送验证码失败')
  } finally {
    sending.value = false
  }
}

const onSubmit = async () => {
  if (form.newPassword !== form.confirmPassword) {
    alert('两次密码输入不一致')
    return
  }
  loading.value = true
  try {
    await resetPassword({
      email: form.email,
      code: form.code,
      newPassword: form.newPassword
    })
    alert('密码重置成功，请使用新密码登录')
    router.push('/auth/login')
  } catch (error) {
    alert(error.message || '密码重置失败')
  } finally {
    loading.value = false
  }
}
</script>
