import express, { Request, Response, Express } from 'express'
import serverless from 'serverless-http'
import cors from 'cors'
import 'dotenv/config'

const app: Express = express()
const port = process.env.PORT
app.use(cors())
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port  ${port}`)
})

export const handler = serverless(app)
