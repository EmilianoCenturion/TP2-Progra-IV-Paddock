import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

    async eliminar(id: string, usuario: string, perfil: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("El ID no es correcto")
        }

        const publicacion = await this.publicacionModel.findOne({ _id: id, activa: true });

        if (!publicacion) {
            throw new NotFoundException("La publicacion no existe");
        }

        const esCreador = publicacion.autor.toString() === usuario;

        const esAdmin = perfil === "administrador";

        if (!esCreador && !esAdmin) {
            throw new ForbiddenException("No tiene permiso para eliminar la publicacion");
        }

        publicacion.activa = false;

        await publicacion.save();

        return { message: "Publicacion eliminada"};
    }

    async darLike(id: string, usuario: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("El ID no es correcto")
        }

        const publicacion = await this.publicacionModel.findOne({ _id: id, activa: true });

        if (!publicacion) {
            throw new NotFoundException("La publicacion no existe");
        }

        const yaDioLike = publicacion.likes.some((like) => like.toString() === usuario);

        if (yaDioLike) {
            throw new ConflictException("Ya le diste like a esta publicacion");
        }

        publicacion.likes.push(new Types.ObjectId(usuario));

        publicacion.cantidadLikes = publicacion.likes.length;

        await publicacion.save();

        return { cantidadLikes: publicacion.cantidadLikes }
    }

    async quitarLike(id: string, usuario: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("El ID no es correcto")
        }

        const publicacion = await this.publicacionModel.findOne({ _id: id, activa: true });

        if (!publicacion) {
            throw new NotFoundException("La publicacion no existe");
        }

        const yaDioLike = publicacion.likes.some((like) => like.toString() === usuario);

        if (!yaDioLike) {
            throw new ConflictException("No se le dio like a esta publicacion");
        }

        publicacion.likes = publicacion.likes.filter( (like) => like.toString() !== usuario);

        publicacion.cantidadLikes = publicacion.likes.length;

        await publicacion.save();

        return { cantidadLikes: publicacion.cantidadLikes }
    }
    
}
