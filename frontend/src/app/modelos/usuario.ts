export interface Usuario {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    nombreUsuario: string;
    fechaNacimiento: string;
    descripcion: string;
    imagenUrl?: string;
    perfil: 'usuario' | 'administrador';
    habilitado: boolean;
    equipoFavorito?: string;
}
