import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UsuarioDocument = HydratedDocument<Usuario>;


@Schema({ timestamps: true})
export class Usuario {
    
    @Prop({required: [true, "El nombre es obligatorio"]})
    nombre: string;
    
    @Prop({required: [true, "El apellido es obligatorio"]})
    apellido: string;
    
    @Prop({required: [true, "El email es obligatorio"], unique: true, lowercase: true, trim: true})
    email: string;
    
    @Prop({required: [true, "El nombre de usuario es obligatorio"], unique: true, lowercase: true, trim: true})
    nombreUsuario: string;

    @Prop({required: [true, "La contraseña es obligatoria"], select: false})
    contrasena: string;
    
    @Prop({required: [true, "La fecha de nacimiento es obligatoria"]})
    fechaNacimiento: Date;

    @Prop({required: [true, "La descripcion es obligatoria"], maxLength: 300})
    descripcion: string;

    @Prop()
    imagenUrl: string;

    @Prop({enum: ["usuario", "administrador"], default: "usuario"})
    perfil: string;

    @Prop({default: true})
    habilitado: boolean;

    @Prop()
    equipoFavorito: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario)
