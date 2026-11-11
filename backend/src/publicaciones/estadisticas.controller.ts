import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service.js';
import { EstadisticasDto } from './dto/estadisticas.dto.js';
import { JwtGuard } from '../auth/jwt.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';

@UseGuards(JwtGuard, AdminGuard)
@Controller('estadisticas')
export class EstadisticasController {

    constructor(private readonly estadisticasService: EstadisticasService) {}

    @Get('publicaciones-por-usuario')
    publicacionesPorUsuario(@Query() dto: EstadisticasDto) {
        return this.estadisticasService.publicacionesPorUsuario(dto);
    }

    @Get('comentarios')
    comentariosPorDia(@Query() dto: EstadisticasDto) {
        return this.estadisticasService.comentariosPorDia(dto);
    }

    @Get('comentarios-por-publicacion')
    comentariosPorPublicacion(@Query() dto: EstadisticasDto) {
        return this.estadisticasService.comentariosPorPublicacion(dto);
    }
}