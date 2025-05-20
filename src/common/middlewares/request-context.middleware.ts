import { MikroORM, RequestContext } from '@mikro-orm/core';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private orm: MikroORM) {}

  use(_req: Request, _res: Response, next: NextFunction) {
    RequestContext.create(this.orm.em, next);
  }
}
