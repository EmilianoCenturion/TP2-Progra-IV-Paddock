import { IsInt, IsOptional, Max, Min } from "class-validator";
import { Type } from "class-transformer"

export class ListarComentariosDto {
    
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "La página debe ser un número entero" })
    @Min(0, { message: "La página no puede ser negativa" })
    offset?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "La cantidad debe ser un número entero" })
    @Min(1, { message: "La cantidad mínima es 1" })
    @Max(50, { message: "La cantidad máxima es 50" })
    limit?: number;
}