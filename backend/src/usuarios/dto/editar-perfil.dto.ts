import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export const EQUIPOS = ["Alpine", "Aston Martin", "Audi", "Cadillac", "Ferrari", "Haas", "McLaren", "Mercedes", "Racing Bulls", "Red Bull", "Williams"];

export class EditarPerfilDto {

    @IsString()
    @IsNotEmpty({ message: "El nombre es obligatorio" })
    nombre: string;

    @IsString()
    @IsNotEmpty({ message: "El apellido es obligatorio" })
    apellido: string;

    @IsDateString({}, { message: "Ingresá una fecha de nacimiento válida" })
    @IsNotEmpty({ message: "La fecha de nacimiento es obligatoria" })
    fechaNacimiento: string;

    @MaxLength(300, { message: "La descripción no puede superar los 300 caracteres" })
    @IsString()
    @IsNotEmpty({ message: "La descripción es obligatoria" })
    descripcion: string;

    @IsIn(["", ...EQUIPOS], { message: "Elegí un equipo de la lista" })
    @IsOptional()
    equipoFavorito?: string;
}
