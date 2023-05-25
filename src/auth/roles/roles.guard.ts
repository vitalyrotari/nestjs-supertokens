import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenPayload, Role, SessionRequest } from '../auth.types';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<SessionRequest>();

    const payload: AccessTokenPayload =
      request.session?.getAccessTokenPayload();

    return requiredRoles.every((role) => payload.roles.includes(role));
  }
}
