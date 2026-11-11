import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadisticasDto } from './dto/estadisticas.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario, ComentarioDocument } from './entities/comentario.entity.js';
import { Publicacion, PublicacionDocument } from './entities/publicacion.entity.js';
import { Model } from 'mongoose';

@Injectable()
export class EstadisticasService {

    constructor(
        @InjectModel(Publicacion.name) private readonly publicacionModel: Model<PublicacionDocument>,
        @InjectModel(Comentario.name) private readonly comentarioModel: Model<ComentarioDocument>,           
    ) {}
    
    private rango(dto: EstadisticasDto) {
        const desde = new Date(dto.desde);

        const hasta = new Date(dto.hasta);

        if (desde > hasta ) {
            throw new NotFoundException("La fecha no puede se mayor que hasta");
        }

        hasta.setDate(hasta.getDate() + 1);

        return { $gte: desde, $lt: hasta };
    }

    publicacionesPorUsuario(dto: EstadisticasDto) {
        return this.publicacionModel.aggregate([
            { $match: { createdAt: this.rango(dto) } },
            { $group: { _id: '$autor', cantidad: { $sum: 1 } } },
            { $lookup: { from: 'usuarios', localField: '_id', foreignField: '_id', as: 'usuario' } },
            { $unwind: '$usuario' },
            {
                $project: {
                    _id: 0,
                    nombreUsuario: '$usuario.nombreUsuario',
                    equipoFavorito: '$usuario.equipoFavorito',
                    imagenUrl: '$usuario.imagenUrl',
                    cantidad: 1,
                },
            },
            { $sort: { cantidad: -1 } },
        ]).exec();
    }

    comentariosPorDia(dto: EstadisticasDto) {
        return this.comentarioModel.aggregate([
            { $match: { createdAt: this.rango(dto) } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: '-03:00' } }, cantidad: { $sum: 1 } } },
            { $project: { _id: 0, fecha: '$_id', cantidad: 1 } },
            { $sort: { fecha: 1 } },
        ]).exec()
    }

    comentariosPorPublicacion(dto: EstadisticasDto) {
        return this.comentarioModel.aggregate([
            { $match: { createdAt: this.rango(dto) } },
            { $group: { _id: '$publicacion', cantidad: { $sum: 1 } } },
            { $lookup: { from: 'publicaciones', localField: '_id', foreignField: '_id', as: 'publicacion' } },
            { $unwind: '$publicacion' },
            { $project: { _id: 0, titulo: '$publicacion.titulo', cantidad: 1 } },
            { $sort: { cantidad: -1 } },
            { $limit: 10 }
        ]).exec();
    }
}
