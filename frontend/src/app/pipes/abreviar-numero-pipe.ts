import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abreviarNumero',
})
export class AbreviarNumeroPipe implements PipeTransform {
  transform(numero: number): string {
    if (numero > 999999) {
      return `${Math.floor(numero / 1000000)}mill`;
    }

    if (numero > 999) {
      return `${Math.floor(numero / 1000)}k`;
    }

    return `${numero}`;
  }
}
