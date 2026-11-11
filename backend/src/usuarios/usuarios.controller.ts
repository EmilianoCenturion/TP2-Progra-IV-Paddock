import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { JwtGuard } from '../auth/jwt.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CrearUsuarioDto } from './dto/crear-usuario.dto.js';

@UseGuards(JwtGuard, AdminGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  listar() {
    return this.usuariosService.listar();
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  crear(@Body() dto: CrearUsuarioDto, @UploadedFile() imagen?: Express.Multer.File) {
    return this.usuariosService.registrar(dto, imagen, dto.perfil);
  }

  @Delete(':id')
  deshabilitar(@Param('id') id: string, @Req() req: any) {
    return this.usuariosService.deshabilitar(id, req.usuario.sub);
  }

  @Post(':id/rehabilitar')
  @HttpCode(HttpStatus.OK)
  rehabilitar(@Param('id') id: string) {
    return this.usuariosService.rehabilitar(id)
  }
}
