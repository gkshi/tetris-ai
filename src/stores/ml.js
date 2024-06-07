import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useMLStore = defineStore('ml', () => {
  const state = reactive({
    isActive: true,
    filledCellsAmountByColumn: Array(10).fill(0),
    columnHeights: Array(10).fill(0),
  })

  return { state }
})
