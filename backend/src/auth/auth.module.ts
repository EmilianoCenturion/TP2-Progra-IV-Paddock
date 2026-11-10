import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { ImagenesModule } from '../imagenes/imagenes.module.js';
import { AuthenticationModule } from "@nestjs/authentication"
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsuariosModule,
    ImagenesModule,
    AuthenticationModule.forRoot({ globalGuard: false }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}