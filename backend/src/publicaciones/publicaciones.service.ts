import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion, PublicacionDocument } from './entities/publicacion.entity.js';
import { Model, Types } from  'mongoose';
import { ImagenesService } from '../imagenes/imagenes.service.js';
import { CreatePublicacionDto } from './dto/create-publicaciones.dto.js';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto.js';

@Injectable()
export class PublicacionesService {

    constructor(@InjectModel(Publicacion.name) private readonly publicacionModel: Model<PublicacionDocument>, private readonly imagenesService: ImagenesService) {}

    async crear(dto: CreatePublicacionDto, imagen?: Express.Multer.File) {
        let imagenUrl: string | undefined;

        if (imagen) {
            const esImagen = imagen.mimetype.startsWith("image/");
            const pesoImagen = imagen.size < (2 * 1024 * 1024);

            if (!esImagen || !pesoImagen) {
                throw new BadRequestException("La imagen debe ser JPG, PNG o similar y pesar menos de 2 MB");
            }

            imagenUrl = await this.imagenesService.subirImagen(imagen, 'publicaciones')
        }

        const publicacion = await this.publicacionModel.create({ ...dto, autor: new Types.ObjectId(dto.autor), imagenUrl});

        return publicacion.populate('autor', 'nombre apellido nombreUsuario imagenUrl equipoFavorito');
    }

    async listar(filtros: ListarPublicacionesDto) {
        const { offset = 0, limit = 10, orden = "fecha", usuario} = filtros;

        const filtro: any = { activa: true };

        if (usuario) {
            filtro.autor = usuario;
        }
        
        let ordenamiento = "-createdAt";

        if (orden === "likes") {
            ordenamiento = "-cantidadLikes -createdAt";
        } 

        const publicaciones = await this.publicacionModel.find(filtro)
        .sort(ordenamiento)
        .skip(offset * limit)
        .limit(limit)
        .populate("autor","nombre apellido nombreUsuario imagenUrl equipoFavorito")
        .exec()

        const total = await this.publicacionModel.countDocuments(filtro);

        return { publicaciones, total};
    }

}
