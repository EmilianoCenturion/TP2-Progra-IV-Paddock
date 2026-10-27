import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './entities/usuario.entity.js';
import { Model } from 'mongoose';
;

@Injectable()
export class UsuariosService {
  
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>) {}

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

}
