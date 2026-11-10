import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { PasswordHasher } from '@nestjs/authentication';
import { ImagenesService } from '../imagenes/imagenes.service.js';
import { RegistroUsuarioDto } from './dto/registro.dto.js';
import { LoginUsuarioDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private readonly usuariosService: UsuariosService, 
              private readonly passwordHasher: PasswordHasher,
              private readonly imagenesService: ImagenesService,
              private readonly jwtService: JwtService) {}
  
  async registro(dto: RegistroUsuarioDto, imagen?: Express.Multer.File) {
    if (dto.contrasena !== dto.repetirContrasena) {
      throw new BadRequestException("Las contraseñas no coinciden");
    }

    if (await this.usuariosService.existeEmail(dto.email)) {
      throw new ConflictException("Ese correo ya esta registrado");
    }

    if (await this.usuariosService.existeNombreUsuario(dto.nombreUsuario)) {
      throw new ConflictException("Ese nombre de usuario ya esta en uso");
    }

    let imagenUrl: string | undefined;
    
    if (imagen) {
      const esImagen = imagen.mimetype.startsWith("image/");
      const pesoImagen = imagen.size < (2 * 1024 * 1024);

      if (!esImagen || !pesoImagen) {
        throw new BadRequestException("La imagen debe ser JPG, PNG o similar y pesar menos de 2 MB");
      }

      imagenUrl = await this.imagenesService.subirImagen(imagen, 'perfiles');
    }

    const contrasenaHasheada = await this.passwordHasher.hash(dto.contrasena);

    const { repetirContrasena, ...datos} = dto;

    const usuario = await this.usuariosService.crear({...datos, fechaNacimiento: new Date(dto.fechaNacimiento), contrasena: contrasenaHasheada, imagenUrl });

    const { contrasena, ...usuarioSinContrasena } = usuario.toObject();

    const token = await this.generarToken(usuarioSinContrasena)

    return { usuario: usuarioSinContrasena, token};
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
