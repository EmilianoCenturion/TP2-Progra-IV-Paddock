import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import { PublicacionesController } from './publicaciones.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './entities/publicacion.entity.js';
import { ImagenesModule } from '../imagenes/imagenes.module.js';
@Module({
  imports: [MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }]), ImagenesModule],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
