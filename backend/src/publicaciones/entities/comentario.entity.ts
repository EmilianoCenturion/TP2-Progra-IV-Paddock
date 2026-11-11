import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ComentarioDocument = HydratedDocument<Comentario>;

@Schema({ timestamps: true, collection: "comentarios" })
export class Comentario {
    @Prop({ required: [true, "El mensaje es obligatorio"], trim: true })
    mensaje: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true })
    autor: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Publicacion", required: true })
    publicacion: mongoose.Types.ObjectId;

    @Prop({ default: false })
    modificado: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);