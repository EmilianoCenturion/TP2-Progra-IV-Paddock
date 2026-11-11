import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import { PublicacionesController } from './publicaciones.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './entities/publicacion.entity.js';
import { ImagenesModule } from '../imagenes/imagenes.module.js';
import { ComentariosController } from './comentarios.controller.js';
import { ComentariosService } from './comentarios.service.js';
import { Comentario, ComentarioSchema } from './entities/comentario.entity.js';
import { EstadisticasService } from './estadisticas.service.js';
import { EstadisticasController } from './estadisticas.controller.js';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Publicacion.name, schema: PublicacionSchema },
    { name: Comentario.name, schema: ComentarioSchema},
    ]), ImagenesModule],
  controllers: [PublicacionesController, ComentariosController, EstadisticasController],
  providers: [PublicacionesService, ComentariosService, EstadisticasService],
})
export class PublicacionesModule {}
