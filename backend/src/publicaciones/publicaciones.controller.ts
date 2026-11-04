import { Controller, Post, Get, Body, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service.js';
import { CreatePublicacionDto } from './dto/create-publicaciones.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto.js';

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
}
