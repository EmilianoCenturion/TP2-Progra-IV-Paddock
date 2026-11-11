import { IsNotEmpty, IsString } from "class-validator";

export class ComentarioDto {
    
    @IsString()
    @IsNotEmpty({ message: "El comentario no puede estar vacio"})
    mensaje: string;
}