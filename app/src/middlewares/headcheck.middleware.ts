import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HeadCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const customHeader = req.header('custom-header');
    const expectedHeader = process.env.CUSTOM_HEADER;

    if (!customHeader) {
      return res.status(400).json({ message: 'Missing custom-header' });
    }

    if (customHeader !== expectedHeader) {
      return res.status(401).json({ message: 'Invalid custom-header value' });
    }

    next();
  }
}
