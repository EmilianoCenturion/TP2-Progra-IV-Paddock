import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { PasswordHasher } from '@nestjs/authentication';
import { RegistroUsuarioDto } from './dto/registro.dto.js';
import { LoginUsuarioDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private readonly usuariosService: UsuariosService, 
              private readonly passwordHasher: PasswordHasher,
              private readonly jwtService: JwtService) {}
  
  async registro(dto: RegistroUsuarioDto, imagen?: Express.Multer.File) {

    const usuario = await this.usuariosService.registrar(dto, imagen);

    const token = await this.generarToken(usuario)

    return { usuario, token};
  }

  async login(dto: LoginUsuarioDto) {
    const usuario = await this.usuariosService.buscarPorEmailOUsuario(dto.usuario);

    const valida = await this.passwordHasher.verify(dto.contrasena, usuario?.contrasena);

    if (!usuario || !valida) {
      throw new UnauthorizedException("Las credenciales no son correctas");
    }

    if (!usuario.habilitado) {
      throw new ForbiddenException("Tu cuenta esta deshabilitada");
    }

    const { contrasena , ...usuarioSinContrasena } = usuario.toObject()

    const token = await this.generarToken(usuarioSinContrasena);

    return { usuario: usuarioSinContrasena, token };
  }

  private generarToken(usuario: { _id: any; email: string; nombreUsuario: string; perfil: string }) {
    return this.jwtService.signAsync({
      sub: usuario._id.toString(),
      email: usuario.email,
      nombreUsuario: usuario.nombreUsuario,
      perfil: usuario.perfil,
    });
  }

  private async verificar(token?: string) {
    if (!token) throw new UnauthorizedException('Falta el token');

    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error: any) {
      throw new UnauthorizedException('El token es inválido o venció');
    }
  }

  async autorizar(token?: string) {
    const payload = await this.verificar(token);
    
    const usuario = await this.usuariosService.buscarPorId(payload.sub);
    
    if (!usuario || !usuario.habilitado) {
      throw new UnauthorizedException('Tu sesión no es válida');
    }

    return usuario;
  }

  async refrescar(token?: string) {
    const { sub, email, nombreUsuario, perfil } = await this.verificar(token);
    return { token: await this.jwtService.signAsync({ sub, email, nombreUsuario, perfil }) };
  }
}
