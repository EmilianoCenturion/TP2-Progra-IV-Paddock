import { BadRequestException, ConflictException, flatten, Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './entities/usuario.entity.js';
import { Model, Types } from 'mongoose';
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

  listar() {
    return this.usuarioModel.find()
    .sort("-createdAt")
    .exec();
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

  private async buscarParaAdmin(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("El ID no es correcto");
    }

    const usuario =  await this.usuarioModel.findById(id);

    if (!usuario) {
      throw new NotFoundException("El usuario no fue encontrado");
    }

    return usuario;
  }

  async deshabilitar(id: string, adminId: string) {
    if (id === adminId) {
      throw new BadRequestException("No podes deshabilitar tu propia cuenta");
    }

    const usuario = await this.buscarParaAdmin(id);

    if (!usuario.habilitado) {
      throw new ConflictException("El usuario ya esta deshabilitado");
    }

    usuario.habilitado = false;

    await usuario.save()

    return { message: "Usuario deshabilitado"}
  }

  async rehabilitar(id: string) {
    const usuario = await this.buscarParaAdmin(id);

    if (usuario.habilitado) {
      throw new ConflictException("El usuario ya esta habilitado");
    }

    usuario.habilitado = true;

    await usuario.save()

    return { message: "Usuario habilitado"}
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