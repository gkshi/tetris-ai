<template>
  <div id="game_field" class="game-field"></div>
</template>

<script setup>
import p5 from 'p5/lib/p5.min'
import { computed, onMounted, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import TetrisAI from '@/ml/model'
import { useMLStore } from '@/stores/ml'

const $game = useGameStore()
const $ml = useMLStore()
const $ai = new TetrisAI()
const _p5 = computed(() => $game.state._p5)

const colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red']
const currentPiece = ref(createPiece())
const cols = 10
const rows = 20
const gridSize = 30

const createEmptyGrid = () => {
  let grid = []
  for (let y = 0; y < rows; y++) {
    grid[y] = []
    for (let x = 0; x < cols; x++) {
      grid[y][x] = 0
    }
  }
  return grid
}

let grid = createEmptyGrid()

const drawGrid = () => {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      _p5.value.fill(grid[y][x] ? colors[grid[y][x] - 1] : 28)
      _p5.value.stroke(20)
      _p5.value.rect(x * gridSize, y * gridSize, gridSize, gridSize)
    }
  }
}

function clearRows(grid) {
  let cleared = 0
  for (let y = rows - 1; y >= 0; y--) {
    let fullRow = true
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fullRow = false
        break
      }
    }
    if (fullRow) {
      for (let yy = y; yy > 0; yy--) {
        grid[yy] = grid[yy - 1].slice()
      }
      grid[0] = Array(cols).fill(0)
      y++
      cleared++
    }
  }
  return cleared
}

function createPiece() {
  const pieces = [
    [[1, 1], [1, 1]], // куб
    [[1, 1, 1, 1]], // палка
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 0], [0, 1, 1]],
    [[1, 1, 1], [1, 0, 0]],
  ]
  const easyPieces = [pieces[0]] // только кубы
  const mediumPieces = [pieces[1]] // только палки
  const hardPieces = [pieces[0], pieces[1]] // кубы и палки
  let type
  let shape
  switch ($game.state.difficulty) {
  case 'easy':
    type = Math.floor(Math.random() * easyPieces.length)
    shape = easyPieces[type]
    break
  case 'medium':
    type = Math.floor(Math.random() * mediumPieces.length)
    shape = mediumPieces[type]
    break
  case 'hard':
    type = Math.floor(Math.random() * hardPieces.length)
    shape = hardPieces[type]
    break
  default:
    type = Math.floor(Math.random() * pieces.length)
    shape = pieces[type]
    break
  }
  return {
    type: type,
    color: Math.floor(Math.random() * colors.length + 1),
    shape: shape,
    x: Math.floor(cols / 2) - Math.floor(shape[0].length / 2),
    y: 0,
  }
}

const showPiece = piece => {
  _p5.value.fill(colors[piece.color - 1])
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        _p5.value.rect((piece.x + x) * gridSize, (piece.y + y) * gridSize, gridSize, gridSize)
      }
    }
  }
}

function updatePiece(piece) {
  piece.y++
}

function movePiece(piece, dir) {
  piece.x += dir
  if (collides(grid, piece)) {
    piece.x -= dir
  }
}

function dropPiece(piece) {
  while (!collides(grid, piece)) {
    piece.y++
  }
  piece.y--
}

function rotatePiece(piece) {
  let newShape = []
  for (let y = 0; y < piece.shape[0].length; y++) {
    newShape[y] = []
    for (let x = 0; x < piece.shape.length; x++) {
      newShape[y][x] = piece.shape[piece.shape.length - x - 1][y]
    }
  }
  let oldShape = piece.shape
  piece.shape = newShape
  if (collides(grid, piece)) {
    piece.shape = oldShape
  }
}

function lockPiece(grid, piece) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        let newX = piece.x + x
        let newY = piece.y + y
        if (newY < rows && newX < cols) {
          grid[newY][newX] = piece.color
        }
      }
    }
  }
}

function collides(grid, piece) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        let newX = piece.x + x
        let newY = piece.y + y
        if (newX < 0 || newX >= cols || newY >= rows || grid[newY][newX]) {
          return true
        }
      }
    }
  }
  return false
}

function performAction(action) {
  switch (action) {
  case 0:
    movePiece(currentPiece.value, -1)
    break
  case 1:
    movePiece(currentPiece.value, 1)
    break
  case 2:
    dropPiece(currentPiece.value)
    break
  case 3:
    rotatePiece(currentPiece.value)
    break
  }
}

function getState(grid, piece) {
  let state = grid.flat()
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        let newX = piece.x + x
        let newY = piece.y + y
        if (newY >= 0 && newY < rows && newX >= 0 && newX < cols) {
          state[newY * cols + newX] = piece.color
        }
      }
    }
  }
  return state
}

const draw = (isRerender = false) => {
  _p5.value.background(0)
  drawGrid()
  if (!$game.state.isFirstPlay) {
    showPiece(currentPiece.value)
  }
  if ($game.state.isActive && !isRerender) {
    updatePiece(currentPiece.value)

    if (collides(grid, currentPiece.value)) {
      currentPiece.value.y--
      lockPiece(grid, currentPiece.value)
      $game.state.rowsBurned += clearRows(grid)
      $game.state.turnsDone++
      currentPiece.value = createPiece()
      if (collides(grid, currentPiece.value)) {
        $game.state.gamesPlayed++
        currentPiece.value = createPiece()
        grid = createEmptyGrid()
        $game.restart()

        if ($ml.state.isActive) {
          // TODO: здесь тренировать модель после конца игры
          $ai.trainModel()
        }
      }
    }

    // ai move
    if ($ml.state.isActive && currentPiece.value) {
      const state = getState(grid, currentPiece.value)
      const action = $ai.getAction(state)
      performAction(action)
    }

    $game.state.framesDone++
  }
}

const keyPressed = () => {
  if (!$game.state.isPaused) {
    if (_p5.value.keyCode === _p5.value.LEFT_ARROW) {
      movePiece(currentPiece.value, -1)
    } else if (_p5.value.keyCode === _p5.value.RIGHT_ARROW) {
      movePiece(currentPiece.value, 1)
    } else if (_p5.value.keyCode === _p5.value.DOWN_ARROW) {
      dropPiece(currentPiece.value)
    } else if (_p5.value.keyCode === 32) {
      rotatePiece(currentPiece.value)
    }
    draw(true)
  }
}

const setup = () => {
  const canvas = _p5.value.createCanvas(cols * gridSize, rows * gridSize)
  canvas.parent('game_field')
  _p5.value.setFrameRate($game.state.fps)
  _p5.value.keyPressed = keyPressed
  _p5.value.draw = draw
  _p5.value.setup = setup
}

onMounted(() => {
  new p5(instance => {
    instance.setup = setup
    $game.setP5(instance)
  })
})
</script>

<style lang="scss">
.game-field {
  border: 1px solid #2d2d2d;

  canvas {
    display: block;
    background: #191919;
  }
}
</style>