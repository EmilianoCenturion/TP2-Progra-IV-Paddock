import { Autor } from "./publicacion";

export interface Comentario {
    _id: string;
    mensaje: string;
    autor: Autor;
    publicacion: string;
    modificado: boolean;
    createdAt: string;
}

export interface RespuestaComentarios {
    comentarios: Comentario[];
    total: number;
}
