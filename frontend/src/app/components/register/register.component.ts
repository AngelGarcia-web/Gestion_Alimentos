import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  usuario: Usuario = {
    nombre_institucion: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    id_rol: 2
  };
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    if (!this.usuario.nombre_institucion || !this.usuario.email || !this.usuario.password) {
      this.mensajeError = 'Por favor complete los campos obligatorios';
      return;
    }

    this.authService.registro(this.usuario).subscribe({
      next: () => {
        this.mensajeExito = 'Registro exitoso. Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'Error al registrar el usuario';
      }
    });
  }
}