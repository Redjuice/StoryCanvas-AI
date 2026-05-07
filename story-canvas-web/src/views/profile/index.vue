<template>
  <div class="min-h-screen bg-surface">
    <!-- Web端布局 (>= 768px) -->
    <template v-if="!isMobile">
      <WebHeader />

      <main class="max-w-screen-2xl mx-auto px-8 py-12">
        <!-- Hero Header -->
        <div class="mb-12">
          <h1 class="text-5xl font-black text-on-surface mb-4 tracking-tight">个人中心</h1>
          <p class="text-on-surface-variant text-xl max-w-xl">
            管理你的个人信息和账户安全设置
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- Left: User Info Card -->
          <div class="lg:col-span-4 space-y-6">
            <div class="glass-panel p-8 rounded-xl border border-outline-variant/15 text-center">
              <div class="relative inline-block mb-6">
                <div class="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center mx-auto overflow-hidden relative">
                  <img 
                    v-if="userInfo.avatar" 
                    :src="userInfo.avatar" 
                    class="w-full h-full object-cover"
                    alt="avatar"
                  />
                  <span v-else class="material-symbols-outlined text-5xl text-primary">person</span>
                  <!-- 上传中遮罩 -->
                  <div v-if="isUploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span class="material-symbols-outlined text-white animate-spin">sync</span>
                  </div>
                </div>
                <label class="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <span class="material-symbols-outlined text-sm">photo_camera</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    @change="handleAvatarUpload"
                    :disabled="isUploading"
                  />
                </label>
              </div>
              <h2 class="text-2xl font-bold text-on-surface mb-2">{{ userInfo.nickname || '用户' }}</h2>
              <p class="text-on-surface-variant text-sm mb-6">{{ userInfo.email }}</p>
              <div class="flex items-center justify-center gap-4 text-sm text-on-surface-variant">
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-primary">auto_stories</span>
                  <span>{{ stats.stories }} 个故事</span>
                </div>
                <div class="w-[1px] h-4 bg-outline-variant"></div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-primary">calendar_today</span>
                  <span>加入 {{ formatDate(userInfo.createdAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="glass-panel p-6 rounded-xl border border-outline-variant/15">
              <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">bolt</span>
                快捷操作
              </h3>
              <div class="space-y-3">
                <router-link to="/create" class="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl hover:bg-primary/5 transition-colors group">
                  <span class="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">add_circle</span>
                  <div>
                    <p class="font-bold text-on-surface">创作新故事</p>
                    <p class="text-xs text-on-surface-variant">开始你的下一个绘本</p>
                  </div>
                </router-link>
                <router-link to="/bookshelf" class="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl hover:bg-primary/5 transition-colors group">
                  <span class="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">library_books</span>
                  <div>
                    <p class="font-bold text-on-surface">我的书架</p>
                    <p class="text-xs text-on-surface-variant">查看所有作品</p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Right: Settings -->
          <div class="lg:col-span-8 space-y-8">
            <!-- Basic Info -->
            <section class="bg-surface-container rounded-xl p-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">1</span>
                  <h2 class="text-xl font-bold text-on-surface">基本信息</h2>
                </div>
                <button 
                  @click="isEditing ? handleSave() : (isEditing = true)"
                  class="px-4 py-2 bg-primary-container text-primary rounded-full text-sm font-bold hover:bg-primary/10 transition-colors flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-sm">{{ isEditing ? 'save' : 'edit' }}</span>
                  {{ isEditing ? '保存' : '编辑' }}
                </button>
              </div>

              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">昵称</label>
                    <input 
                      v-model="editForm.nickname"
                      :disabled="!isEditing"
                      class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface disabled:opacity-60 transition-all"
                      placeholder="请输入昵称"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">邮箱</label>
                    <input 
                      v-model="editForm.email"
                      disabled
                      class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface opacity-60"
                      placeholder="请输入邮箱"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">个人简介</label>
                  <textarea 
                    v-model="editForm.bio"
                    :disabled="!isEditing"
                    class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface disabled:opacity-60 h-24 resize-none transition-all"
                    placeholder="介绍一下你自己..."
                  ></textarea>
                </div>
              </div>
            </section>

            <!-- Security Settings -->
            <section class="bg-surface-container rounded-xl p-8">
              <div class="flex items-center gap-3 mb-6">
                <span class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">2</span>
                <h2 class="text-xl font-bold text-on-surface">账户安全</h2>
              </div>

              <div class="space-y-4">
                <!-- Change Password -->
                <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary">lock</span>
                    <div>
                      <p class="font-bold text-on-surface">修改密码</p>
                      <p class="text-xs text-on-surface-variant">定期更换密码保护账户安全</p>
                    </div>
                  </div>
                  <button 
                    @click="showPasswordModal = true"
                    class="px-4 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    修改
                  </button>
                </div>

                <!-- Logout -->
                <div class="flex items-center justify-between p-4 bg-error-container/30 rounded-xl border border-error/10">
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-error">logout</span>
                    <div>
                      <p class="font-bold text-error">退出登录</p>
                      <p class="text-xs text-error/70">退出当前账户</p>
                    </div>
                  </div>
                  <button 
                    @click="handleLogout"
                    class="px-4 py-2 bg-error text-white rounded-full text-sm font-bold hover:bg-error/90 transition-colors"
                  >
                    退出
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <WebFooter />
    </template>

    <!-- H5端布局 (< 768px) -->
    <template v-else>
      <MobileHeader />

      <main class="px-6 pt-6 pb-32">
        <!-- User Info Card -->
        <div class="glass-panel p-6 rounded-2xl border border-outline-variant/15 text-center mb-6">
          <div class="relative inline-block mb-4">
            <div class="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mx-auto overflow-hidden relative">
              <img 
                v-if="userInfo.avatar" 
                :src="userInfo.avatar" 
                class="w-full h-full object-cover"
                alt="avatar"
              />
              <span v-else class="material-symbols-outlined text-4xl text-primary">person</span>
              <!-- 上传中遮罩 -->
              <div v-if="isUploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span class="material-symbols-outlined text-white animate-spin text-sm">sync</span>
              </div>
            </div>
            <label class="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer">
              <span class="material-symbols-outlined text-xs">photo_camera</span>
              <input 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleAvatarUpload"
                :disabled="isUploading"
              />
            </label>
          </div>
          <h2 class="text-xl font-bold text-on-surface mb-1">{{ userInfo.nickname || '用户' }}</h2>
          <p class="text-on-surface-variant text-sm mb-4">{{ userInfo.email }}</p>
          <div class="flex items-center justify-center gap-4 text-xs text-on-surface-variant">
            <div class="flex items-center gap-1">
              <span class="material-symbols-outlined text-primary text-sm">auto_stories</span>
              <span>{{ stats.stories }} 个故事</span>
            </div>
            <div class="w-[1px] h-3 bg-outline-variant"></div>
            <div class="flex items-center gap-1">
              <span class="material-symbols-outlined text-primary text-sm">calendar_today</span>
              <span>加入 {{ formatDate(userInfo.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Settings List -->
        <div class="space-y-4">
          <!-- Basic Info -->
          <section class="bg-surface-container rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-on-surface">基本信息</h3>
              <button 
                @click="isEditing ? handleSave() : (isEditing = true)"
                class="text-primary text-sm font-bold flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-sm">{{ isEditing ? 'save' : 'edit' }}</span>
                {{ isEditing ? '保存' : '编辑' }}
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">昵称</label>
                <input 
                  v-model="editForm.nickname"
                  :disabled="!isEditing"
                  class="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface disabled:opacity-60"
                  placeholder="请输入昵称"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">邮箱</label>
                <input 
                  v-model="editForm.email"
                  disabled
                  class="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface opacity-60"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">个人简介</label>
                <textarea 
                  v-model="editForm.bio"
                  :disabled="!isEditing"
                  class="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface disabled:opacity-60 h-20 resize-none"
                  placeholder="介绍一下你自己..."
                ></textarea>
              </div>
            </div>
          </section>

          <!-- Security -->
          <section class="bg-surface-container rounded-2xl p-6">
            <h3 class="font-bold text-on-surface mb-4">账户安全</h3>
            <div class="space-y-3">
              <button 
                @click="showPasswordModal = true"
                class="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-xl active:scale-[0.98] transition-transform"
              >
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-primary">lock</span>
                  <div class="text-left">
                    <p class="font-bold text-on-surface text-sm">修改密码</p>
                    <p class="text-xs text-on-surface-variant">定期更换密码保护账户安全</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </button>

              <button 
                @click="handleLogout"
                class="w-full flex items-center justify-between p-4 bg-error-container/30 rounded-xl border border-error/10 active:scale-[0.98] transition-transform"
              >
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-error">logout</span>
                  <div class="text-left">
                    <p class="font-bold text-error text-sm">退出登录</p>
                    <p class="text-xs text-error/70">退出当前账户</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-error">chevron_right</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <MobileBottomNav />
    </template>

    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showPasswordModal = false">
      <div class="bg-surface-container rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-on-surface">修改密码</h3>
          <button @click="showPasswordModal = false" class="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-variant transition-colors">
            <span class="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">当前密码</label>
            <input 
              v-model="passwordForm.currentPassword"
              type="password"
              class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface"
              placeholder="请输入当前密码"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">新密码</label>
            <input 
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface"
              placeholder="请输入新密码（至少6位）"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">确认新密码</label>
            <input 
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface"
              placeholder="请再次输入新密码"
            />
          </div>
        </div>
        <div class="flex gap-3 mt-8">
          <button 
            @click="showPasswordModal = false"
            class="flex-1 py-3 bg-surface-container-high text-on-surface font-bold rounded-full hover:bg-surface-variant transition-colors"
          >
            取消
          </button>
          <button 
            @click="handleChangePassword"
            class="flex-1 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors"
          >
            确认修改
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import WebHeader from '@/components/WebHeader.vue'
import WebFooter from '@/components/WebFooter.vue'
import MobileHeader from '@/components/MobileHeader.vue'
import MobileBottomNav from '@/components/MobileBottomNav.vue'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { getUserInfo, updateUserInfo, changePassword } from '@/api/user'
import { uploadApi } from '@/api/upload'
import { getErrorMessage } from '@/api/index'

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()

const isMobile = ref(false)
const isEditing = ref(false)
const showPasswordModal = ref(false)
const isUploading = ref(false)

const userInfo = ref({
  nickname: '',
  email: '',
  avatar: '',
  createdAt: '',
})

const stats = ref({
  stories: 0,
})

const editForm = reactive({
  nickname: '',
  email: '',
  bio: '',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
  })
}

const loadUserInfo = async () => {
  try {
    const res = await getUserInfo()
    if (res.data) {
      userInfo.value = res.data
      editForm.nickname = res.data.nickname || ''
      editForm.email = res.data.email || ''
      editForm.bio = res.data.bio || ''
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const handleSave = async () => {
  try {
    await updateUserInfo({
      nickname: editForm.nickname,
      bio: editForm.bio,
    })
    userInfo.value.nickname = editForm.nickname
    userInfo.value.bio = editForm.bio
    isEditing.value = false
    toastStore.success('保存成功')
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

const handleChangePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toastStore.warning('两次输入的密码不一致')
    return
  }
  if (passwordForm.newPassword.length < 6) {
    toastStore.warning('密码长度至少6位')
    return
  }
  try {
    await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
    showPasswordModal.value = false
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    toastStore.success('密码修改成功')
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/auth/login')
  }
}

// 处理头像上传
const handleAvatarUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    toastStore.warning('请选择图片文件')
    return
  }

  // 验证文件大小 (最大 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toastStore.warning('图片大小不能超过 5MB')
    return
  }

  isUploading.value = true
  try {
    // 重命名文件为头像专用名称
    const avatarFile = new File([file], `avatar-${Date.now()}.${file.name.split('.').pop()}`, { type: file.type })
    const result = await uploadApi.uploadToQiniu(avatarFile)

    // 更新用户头像
    await updateUserInfo({
      avatar: result.url,
    })

    userInfo.value.avatar = result.url
    userStore.setUserInfo({ ...userStore.userInfo, avatar: result.url })
    toastStore.success('头像上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    toastStore.error(getErrorMessage(error) || '头像上传失败')
  } finally {
    isUploading.value = false
    // 清空 input 值，允许重复选择同一文件
    event.target.value = ''
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  loadUserInfo()
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
