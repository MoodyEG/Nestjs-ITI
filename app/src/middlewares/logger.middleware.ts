import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.table({
      method: req.method,
      path: req.path,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: req.body,
    });
    next();
  }
}
