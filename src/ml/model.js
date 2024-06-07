import * as tf from '@tensorflow/tfjs'

class TetrisAI {
  constructor() {
    this.model = this.createModel()
    this.trainingData = []
    this.labels = []
  }

  createModel() {
    const model = tf.sequential()
    model.add(tf.layers.dense({ units: 128, inputShape: [200], activation: 'relu' })) // игровое поле 10x20
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }))
    model.add(tf.layers.dense({ units: 4, activation: 'softmax' })) // 4 действия: влево, вправо, вниз, вращение

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    return model
  }

  async trainModel(shuffle = false) {
    if (this.trainingData.length === 0) {
      console.log('No training data available')
      return
    }

    const inputs = tf.tensor2d(this.trainingData)
    const labels = tf.tensor2d(this.labels)

    await this.model.fit(inputs, labels, {
      epochs: 10,
      batchSize: 32,
      shuffle,
    })

    console.log('Training complete')
    this.clearData()
  }

  getAction(state) {
    const inputTensor = tf.tensor2d([state])
    const prediction = this.model.predict(inputTensor)
    const action = prediction.argMax(1).dataSync()[0]
    return action
  }

  recordData(state, action) {
    this.trainingData.push(state)
    const actionLabel = Array(4).fill(0)
    actionLabel[action] = 1
    this.labels.push(actionLabel)
  }

  clearData() {
    this.trainingData = []
    this.labels = []
  }
}

export default TetrisAI
