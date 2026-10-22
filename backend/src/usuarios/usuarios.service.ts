import { Injectable, ParseBoolPipe } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './entities/usuario.entity.js';
import { Model } from 'mongoose';
import { retry } from 'rxjs';
import { resourceLimits } from 'worker_threads';

@Injectable()
export class UsuariosService {
  
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>) {}

  crear(createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioModel.create(createUsuarioDto);
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

}
