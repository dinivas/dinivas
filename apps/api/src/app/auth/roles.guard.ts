import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

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
        const grant = request.kauth.grant;
        if (!grant || !grant.access_token.content.realm_access.roles) {
            return false;
        }
        const hasRole = () => grant.access_token.content.realm_access.roles.some((role) => roles.includes(role));
        return grant && grant.access_token.content.realm_access && hasRole();
    }
}
