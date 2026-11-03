import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument} from "mongoose";

export type PublicacionDocument = HydratedDocument<Publicacion>

@Schema({ timestamps: true, collection: "publicaciones" })
export class Publicacion {
    @Prop({required: [true, "El titulo es obligatorio"], trim: true})
    titulo: string;

    @Prop({required: [true, "El mensaje es obligatorio"], trim: true})
    mensaje: string;

    @Prop()
    imagenUrl?: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true})
    autor: mongoose.Types.ObjectId;

    @Prop({ type:[{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario"}], default: [] })
    likes: mongoose.Types.ObjectId[];

    @Prop({default: true})
    activa: boolean;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);


