import { Controller, Post, Get, Body, UploadedFile, UseInterceptors, Query, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service.js';
import { CreatePublicacionDto } from './dto/create-publicaciones.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto.js';
import { JwtGuard } from '../auth/jwt.guard.js';

@UseGuards(JwtGuard)
@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  crear(@Body() dto: CreatePublicacionDto, @Req() req: any, @UploadedFile() imagen?: Express.Multer.File) {
    return this.publicacionesService.crear(dto, req.usuario.sub, imagen);
  }

  @Get()
  listar(@Query() filtros: ListarPublicacionesDto) {
    return this.publicacionesService.listar(filtros);
  }
  
  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.publicacionesService.buscarPorId(id);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.eliminar(id, req.usuario.sub, req.usuario.perfil);
  }

  @Post(':id/like')
  darLike(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.darLike(id, req.usuario.sub);
  }

  @Delete(':id/like')
  quitarLike(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.quitarLike(id, req.usuario.sub);
  }
}