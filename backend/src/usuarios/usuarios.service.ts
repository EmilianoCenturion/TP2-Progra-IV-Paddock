import { BadRequestException, ConflictException, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './entities/usuario.entity.js';
import { Model } from 'mongoose';
import { PasswordHasher } from '@nestjs/authentication';
import { ImagenesService } from '../imagenes/imagenes.service.js';
import { RegistroUsuarioDto } from '../auth/dto/registro.dto.js';

@Injectable()
export class UsuariosService {
  
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>, private readonly passwordHasher: PasswordHasher, private readonly imagenesService: ImagenesService) {}

  crear(datos: Partial<Usuario>) {
    return this.usuarioModel.create(datos);
  }

  buscarPorEmailOUsuario(valor: string) {
    valor = valor.trim().toLowerCase();
    return this.usuarioModel.findOne({ $or: [ {email: valor}, {nombreUsuario: valor}]} )
    .select("+contrasena")
    .exec()
  }

  async existeEmail(email: string) {
    email = email.trim().toLowerCase();
    
    const resultado = await this.usuarioModel.exists({ email: email }).exec();

    return !!resultado;
  }

  async existeNombreUsuario(nombreUsuario: string) {
    nombreUsuario = nombreUsuario.trim().toLowerCase();
    
    const resultado = await this.usuarioModel.exists({ nombreUsuario: nombreUsuario }).exec();

    return !!resultado;
  }

  buscarPorId(id: string) {
    return this.usuarioModel.findById(id).exec();
  }

  async registrar(dto: RegistroUsuarioDto, imagen?: Express.Multer.File, perfil = 'usuario') {
    if (dto.contrasena !== dto.repetirContrasena) {
      throw new BadRequestException("Las contraseñas no coinciden");
    }

    if (await this.existeEmail(dto.email)) {
      throw new ConflictException("Ese correo ya esta registrado");
    }

    if (await this.existeNombreUsuario(dto.nombreUsuario)) {
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

    const usuario = await this.crear({...datos, fechaNacimiento: new Date(dto.fechaNacimiento), contrasena: contrasenaHasheada, imagenUrl, perfil});

    const { contrasena, ...usuarioSinContrasena } = usuario.toObject();

    return usuarioSinContrasena;
  } 
}  