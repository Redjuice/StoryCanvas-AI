<template>
  <router-view />
  <Toast />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getUserInfo } from '@/api/auth'
import Toast from '@/components/Toast.vue'

const userStore = useUserStore()

onMounted(async () => {
  // 如果有 token，获取用户信息
  if (userStore.token && !userStore.userInfo) {
    try {
      const res = await getUserInfo()
      userStore.setUserInfo(res.data)
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取失败，清除 token
      userStore.logout()
    }
  }
})
</script>
