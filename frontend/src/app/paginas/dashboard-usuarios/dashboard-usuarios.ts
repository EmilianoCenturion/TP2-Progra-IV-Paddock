import { Component, inject, OnInit, signal } from '@angular/core';
import { CrearUsuario } from '../../componentes/crear-usuario/crear-usuario';
import { Usuario } from '../../modelos/usuario';
import { UsuariosService } from '../../servicios/usuarios';
import { Auth } from '../../servicios/auth';
import { InicialesPipe } from '../../pipes/iniciales-pipe';
import { ColorEquipo } from '../../directivas/color-equipo';
import { ImagenRespaldo } from '../../directivas/imagen-respaldo';

@Component({
  imports: [CrearUsuario, InicialesPipe, ColorEquipo, ImagenRespaldo],
  selector: 'app-dashboard-usuarios',
  styleUrl: './dashboard-usuarios.css',
  templateUrl: './dashboard-usuarios.html',
})
export class DashboardUsuarios implements OnInit{

  usuario = inject(Auth).usuario;
  usuariosService = inject(UsuariosService)
  
  usuarios = signal<Usuario[]>([]);
  aDeshabilitar = signal<Usuario | null>(null);
  creando = signal(false);
  error = signal('');
  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.error.set('');

    this.usuariosService.listar().subscribe({
      next: (usuarios) => this.usuarios.set(usuarios),
      error: () => this.error.set('No pudimos cargar los usuarios'),
    });
  }

  confirmarDeshabilitar() {
    const usuario = this.aDeshabilitar();
    if (!usuario) return;

    this.usuariosService.deshabilitar(usuario._id).subscribe({
      next: () => {
        this.aDeshabilitar.set(null);
        this.cargar();
      },
      error: (err) => {
        this.aDeshabilitar.set(null);
        this.error.set(err.error.message);
      },
    });
  }

  habilitar(usuario: Usuario) {
    this.usuariosService.rehabilitar(usuario._id).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error.set(err.error.message),
    });
  }

  alCrear() {
    this.creando.set(false);
    this.cargar();
  }
}
