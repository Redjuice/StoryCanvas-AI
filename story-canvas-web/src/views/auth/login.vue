<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <h2 class="text-3xl font-bold text-center mb-8">登录</h2>
      <form @submit.prevent="onLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input v-model="form.email" type="email" class="input-field" placeholder="请输入邮箱" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input v-model="form.password" type="password" class="input-field" placeholder="请输入密码" required />
        </div>
        <button type="submit" class="btn-primary w-full py-3">登录</button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        没有账号？<router-link to="/auth/register" class="text-primary">注册</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const form = ref({ email: '', password: '' })

const onLogin = async () => {
  try {
    const res = await login(form.value)
    userStore.setToken(res.data.token)
    userStore.setUserInfo(res.data.user)
    router.push('/')
  } catch (error) {
    alert(error.message || '登录失败')
  }
}
</script>
