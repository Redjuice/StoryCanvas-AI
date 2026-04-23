<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <h2 class="text-3xl font-bold text-center mb-8">注册</h2>
      <form @submit.prevent="onRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input v-model="form.email" type="email" class="input-field" placeholder="请输入邮箱" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input v-model="form.password" type="password" class="input-field" placeholder="请输入密码" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
          <input v-model="form.confirmPassword" type="password" class="input-field" placeholder="请确认密码" required />
        </div>
        <button type="submit" class="btn-primary w-full py-3">注册</button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        已有账号？<router-link to="/auth/login" class="text-primary">登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'

const router = useRouter()
const form = ref({ email: '', password: '', confirmPassword: '' })

const onRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('两次密码输入不一致')
    return
  }
  try {
    await register({ email: form.value.email, password: form.value.password })
    alert('注册成功')
    router.push('/auth/login')
  } catch (error) {
    alert(error.message || '注册失败')
  }
}
</script>
