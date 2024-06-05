import './assets/scss/index.scss'

import * as tf from '@tensorflow/tfjs'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.config.globalProperties.$tf = tf

app.use(createPinia())
app.use(router)

app.mount('#app')
