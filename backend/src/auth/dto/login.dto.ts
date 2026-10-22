import { IsNotEmpty, IsString } from "class-validator";

export class LoginUsuarioDto {

    @IsString()
    @IsNotEmpty({ message: "Ingresá tu usuario o correo" })
    usuario: string;

    @IsString()
    @IsNotEmpty({ message: "Ingresá tu contraseña" })
    contrasena: string;
}
