import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const bearer = req.headers.authorization;
    if (!bearer) throw new UnauthorizedException('Unauthorized');
    if (!bearer.startsWith('Bearer '))
      throw new UnauthorizedException('Unauthorized');
    const token = bearer.split(' ')[1];
    if (!token) throw new UnauthorizedException('Unauthorized');

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      req['user'] = payload;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Unauthorized');
    }

    next();
  }
}
