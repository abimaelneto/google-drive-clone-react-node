import express, {
  Request,
  Response,
  Express,
  json,
  NextFunction,
} from 'express'
import serverless from 'serverless-http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { AuthRouter } from './modules/auth/router'
import { GlobalErrorHandler } from './utils/GlobalErrorHandler'

const app: Express = express()
const port = process.env.PORT
app.use(cors())
app.use(json())
app.use(cookieParser())

app.use('/api/v1/auth', AuthRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('hey there')
  req.requestTime = new Date().toISOString()
  // console.log(req.cookies);
  next()
})

app.use(GlobalErrorHandler.main)

app.listen(port, () => {
  console.log(`Example app listening on port  ${port}`)
})

export const handler = serverless(app)
