import { IsIn, IsInt, IsMongoId, IsOptional, Max, Min } from "class-validator";
import { Type } from "class-transformer"

export class ListarPublicacionesDto {
    @IsOptional()
    @IsIn(["fecha", "likes"], { message: "El orden debe ser por fecha o por likes" })
    orden?: string;

    @IsOptional()
    @IsMongoId({ message: "El usuario no es valido"})
    usuario?: string

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