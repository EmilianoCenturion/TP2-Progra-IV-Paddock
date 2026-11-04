import { Controller, Post, Get, Body, UploadedFile, UseInterceptors, Query, Delete, Param } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service.js';
import { CreatePublicacionDto } from './dto/create-publicaciones.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto.js';
import { DeletePublicacionDto } from './dto/delete-publicacion.dto.js';
import { LikePublicacionDto } from './dto/like-publicacion.dto.js';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  crear(@Body() dto: CreatePublicacionDto, @UploadedFile() imagen?: Express.Multer.File) {
    return this.publicacionesService.crear(dto, imagen);
  }
  
  @Get()
  listar(@Query() filtros: ListarPublicacionesDto) {
    return this.publicacionesService.listar(filtros);
  }

  @Delete(":id")
  eliminar(@Param('id') id: string, @Body() dto: DeletePublicacionDto) {
    return this.publicacionesService.eliminar(id, dto.usuario, dto.perfil);
  }

  @Post(":id/like")
  darLike(@Param('id') id: string, @Body() dto: LikePublicacionDto) {
    return this.publicacionesService.darLike(id, dto.usuario)
  }
  
  @Delete(":id/like")
  quitarLike(@Param('id') id: string, @Body() dto: LikePublicacionDto) {
    return this.publicacionesService.quitarLike(id, dto.usuario)
  }
}
