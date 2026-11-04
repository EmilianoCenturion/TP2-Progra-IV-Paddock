export interface Autor {
    _id: string;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    imagenUrl?: string;
    equipoFavorito?: string;
}

export interface Publicacion {
    _id: string;
    titulo: string;
    mensaje: string;
    imagenUrl?: string;
    autor: Autor;
    likes: string[];
    cantidadLikes: number;
    activa: boolean;
    createdAt: string;
}

export interface RespuestaPublicaciones {
    publicaciones: Publicacion[];
    total: number;
}