import { IsNotEmpty, IsString } from "class-validator";

export class CreatePublicacionDto {

    @IsString()
    @IsNotEmpty({ message: "Ingresa el titulo de la publicacion"})
    titulo: string;

    @IsString()
    @IsNotEmpty({ message: "Ingresa el mensaje de la publicacion"})
    mensaje: string;
}
