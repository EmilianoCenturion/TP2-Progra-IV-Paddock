import { IsDateString, IsNotEmpty } from "class-validator";

export class EstadisticasDto {

    @IsDateString({}, { message: "Ingresá una fecha desde válida" })
    @IsNotEmpty({ message: "La fecha desde es obligatoria" })
    desde: string;

    @IsDateString({}, { message: "Ingresá una fecha hasta válida" })
    @IsNotEmpty({ message: "La fecha hasta es obligatoria" })
    hasta: string;
}