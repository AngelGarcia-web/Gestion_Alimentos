import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = {
    nombre_institucion: '',
    email: '',
    telefono: '',
    direccion: '',
    foto_url: '',
    id_rol: 0
  };
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.usuarioService.obtenerPerfil().subscribe({
      next: (res: any) => {
        const data = res?.usuario || res?.data || res;
        if (data) {
          // Actualizamos las propiedades del objeto actual en lugar de reemplazar la referencia
          Object.assign(this.usuario, data);
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al obtener perfil:', err)
    });
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.usuario.foto_url = reader.result as string;
        this.cdr.detectChanges();
      };

      reader.readAsDataURL(file);
    }
  }

  guardarPerfil(): void {
    this.usuarioService.actualizarPerfil(this.usuario).subscribe({
      next: (res: any) => {
        this.mensajeExito = 'Perfil actualizado correctamente';

        // Combinamos de forma segura la sesión actual, los cambios locales y la respuesta del servidor
        const usuarioActualSesion = this.authService.getUser();
        const usuarioActualizado = {
          ...usuarioActualSesion,
          ...this.usuario,
          ...(res?.usuario || {})
        };

        // Sincronizamos la sesión global y emitimos a la Navbar en tiempo real
        this.authService.actualizarUsuarioSesion(usuarioActualizado);

        this.cdr.detectChanges();
        setTimeout(() => {
          this.mensajeExito = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'Error al actualizar perfil';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.mensajeError = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }
}