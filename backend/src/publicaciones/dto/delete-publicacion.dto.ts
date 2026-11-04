import { IsIn, IsMongoId } from "class-validator";

export class DeletePublicacionDto {

    @IsMongoId({ message: "El usuario no es valido"})
    usuario: string;

    @IsIn(["usuario", "administrador"], { message: "El perfil no es valido" })
    perfil: string;
}