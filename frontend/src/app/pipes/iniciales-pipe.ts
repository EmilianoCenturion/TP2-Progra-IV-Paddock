import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iniciales',
})
export class InicialesPipe implements PipeTransform {
  transform(usuario: { nombre: string; apellido: string }): string {
    return (usuario.nombre[0] + usuario.apellido[0]).toUpperCase();
  }
}
