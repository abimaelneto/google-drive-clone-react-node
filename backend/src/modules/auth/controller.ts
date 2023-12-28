import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { PrismaService } from '../../base/PrismaService'
import AppError from '../../utils/AppError'
import { CreateUserResponseDTO } from '../users/dtos/createUserDTO'

export class AuthController {
  constructor() {}

  static signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    })
  }

  static createSendToken = (
    user: CreateUserResponseDTO,
    statusCode: number,
    req: Request,
    res: Response
  ) => {
    const token = this.signToken(user.id)
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() +
          parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '') *
            24 *
            60 *
            60 *
            1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    })

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    })
  }

  static signup = catchAsync(async (req: Request, res: Response) => {
    const newUser = await PrismaService.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    })
    delete (newUser as { password?: string }).password
    this.createSendToken(newUser, 201, req, res)
  })

  static login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body

      if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
      }
      const user = await PrismaService.user.findUnique({ where: { email } })
      if (!user || password != user.password) {
        return next(new AppError('Incorrect email or password', 401))
      }
      delete (user as { password?: string }).password
      this.createSendToken(user, 200, req, res)
    }
  )
  static protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let token
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1]
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt
      }
      if (!token) {
        return next(
          new AppError(
            'You are not logged in! Please log in to get access.',
            401
          )
        )
      }
      console.log(token, process.env.JWT_SECRET)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '')
      console.log({ decoded })
      const currentUser = await PrismaService.user.findUniqueOrThrow({
        where: { id: (decoded as JwtPayload).id },
      })
      if (!currentUser) {
        return next(
          new AppError(
            'The user belonging to this token does no longer exist.',
            401
          )
        )
      }
      req.user = currentUser
      res.locals.user = currentUser
      next()
    }
  )
  static restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You don't have permission to perform this action", 403)
        )
      }
      next()
    }
  }
}
