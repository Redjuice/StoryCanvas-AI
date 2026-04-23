import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStoryStore = defineStore('story', () => {
  const currentStory = ref(null)
  const generatingPages = ref([])
  const generatingStatus = ref('idle')

  const setCurrentStory = (story) => {
    currentStory.value = story
  }

  const updatePage = (pageIndex, pageData) => {
    if (currentStory.value && currentStory.value.pages[pageIndex]) {
      currentStory.value.pages[pageIndex] = pageData
    }
  }

  const setGeneratingStatus = (status) => {
    generatingStatus.value = status
  }

  const isPageGenerating = (pageIndex) => {
    return generatingPages.value.includes(pageIndex)
  }

  const reset = () => {
    currentStory.value = null
    generatingPages.value = []
    generatingStatus.value = 'idle'
  }

  return {
    currentStory,
    generatingPages,
    generatingStatus,
    setCurrentStory,
    updatePage,
    setGeneratingStatus,
    isPageGenerating,
    reset,
  }
})
