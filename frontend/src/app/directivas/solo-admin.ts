import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { Auth } from '../servicios/auth';

@Directive({
  selector: '[appSoloAdmin]',
})
export class SoloAdmin {
  private template = inject(TemplateRef);
  private contenedor = inject(ViewContainerRef);
  private authService = inject(Auth);

  constructor() {
    effect(() => {
      const esAdmin = this.authService.usuario()?.perfil === 'administrador';

      this.contenedor.clear();

      if (esAdmin) {
        this.contenedor.createEmbeddedView(this.template);
      }
    });
  }
}
