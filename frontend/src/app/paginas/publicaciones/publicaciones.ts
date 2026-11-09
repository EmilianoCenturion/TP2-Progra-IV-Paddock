import { Component, inject, signal } from '@angular/core';
import { PublicacionCard } from '../../componentes/publicacion-card/publicacion-card';
import { Publicacion } from '../../modelos/publicacion';
import { PublicacionesService } from '../../servicios/publicaciones';
import { Auth } from '../../servicios/auth';
import { CrearPublicacion } from '../../componentes/crear-publicacion/crear-publicacion';

@Component({
  imports: [PublicacionCard, CrearPublicacion],
  selector: 'app-publicaciones',
  styleUrl: './publicaciones.css',
  templateUrl: './publicaciones.html',
})
export class Publicaciones {
  private publicacionesService = inject(PublicacionesService);

  usuario = inject(Auth).usuario;
  aEliminar = signal<Publicacion | null>(null);
  creando = signal(false);

  publicaciones = signal<Publicacion[]>([]);
  total = signal(0);
  orden = signal('fecha');
  pagina = signal(0);
  error = signal('');

  limite = 5;

  ngOnInit() {
    this.cargar();
  }

  
  cargar() {
    this.error.set("");

    this.publicacionesService.listar(this.orden(), this.pagina(), this.limite).subscribe({
      next: (respuesta) => {
        this.publicaciones.set(respuesta.publicaciones);
        this.total.set(respuesta.total);
      },
      error: () => this.error.set('No pudimos cargar las publicaciones'),
    });
  }

  cambiarOrden(orden: string) {
    this.orden.set(orden);
    this.pagina.set(0);
    this.cargar();
  }

  cambiarPagina(pagina: number) {
    this.pagina.set(pagina);
    this.cargar();
  }

  dioLike(publicacion: Publicacion) {
    return publicacion.likes.includes(this.usuario()?._id ?? "");
  }

  puedeEliminar(publicacion: Publicacion) {
    const usuario = this.usuario();
    
    return usuario?._id === publicacion.autor._id || usuario?.perfil === "administrador";
  }

  alternarLike(publicacion: Publicacion) {
    const id = this.usuario()?._id;

    if (!id) return;

    const pedido = this.dioLike(publicacion) 
    ? this.publicacionesService.quitarLike(publicacion._id)
    : this.publicacionesService.darLike(publicacion._id);

    pedido.subscribe({ 
      next: () => this.cargar(),
      error: () => this.error.set("No pudimos actualizar el like")
    });
  }

  confirmarEliminar() {
    const publicacion = this.aEliminar();
    const usuario = this.usuario();
    if (!publicacion || !usuario) return;

    this.publicacionesService.eliminar(publicacion._id).subscribe({
      next: () => {
        this.aEliminar.set(null);

        if (this.publicaciones().length === 1 && this.pagina() > 0) {
          this.pagina.set(this.pagina() - 1);
        }

        this.cargar();
      },
      error: () => {
        this.aEliminar.set(null);
        this.error.set('No pudimos eliminar la publicación');
      },
    });
  }

  alCrear() {
    this.creando.set(false);
    this.pagina.set(0);
    this.cargar();
  }
}