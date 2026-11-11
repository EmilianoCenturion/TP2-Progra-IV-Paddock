import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ComentariosService } from './comentarios.service.js';
import { ListarComentariosDto } from './dto/listar-comentario.dto.js';
import { ComentarioDto } from './dto/comentario.dto.js';
import { JwtGuard } from '../auth/jwt.guard.js';

@UseGuards(JwtGuard)
@Controller('publicaciones/:publicacionId/comentarios')
export class ComentariosController {

    constructor(private readonly comentariosService: ComentariosService) {}

    @Get()
    listar(@Param('publicacionId') publicacionId: string, @Query() filtros: ListarComentariosDto) {
        return this.comentariosService.listar(publicacionId, filtros);    
    }

    @Post()
    crear(@Param('publicacionId') publicacionId: string, @Body() dto: ComentarioDto, @Req() req: any) {
        return this.comentariosService.crear(publicacionId, req.usuario.sub, dto);
    }

    @Put(':id')
    editar(@Param('publicacionId') publicacionId: string, @Param('id') id: string, @Body() dto: ComentarioDto, @Req() req: any) {
        return this.comentariosService.editar(publicacionId, id, req.usuario.sub, dto);
    }
}
