import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service.js';
import { CreatePublicacionDto } from './dto/create-publicaciones.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  crear(@Body() dto: CreatePublicacionDto, @UploadedFile() imagen?: Express.Multer.File) {
    return this.publicacionesService.crear(dto, imagen);
  }
  
}
