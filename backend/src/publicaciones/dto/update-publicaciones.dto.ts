import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicacioneDto } from './create-publicaciones.dto.js';

export class UpdatePublicacioneDto extends PartialType(CreatePublicacioneDto) {}
