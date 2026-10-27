import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { PasswordHasher } from '@nestjs/authentication';
import { ImagenesService } from '../imagenes/imagenes.service.js';
import { RegistroUsuarioDto } from './dto/registro.dto.js';

@Injectable()
export class AuthService {

  constructor(private readonly usuariosService: UsuariosService, 
              private readonly passwordHasher: PasswordHasher,
              private readonly imagenesService: ImagenesService) {}
  
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
      const tamañoImagen = imagen.size < (2 * 1024 * 1024);

      if (!esImagen || !tamañoImagen) {
        throw new BadRequestException("La imagen debe ser JPG, PNG o similar y pesar menos de 2 MB");
      }

      imagenUrl = await this.imagenesService.subirImagen(imagen, 'perfiles');
    }

    const contrasenaHasheada = await this.passwordHasher.hash(dto.contrasena);

    const { repetirContrasena, ...datos} = dto;

    const usuario = await this.usuariosService.crear({...datos, fechaNacimiento: new Date(dto.fechaNacimiento), contrasena: contrasenaHasheada, imagenUrl });

    const { contrasena, ...usuarioSinContrasena } = usuario.toObject();

    return usuarioSinContrasena;
  }
}
