import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from 'node:crypto';

@Injectable()
export class ImagenesService {

    private readonly supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!)
    }

    async subirImagen(archivo: Express.Multer.File, carpeta: string): Promise<string> {
        const extension = archivo.originalname.split(".").pop()?.toLowerCase();

        const rutaArchivo = `${carpeta}/${randomUUID()}.${extension}`;

        const { error } = await this.supabase.storage.from("paddock").upload(rutaArchivo, archivo.buffer, {
            contentType: archivo.mimetype });

        if (error) throw new InternalServerErrorException("No se pudo subir la imagen");

        const { data } = this.supabase.storage.from("paddock").getPublicUrl(rutaArchivo);

        return data.publicUrl;
    }
}
