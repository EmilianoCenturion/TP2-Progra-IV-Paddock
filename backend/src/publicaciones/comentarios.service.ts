import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion, PublicacionDocument } from './entities/publicacion.entity.js';
import { Model, Types } from 'mongoose';
import { Comentario, ComentarioDocument } from './entities/comentario.entity.js';
import { ComentarioDto } from './dto/comentario.dto.js';
import { ListarComentariosDto } from './dto/listar-comentario.dto.js';

@Injectable()
export class ComentariosService {

    constructor(
        @InjectModel(Publicacion.name) private readonly publicacionModel: Model<PublicacionDocument>,
        @InjectModel(Comentario.name) private readonly comentarioModel: Model<ComentarioDocument>,           
    ) {}

    async crear(publicacionId: string, autorId: string, dto: ComentarioDto) {
        if (!Types.ObjectId.isValid(publicacionId)) {
            throw new BadRequestException("El ID no es correcto");
        }
        
        const publicacion = await this.publicacionModel.findOne( {_id: publicacionId, activa: true });

        if (!publicacion) {
            throw new NotFoundException("La publicacion no existe");
        }

        const comentario = await this.comentarioModel.create({ mensaje: dto.mensaje, autor: new Types.ObjectId(autorId), publicacion: new Types.ObjectId(publicacionId)})

        return comentario.populate('autor', 'nombre apellido nombreUsuario imagenUrl equipoFavorito')
    }

    async listar(publicacionId: string, filtros: ListarComentariosDto) {
        if (!Types.ObjectId.isValid(publicacionId)) {
            throw new BadRequestException("El ID no es correcto");
        }
        
        const { offset = 0, limit= 5 } = filtros;

        const filtro = { publicacion: publicacionId};

        const comentarios = await this.comentarioModel.find(filtro)
        .sort('-createdAt')
        .skip(offset * limit)
        .limit(limit)
        .populate('autor', 'nombre apellido nombreUsuario imagenUrl equipoFavorito')
        .exec();

        const total = await this.comentarioModel.countDocuments(filtro);

        return { comentarios, total };
    }

    async editar(publicacionId: string, id: string, usuarioId: string, dto: ComentarioDto) {
        if (!Types.ObjectId.isValid(publicacionId) || !Types.ObjectId.isValid(id)) {
            throw new BadRequestException("El ID no es correcto");
        }

        const comentario = await this.comentarioModel.findOne( {_id: id, publicacion: publicacionId });

        if (!comentario) {
            throw new NotFoundException("Comentario no encontrado");
        }

        if (comentario.autor.toString() !== usuarioId) {
            throw new ForbiddenException("Solo el autor puede editar su comentario");
        }

        comentario.mensaje = dto.mensaje;

        comentario.modificado = true;

        await comentario.save();

        return comentario.populate('autor', 'nombre apellido nombreUsuario imagenUrl equipoFavorito');
    }
}
