import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { environment } from 'apps/api/src/environments/environment';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        // This header should be provide by Keycloak Gatekeeper
        if (!request.header(environment.headerRoleAttribute)) {
            return false;
        }
        const user_roles = request.headers[environment.headerRoleAttribute].split(',');
        const hasRole = () => user_roles.some((role) => roles.includes(role));
        return hasRole();
    }
}
