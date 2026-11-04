import { IsMongoId } from "class-validator";

export class LikePublicacionDto {
    @IsMongoId({ message: "El usuario no es valido"})
    usuario: string;
}