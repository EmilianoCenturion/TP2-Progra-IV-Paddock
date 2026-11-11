import { Directive, ElementRef, inject } from '@angular/core';

const RESPALDO = 'img/sin-imagen.svg';

@Directive({
  selector: 'img[appImagenRespaldo]',
  host: {
    '(error)': 'alFallar()',
  },
})
export class ImagenRespaldo {
  private imagen = inject<ElementRef<HTMLImageElement>>(ElementRef);

  alFallar() {
    if (!this.imagen.nativeElement.src.endsWith(RESPALDO)) {
      this.imagen.nativeElement.src = RESPALDO;
    }
  }
}
