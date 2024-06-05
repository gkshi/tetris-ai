import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const state = reactive({
    _p5: null,
    isActive: false,
    isPaused: false,
    rowsBurned: 0,
    gamesPlayed: 0,
    turnsDone: 0,
    framesDone: 0,
    isFirstPlay: true,
    difficulty: 'hard',
    fps: 5,
  })

  function setP5 (value) {
    state._p5 = value
  }

  function start () {
    state.isActive = true
    state.isFirstPlay = false
    state._p5.loop()
  }

  function restart () {
    state.isActive = true
    state.isPaused = false
    // state.isFirstPlay = true
    state.framesDone = 0
    state.turnsDone = 0
    state._p5.loop()
  }

  function play () {
    if (state.isPaused) {
      pause()
    }
    if (!state.isActive) {
      return start()
    }
  }

  function pause () {
    if (state.isPaused) {
      state._p5.loop()
      state.isPaused = false
      state.isActive = true
    } else {
      state._p5.noLoop()
      state.isPaused = true
      state.isActive = false
    }
  }

  function changeFPS (fps) {
    state.fps = Number(fps)
    state._p5.setFrameRate(fps)
  }

  return { state, setP5, start, pause, play, restart, changeFPS }
})
