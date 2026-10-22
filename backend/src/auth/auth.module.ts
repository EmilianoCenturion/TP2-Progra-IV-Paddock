import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';

@Module({
  imports: [UsuariosModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
