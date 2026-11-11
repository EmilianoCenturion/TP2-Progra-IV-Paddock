import { Directive, input } from '@angular/core';
import { colorEquipo } from '../utils/equipos';

@Directive({
  selector: '[appColorEquipo]',
  host: {
    '[style.--equipo]': 'color()',
  },
})
export class ColorEquipo {
  appColorEquipo = input<string | undefined>();

  color() {
    return colorEquipo(this.appColorEquipo());
  }
}
