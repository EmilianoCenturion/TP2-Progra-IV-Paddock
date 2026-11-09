import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Falta el token');
        }

        try {
            request.usuario = await this.jwtService.verifyAsync(token);
            return true;
        } catch {
            throw new UnauthorizedException('El token es inválido o venció');
        }
    }
}