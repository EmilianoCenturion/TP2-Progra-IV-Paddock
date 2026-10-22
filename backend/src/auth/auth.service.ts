import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service.js';

@Injectable()
export class AuthService {

  constructor (private readonly usuariosService: UsuariosService) {}

}
