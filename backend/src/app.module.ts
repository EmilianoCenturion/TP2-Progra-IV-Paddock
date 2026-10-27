import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { PublicacionesModule } from './publicaciones/publicaciones.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ImagenesModule } from './imagenes/imagenes.module.js';

@Module({
  imports: [ ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_URI!), UsuariosModule, PublicacionesModule, AuthModule, ImagenesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
