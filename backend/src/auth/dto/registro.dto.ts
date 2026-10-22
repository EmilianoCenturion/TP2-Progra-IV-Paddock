import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class RegistroUsuarioDto {

    @IsString()
    @IsNotEmpty({ message: "El nombre es obligatorio" })
    nombre: string;

    @IsString()
    @IsNotEmpty({ message: "El apellido es obligatorio" })
    apellido: string;

    @IsEmail({}, { message: "Ingresá un correo válido (ej: nombre@mail.com)" })
    @IsNotEmpty({ message: "El correo es obligatorio" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "El nombre de usuario es obligatorio" })
    nombreUsuario: string;

    @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, { message: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número" })
    @IsString()
    @IsNotEmpty({ message: "La contraseña es obligatoria" })
    contrasena: string;

    @IsString()
    @IsNotEmpty({ message: "Repetí la contraseña" })
    repetirContrasena: string;

    @IsDateString({}, { message: "Ingresá una fecha de nacimiento válida" })
    @IsNotEmpty({ message: "La fecha de nacimiento es obligatoria" })
    fechaNacimiento: string;

    @MaxLength(300, { message: "La descripción no puede superar los 300 caracteres" })
    @IsString()
    @IsNotEmpty({ message: "La descripción es obligatoria" })
    descripcion: string;

    @IsString()
    @IsOptional()
    equipoFavorito?: string;
}
