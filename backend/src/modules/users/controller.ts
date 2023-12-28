import { Request, Response, NextFunction } from 'express'
import { UsersService } from './service'
import AppError from '../../utils/AppError'
import { catchAsync } from '../../utils/catchAsync'

export class UsersController {
  service?: UsersService
  constructor(service: UsersService) {
    this.service = service
  }
  create = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password, role, name } = req.body || {}
      if (!email || !password || !role || !name)
        return next(new AppError('Email or password or username missing', 400))
      const newUser = await this.service?.create({
        email,
        password,
        role,
        name,
      })
      return res.json({ data: newUser })
    }
  )
  list = catchAsync(async (req: Request, res: Response) => {
    const data = await this.service?.list()
    return res.json(data)
  })
  get = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
    const { userId } = req.params
    if(!userId) return next(new AppError('Missing required param userId', 400))
    const user = await this.service?.get(userId)
    return res.json(user)
  })
  update = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
    const { userId } = req.params
    if(!userId) return next(new AppError('Missing required param userId', 400))
    await this.service?.update(userId, req.body)
    return res.status(204)
  })
  delete = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId } = req.params
      const user = this.service?.get(userId)
      if (!user) return next(new AppError('User not found.', 404))
      this.service?.delete(userId)
      return res.status(204)
    }
  )
}
