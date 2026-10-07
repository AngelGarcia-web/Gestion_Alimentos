import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credenciales = {
    email: '',
    password: ''
  };
  mensajeError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.credenciales.email || !this.credenciales.password) {
      this.mensajeError = 'Por favor complete todos los campos';
      return;
    }

    this.authService.login(this.credenciales).subscribe({
      next: (res: any) => {
        
        const usuario = res?.usuario || this.authService.getUser();
        const idRol = Number(usuario?.id_rol);

        
        if (idRol === 3) {
          this.router.navigate(['/usuarios']); 
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'Error al iniciar sesión';
      }
    });
  }
}