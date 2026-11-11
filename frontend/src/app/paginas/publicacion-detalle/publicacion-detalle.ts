import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PublicacionCard } from '../../componentes/publicacion-card/publicacion-card';
import { Publicacion } from '../../modelos/publicacion';
import { Comentario } from '../../modelos/comentario';
import { PublicacionesService } from '../../servicios/publicaciones';
import { ComentariosService } from '../../servicios/comentarios';
import { Auth } from '../../servicios/auth';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [PublicacionCard, RouterLink, DatePipe, ReactiveFormsModule],
  selector: 'app-publicacion-detalle',
  styleUrl: './publicacion-detalle.css',
  templateUrl: './publicacion-detalle.html',
})
export class PublicacionDetalle {
  private publicacionesService = inject(PublicacionesService);
  private comentariosService = inject(ComentariosService);

  usuario = inject(Auth).usuario;
  id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  publicacion = signal<Publicacion | null>(null);
  editandoId = signal<string | null>(null);
  comentarios = signal<Comentario[]>([]);
  total = signal(0);
  pagina = signal(0);
  error = signal('');

  limite = 5;

  ngOnInit() {
    this.cargarPublicacion();
    this.cargarComentarios();
  }

  mensaje = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(500)],
  });

  mensajeEditado = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(500)],
  });

  cargarPublicacion() {
    this.publicacionesService.buscarPorId(this.id).subscribe({
      next: (publicacion) => this.publicacion.set(publicacion),
      error: () => this.error.set('No pudimos cargar la publicación'),
    });
  }

  cargarComentarios() {
    this.comentariosService.listar(this.id, this.pagina(), this.limite).subscribe({
      next: (respuesta) => {
        this.comentarios.set([...this.comentarios(), ...respuesta.comentarios]);
        this.total.set(respuesta.total);
      },
      error: () => this.error.set('No pudimos cargar los comentarios'),
    });
  }

  cargarMas() {
    this.pagina.set(this.pagina() + 1);
    this.cargarComentarios();
  }

  dioLike(publicacion: Publicacion) {
    return publicacion.likes.includes(this.usuario()?._id ?? '');
  }

  alternarLike(publicacion: Publicacion) {
    let pedido;

    if (this.dioLike(publicacion)) {
      pedido = this.publicacionesService.quitarLike(publicacion._id);
    } else {
      pedido = this.publicacionesService.darLike(publicacion._id);
    }

    pedido.subscribe({
      next: () => this.cargarPublicacion(),
      error: () => this.error.set('No pudimos actualizar el like'),
    });
  }
  
  comentar() {
    const texto = this.mensaje.value.trim();
    if (!texto) return;

    this.comentariosService.crear(this.id, texto).subscribe({
      next: () => {
        this.mensaje.reset();
        this.comentarios.set([]);
        this.pagina.set(0);
        this.cargarComentarios();
      },
      error: () => this.error.set('No pudimos publicar el comentario'),
    });
  }

  esMio(comentario: Comentario) {
    return comentario.autor._id === this.usuario()?._id;
  }

  empezarEdicion(comentario: Comentario) {
    this.editandoId.set(comentario._id);
    this.mensajeEditado.setValue(comentario.mensaje);
  }

  cancelarEdicion() {
    this.editandoId.set(null);
  }

  guardarEdicion(comentario: Comentario) {
    const texto = this.mensajeEditado.value.trim();
    if (!texto) return;

    this.comentariosService.editar(this.id, comentario._id, texto).subscribe({
      next: (editado) => {
        this.comentarios.set(this.comentarios().map((c) => {
          if (c._id === editado._id) {
            return editado;
          }
          return c;
        }));
        this.editandoId.set(null);
      },
      error: () => this.error.set('No pudimos editar el comentario'),
    });
  }

}