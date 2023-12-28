import { NextFunction, Request, Response } from 'express'
import AppError from './AppError'

export class GlobalErrorHandler {
  static sendErrorDev(err: AppError, req: Request, res: Response) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    })
  }

  static main(
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log('hey main')
    if (process.env.NODE_ENV === 'development') {
      console.log('dev')
      return GlobalErrorHandler.sendErrorDev(
        new AppError(
          err.message,
          err instanceof AppError ? err.statusCode : 500
        ),
        req,
        res
      )
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err }
      error.message = err.message
    }
    return GlobalErrorHandler.sendErrorDev(
      new AppError(err.message, err instanceof AppError ? err.statusCode : 500),
      req,
      res
    )
  }
}
