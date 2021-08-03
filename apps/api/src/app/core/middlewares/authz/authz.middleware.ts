/* eslint-disable @typescript-eslint/ban-types */
import { Keycloak } from './../../../auth/keycloak';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthzMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthzMiddleware.name);

  use(req: Request, res: Response, next: Function) {
    // try {
    //   Keycloak.enforcer(
    //     ['project:view', 'project:create'],
    //     { response_mode: 'permissions' }
    //   )(req, res, () => next());
    // } catch (error) {
    //   this.logger.error(`Error: ${error} on ${req.url}`);
    //   throw error;
    // }
    next();
  }
}
