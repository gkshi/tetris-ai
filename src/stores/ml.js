import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useMLStore = defineStore('ml', () => {
  const state = reactive({
    isActive: true,
    figuresAmountByColumn: Array(10).fill(0),
  })

  return { state }
})
