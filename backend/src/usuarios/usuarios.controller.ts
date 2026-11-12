import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { JwtGuard } from '../auth/jwt.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CrearUsuarioDto } from './dto/crear-usuario.dto.js';
import { EditarPerfilDto } from './dto/editar-perfil.dto.js';

@UseGuards(JwtGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Put('mi-perfil')
  editarPerfil(@Body() dto: EditarPerfilDto, @Req() req: any) {
    return this.usuariosService.editarPerfil(req.usuario.sub, dto);
  }

  @Get()
  @UseGuards(AdminGuard)
  listar() {
    return this.usuariosService.listar();
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  crear(@Body() dto: CrearUsuarioDto, @UploadedFile() imagen?: Express.Multer.File) {
    return this.usuariosService.registrar(dto, imagen, dto.perfil);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deshabilitar(@Param('id') id: string, @Req() req: any) {
    return this.usuariosService.deshabilitar(id, req.usuario.sub);
  }

  @Post(':id/rehabilitar')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  rehabilitar(@Param('id') id: string) {
    return this.usuariosService.rehabilitar(id)
  }
}
