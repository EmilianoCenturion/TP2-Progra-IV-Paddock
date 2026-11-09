import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors, Headers } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { RegistroUsuarioDto } from './dto/registro.dto.js';
import { AuthService } from './auth.service.js';
import { FileInterceptor } from '@nestjs/platform-express'
import { LoginUsuarioDto } from './dto/login.dto.js';


@Controller('auth')
export class AuthController { 

    constructor(private readonly authService: AuthService) {}

    @Post('registro')
    @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
    registro(@Body() dto: RegistroUsuarioDto, @UploadedFile() imagen?: Express.Multer.File) {
        return this.authService.registro(dto, imagen);
    };

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginUsuarioDto) {
        return this.authService.login(dto);
    }

    @Post('autorizar')
    @HttpCode(HttpStatus.OK)
    autorizar(@Headers('authorization') authorization?: string) {
        return this.authService.autorizar(authorization?.split(' ')[1]);
    }

    @Post('refrescar')
    @HttpCode(HttpStatus.OK)
    refrescar(@Headers('authorization') authorization?: string) {
        return this.authService.refrescar(authorization?.split(' ')[1]);
    }
}
