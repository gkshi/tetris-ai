<template>
  <aside class="flex column">
    <section>
      <div>
        <button @click="play">play</button>
        <button @click="pause">pause</button>
      </div>

      <div>
        <span>Games played: </span>
        <span>{{ $game.state.gamesPlayed }}</span>
      </div>
      <div>
        <span>Frames: </span>
        <span>{{ frames }}</span>
      </div>
      <div>
        <span>Figures: </span>
        <span>{{ turns }}</span>
      </div>
      <div>
        <strong>Rows burned: </strong>
        <strong>{{ rowsBurned }}</strong>
      </div>
    </section>

    <section>
      <div>
        <div>Difficulty: </div>
        <select name="difficulty" id="difficulty" @change="onDifficultyChanged">
          <option value="easy" :selected="$game.state.difficulty === 'easy'">Easy (blocks)</option>
          <option value="medium" :selected="$game.state.difficulty === 'medium'">Medium (sticks)</option>
          <option value="hard" :selected="$game.state.difficulty === 'hard'">Hard (blocks + sticks)</option>
          <option value="expert" :selected="$game.state.difficulty === 'expert'">Expert (all figures)</option>
        </select>
      </div>
      <div>
        <div>Speed (fps): </div>
        <input type="number" v-model="fpsField">
        <button @click="changeFPS()">change</button>
        <button v-if="$game.state.fps !== 5" @click="resetFPS">reset</button>
      </div>
    </section>

    <section>
      <div>Training </div>
      <div>
        <span>active: </span>
        <select name="training-enabled" id="" @change="onTrainingEnabledChange">
          <option :value="1" :selected="$ml.state.isActive">On</option>
          <option :value="0" :selected="!$ml.state.isActive">Off</option>
        </select>
      </div>
      <div>
        <span>after </span>
        <input type="number" value="1">
        <span> figures</span>
      </div>
      <br>
      <div>
        <div>figuresAmountByColumn: </div>
        <span>{{ $ml.state.figuresAmountByColumn }}</span>
      </div>
    </section>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useMLStore } from '@/stores/ml'

const $game = useGameStore()
const $ml = useMLStore()

const fpsField = ref($game.state.fps)

const frames = computed(() => $game.state.framesDone)
const turns = computed(() => $game.state.turnsDone)
const rowsBurned = computed(() => $game.state.rowsBurned)

const play = () => {
  $game.play()
}

const pause = () => {
  $game.pause()
}

const changeFPS = value => {
  $game.changeFPS(value || fpsField.value)
}

const resetFPS = () => {
  changeFPS(5)
  fpsField.value = 5
}

const onDifficultyChanged = e => {
  $game.state.difficulty = e.target.value
}

const onTrainingEnabledChange = e => {
  $ml.state.isActive = e.target.value === '1'
}
</script>

<style lang="scss" scoped>
aside {
  gap: 30px;
}
</style>
