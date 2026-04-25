import { defineStore } from 'pinia'
import { ref, reactive, nextTick } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let idCounter = 0

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = ++idCounter
    
    // 创建响应式对象
    const toast = reactive({
      id,
      message,
      type,
      duration,
      show: false,
    })
    
    toasts.value.push(toast)
    
    // 触发进入动画
    nextTick(() => {
      toast.show = true
    })
    
    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value[index].show = false
      // 等待动画结束后移除
      setTimeout(() => {
        const idx = toasts.value.findIndex(t => t.id === id)
        if (idx > -1) {
          toasts.value.splice(idx, 1)
        }
      }, 300)
    }
  }

  // 快捷方法
  const success = (message, duration) => addToast(message, 'success', duration)
  const error = (message, duration) => addToast(message, 'error', duration)
  const warning = (message, duration) => addToast(message, 'warning', duration)
  const info = (message, duration) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
})
