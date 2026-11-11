import { Component, computed, input } from '@angular/core';

const COLORES = ['#E10600', '#FF8000', '#27F4D2', '#3671C6', '#229971', '#FF87BC', '#B6BABD', '#64C4FF', '#6692FF', '#FFD400'];

@Component({
  selector: 'app-grafico',
  styleUrl: './grafico.css',
  templateUrl: './grafico.html',
})
export class Grafico {
  tipo = input.required<'bar' | 'line' | 'pie'>();
  etiquetas = input<string[]>([]);
  valores = input<number[]>([]);
  colores = input<string[]>([]);
  imagenes = input<string[]>([]);

  coloresTorta = COLORES;

  maximo = computed(() => Math.max(...this.valores(), 1));

  porcentaje(valor: number) {
    return (valor / this.maximo()) * 100;
  }

  puntos = computed(() => {
    const valores = this.valores();
    let paso = 0;

    if (valores.length > 1) {
      paso = 100 / (valores.length - 1);
    }

    return valores.map((valor, i) => ({ x: i * paso, y: 100 - this.porcentaje(valor) }));
  });

  linea = computed(() => this.puntos().map((p) => `${p.x},${p.y}`).join(' '));

  torta = computed(() => {
    const valores = this.valores();
    const total = valores.reduce((suma, valor) => suma + valor, 0);
    let acumulado = 0;

    const porciones = valores.map((valor, i) => {
      const inicio = acumulado;
      acumulado += (valor / total) * 100;
      return `${COLORES[i % COLORES.length]} ${inicio}% ${acumulado}%`;
    });

    return `conic-gradient(${porciones.join(', ')})`;
  });
}
