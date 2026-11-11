import { IsIn } from "class-validator";
import { RegistroUsuarioDto } from "../../auth/dto/registro.dto.js";

export class CrearUsuarioDto extends RegistroUsuarioDto {

    @IsIn(["usuario", "administrador"],{ message: "El perfil debe ser usuario o administrador" })
    perfil: string;
}