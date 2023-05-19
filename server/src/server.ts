import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { resolve } from 'node:path'
import { memoriesRoutes } from './routes/memories'
import { authRoute } from './routes/auth'
import { uploadRoutes } from './routes/upload'

const app = fastify()

app.register(multipart)

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(cors, {
  // Aqui se coloca as url do front end que podem acessar o back-end
  // no caso ['http://localhost:3333', 'http://urldaprodução']
  origin: true,
})
app.register(jwt, {
  // Mudar em fase de produção
  secret: 'spacetime',
})
app.register(memoriesRoutes)
app.register(authRoute)
app.register(uploadRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
