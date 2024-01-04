import express, { Request, Response, Express, json } from 'express'
import serverless from 'serverless-http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { AuthRouter } from './modules/auth/router'
import { GlobalErrorHandler } from './utils/GlobalErrorHandler'
import { usersRouter } from './modules/users/router'
import { filesRouter } from './modules/file-nodes/router'
import { PrismaService } from './base/PrismaService'

const app: Express = express()
const port = process.env.PORT
app.use(
  cors({
    credentials: true,
    origin: '*',
  })
)
app.use(json())
app.use(cookieParser())

app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/files', filesRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use(GlobalErrorHandler.main)

app.listen(port, () => {
  console.log(`Example app listening on port  ${port}`)
})

process.on('uncaughtException', async (err) => {
  console.log(err)
  await PrismaService.$disconnect()
  process.exit(1)
})
export const handler = serverless(app)
