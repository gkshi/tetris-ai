import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useMLStore = defineStore('ml', () => {
  const state = reactive({
    isActive: true,
  })

  return { state }
})
