import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../servicios/usuarios';
import { Auth } from '../../servicios/auth';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-editar-perfil',
  styleUrl: './editar-perfil.css',
  templateUrl: './editar-perfil.html',
})
export class EditarPerfil implements OnInit {
  private usuariosService = inject(UsuariosService);
  private authService = inject(Auth);
  private fb = inject(FormBuilder);

  guardado = output();
  cancelado = output();

  error = signal('');
  enviando = signal(false);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    equipoFavorito: [''],
    descripcion: ['', [Validators.required, Validators.maxLength(300)]],
  });

  ngOnInit() {
    const usuario = this.authService.usuario();
    if (!usuario) return;

    this.form.setValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      fechaNacimiento: usuario.fechaNacimiento.slice(0, 10),
      equipoFavorito: usuario.equipoFavorito ?? '',
      descripcion: usuario.descripcion,
    });
  }

  invalido(campo: string) {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }

  guardar() {
    this.error.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);

    this.usuariosService.editarPerfil(this.form.getRawValue()).subscribe({
      next: (usuario) => {
        this.authService.actualizarUsuario(usuario);
        this.guardado.emit();
      },
      error: (err) => {
        this.enviando.set(false);

        if (err.status === 0) {
          this.error.set('No pudimos conectar con el servidor');
        } else {
          this.error.set(err.error.message);
        }
      },
    });
  }
}
