import * as tf from '@tensorflow/tfjs'

class TetrisAI {
  constructor() {
    this.model = this.createModel()
  }

  createModel() {
    const model = tf.sequential()
    model.add(tf.layers.dense({ units: 128, inputShape: [200], activation: 'relu' })) // Допустим, игровое поле 10x20
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }))
    model.add(tf.layers.dense({ units: 4, activation: 'softmax' })) // 4 действия: влево, вправо, вниз, вращение

    // model.add(tf.layers.dense({ units: 64, inputShape: [200], activation: 'relu' }))
    // model.add(tf.layers.dense({ units: 4, activation: 'linear' }))
    // model.compile({ optimizer: 'adam', loss: 'meanSquaredError' })

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    return model
  }

  async trainModel(xs, ys, figuresAmountByColumn) {
    console.log('trainModel', xs, ys, figuresAmountByColumn)
    // const combinedInput = xs.concat($ml.state.figuresAmountByColumn)
    // const inputTensor = tf.tensor2d([combinedInput])
    // const outputTensor = tf.tensor2d([ys])
    //
    // await this.model.fit(inputTensor, outputTensor, {
    //   epochs: 10,
    //   callbacks: {
    //     onEpochEnd: (epoch, logs) => {
    //       console.log(`Epoch ${epoch}: loss = ${logs.loss}`)
    //     },
    //   },
    // })
  }

  getAction(state) {
    // if (Math.random() < 0.1) {
    //   return Math.floor(Math.random() * 4);
    // }
    // const qValues = this.model.predict(tf.tensor2d([state])).arraySync()[0]
    // return qValues.indexOf(Math.max(...qValues))

    const inputTensor = tf.tensor2d([state])
    const prediction = this.model.predict(inputTensor)
    const action = prediction.argMax(1).dataSync()[0]
    return action
  }
}

export default TetrisAI
