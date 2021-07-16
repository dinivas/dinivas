import { Keycloak } from './keycloak';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthzGuard implements CanActivate {
  private readonly logger = new Logger(AuthzGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const permissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    if (!roles && (!permissions || (permissions && permissions.length === 0))) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    request['requiredPermissions'] = permissions;
    // Check Keycloak permissions
    return new Promise<boolean>((resolve, reject) => {
      try {
        Keycloak.enforcer(permissions, {
          response_mode: 'permissions'
        })(request, response, () => {
          resolve(true);
        });
      } catch (error) {
        this.logger.error(`Error: ${error} on ${request.url}`);
        reject(error);
      }
    });
  }
}
