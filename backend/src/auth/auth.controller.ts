import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { RegistroUsuarioDto } from './dto/registro.dto.js';
import { AuthService } from './auth.service.js';
import { FileInterceptor } from '@nestjs/platform-express'


@Controller('auth')
export class AuthController { 

    constructor(private readonly authService: AuthService) {}

    @Post('registro')
    @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
    registro(@Body() dto: RegistroUsuarioDto, @UploadedFile() imagen?: Express.Multer.File) {
        return this.authService.registro(dto, imagen);
    } 
}
