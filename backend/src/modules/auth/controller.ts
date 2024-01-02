import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import jwt, { JwtPayload } from 'jsonwebtoken'
import AppError from '../../utils/AppError'
import { CreateUserResponseDTO } from '../users/dtos/createUserDTO'
import { Prisma } from '@prisma/client'

export class AuthController {
  prismaUsersRepository: Prisma.UserDelegate
  constructor(prismaUsersRepository: Prisma.UserDelegate) {
    this.prismaUsersRepository = prismaUsersRepository
  }

  signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    })
  }

  createSendToken = (
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

  signup = catchAsync(async (req: Request, res: Response) => {
    const newUser = await this.prismaUsersRepository.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    })
    delete (newUser as { password?: string }).password
    this.createSendToken(newUser, 201, req, res)
  })

  login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body

      if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
      }
      const user = await this.prismaUsersRepository.findFirst({
        where: { email },
      })
      if (!user || password != user.password) {
        return next(new AppError('Incorrect email or password', 401))
      }
      delete (user as { password?: string }).password
      this.createSendToken(user, 200, req, res)
    }
  )
  protect = catchAsync(
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

      const decoded = jwt.verify(token, process.env.JWT_SECRET || '')

      const currentUser = await this.prismaUsersRepository.findUniqueOrThrow({
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
  restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role)) {
        return next(
          //eslint-disable-next-line quotes
          new AppError("You don't have permission to perform this action", 403)
        )
      }
      next()
    }
  }
  me = catchAsync(async (req: Request, res: Response) => {
    res.json(req.user)
  })
  signOut = catchAsync(async (req: Request, res: Response) => {
    res.cookie('jwt', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    })
    res.status(200).send()
  })
}
