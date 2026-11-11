import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Grafico } from '../../componentes/grafico/grafico';
import { Estadisticas } from '../../servicios/estadisticas';
import { colorEquipo } from '../../utils/equipos';

function fecha(diasAtras: number) {
  return new Date(Date.now() - diasAtras * 86400000).toISOString().slice(0, 10);
}

function crearFiltro() {
  return new FormGroup({
    desde: new FormControl(fecha(30), { nonNullable: true }),
    hasta: new FormControl(fecha(0), { nonNullable: true }),
  });
}

type DatosGrafico = { etiquetas: string[]; valores: number[]; colores?: string[]; imagenes?: string[] };

@Component({
  imports: [ReactiveFormsModule, Grafico],
  selector: 'app-dashboard-estadisticas',
  styleUrl: './dashboard-estadisticas.css',
  templateUrl: './dashboard-estadisticas.html',
})
export class DashboardEstadisticas implements OnInit {

  private estadisticas = inject(Estadisticas);

  filtroUsuarios = crearFiltro();
  filtroDias = crearFiltro();
  filtroPublicaciones = crearFiltro();

  usuarios = signal<DatosGrafico>({ etiquetas: [], valores: [] });
  dias = signal<DatosGrafico>({ etiquetas: [], valores: [] });
  publicaciones = signal<DatosGrafico>({ etiquetas: [], valores: [] });

  error = signal('');

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarDias();
    this.cargarPublicaciones();
  }

  cargarUsuarios() {
    const { desde, hasta } = this.filtroUsuarios.getRawValue();
    this.error.set('');

    this.estadisticas.publicacionesPorUsuario(desde, hasta).subscribe({
      next: (respuesta) => {
        this.usuarios.set({
          etiquetas: respuesta.map((r) => r.nombreUsuario),
          valores: respuesta.map((r) => r.cantidad),
          colores: respuesta.map((r) => colorEquipo(r.equipoFavorito)),
          imagenes: respuesta.map((r) => r.imagenUrl ?? ''),
        });
      },
      error: (err) => this.error.set(err.error.message),
    });
  }

  cargarDias() {
    const { desde, hasta } = this.filtroDias.getRawValue();
    this.error.set('');

    this.estadisticas.comentariosPorDia(desde, hasta).subscribe({
      next: (respuesta) => {
        this.dias.set({
          etiquetas: respuesta.map((r) => r.fecha),
          valores: respuesta.map((r) => r.cantidad),
        });
      },
      error: (err) => this.error.set(err.error.message),
    });
  }

  cargarPublicaciones() {
    const { desde, hasta } = this.filtroPublicaciones.getRawValue();
    this.error.set('');

    this.estadisticas.comentariosPorPublicacion(desde, hasta).subscribe({
      next: (respuesta) => {
        this.publicaciones.set({
          etiquetas: respuesta.map((r) => r.titulo),
          valores: respuesta.map((r) => r.cantidad),
        });
      },
      error: (err) => this.error.set(err.error.message),
    });
  }
}