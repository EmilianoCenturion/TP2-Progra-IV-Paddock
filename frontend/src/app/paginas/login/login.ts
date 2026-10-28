import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../servicios/auth';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  mensajeError = signal("");

  constructor (private authService: Auth, private router: Router) {}

  form = new FormGroup({
    usuario: new FormControl("", {
      nonNullable: true, validators: Validators.required
    }),
    contrasena: new FormControl("", {
      nonNullable: true, validators: Validators.required
    })
  })

  invalido(campo: string) {
    if (this.form.get(campo)?.invalid && this.form.get(campo)?.touched) {
      return true;
    }
    return false;
  }

  ingresar() {

    this.mensajeError.set("")

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (usuario) => {
        localStorage.setItem('usuario', JSON.stringify(usuario))
        this.router.navigate(["/publicaciones"])
      }, 
      error: (err) => {
        if (err.status === 0) {
          this.mensajeError.set("No pudimos conectar con el servidor")
        } else {
          this.mensajeError.set(err.error.message)
        }
      }})
  }
}
