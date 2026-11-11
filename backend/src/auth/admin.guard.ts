import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request.usuario?.perfil !== 'administrador') {
      throw new ForbiddenException('Solo un administrador puede hacer esto');
    }

    return true;
  }
}