import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando: boolean = true;
  mensajeError: string = '';
  mensajeExito: string = '';

  usuarioSeleccionado: Usuario | null = null;
  modoEdicion: boolean = false;
  nuevoPassword: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.listarTodos().subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res) ? res : (res?.usuarios || res?.data || []);
        const usuarioActual = this.authService.getUser();
        
        this.usuarios = lista.filter((u: Usuario) => {
          const esAdmin = Number(u.id_rol) === 3;
          const esUnoMismo = u.id_usuario === usuarioActual?.id_usuario;
          return !esAdmin && !esUnoMismo;
        });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mensajeError = 'Error al cargar los usuarios';
        this.cargando = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarUsuario(u: Usuario): void {
    this.usuarioSeleccionado = { ...u };
    this.modoEdicion = true;
    this.nuevoPassword = '';
  }

  cancelarEdicion(): void {
    this.usuarioSeleccionado = null;
    this.modoEdicion = false;
    this.nuevoPassword = '';
  }

  actualizarUsuario(): void {
    if (!this.usuarioSeleccionado || !this.usuarioSeleccionado.id_usuario) return;

    // Preparamos los datos limpios a enviar (sin alterar campos protegidos como id_rol o contraseña directamente si no toca)
    const datosActualizar = {
      nombre_institucion: this.usuarioSeleccionado.nombre_institucion,
      telefono: this.usuarioSeleccionado.telefono,
      direccion: this.usuarioSeleccionado.direccion
    };

    this.usuarioService.actualizarUsuario(this.usuarioSeleccionado.id_usuario, datosActualizar).subscribe({
      next: () => {
        // Si además se escribió una nueva contraseña, la actualizamos en secuencia
        if (this.nuevoPassword && this.nuevoPassword.trim().length >= 6) {
          this.usuarioService.actualizarPassword(this.usuarioSeleccionado!.id_usuario!, this.nuevoPassword).subscribe({
            next: () => {
              this.exitoCompleto('Usuario y contraseña actualizados correctamente');
            },
            error: (errPass) => {
              this.mensajeError = errPass.error?.mensaje || 'Se guardaron los datos, pero falló al actualizar la contraseña';
              this.cdr.detectChanges();
              this.temporizadorMensajes();
            }
          });
        } else {
          this.exitoCompleto('Usuario actualizado correctamente');
        }
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'Error al actualizar usuario. Verifica que la ruta backend PUT /api/usuarios/:id exista.';
        this.cdr.detectChanges();
        this.temporizadorMensajes();
      }
    });
  }

  resetearPassword(id: number | undefined): void {
    if (!id) return;
    if (!this.nuevoPassword || this.nuevoPassword.trim().length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (confirm('¿Estás seguro de restablecer la contraseña de este usuario?')) {
      this.usuarioService.actualizarPassword(id, this.nuevoPassword).subscribe({
        next: () => {
          this.exitoCompleto('Contraseña restablecida exitosamente');
        },
        error: (err) => {
          this.mensajeError = err.error?.mensaje || 'Error al restablecer contraseña';
          this.cdr.detectChanges();
          this.temporizadorMensajes();
        }
      });
    }
  }

  private exitoCompleto(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.nuevoPassword = '';
    this.usuarioSeleccionado = null;
    this.modoEdicion = false;
    this.cargarUsuarios();
    this.cdr.detectChanges();
    this.temporizadorMensajes();
  }

  private temporizadorMensajes(): void {
    setTimeout(() => { 
      this.mensajeExito = ''; 
      this.mensajeError = ''; 
      this.cdr.detectChanges(); 
    }, 4000);
  }

  eliminarUsuario(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este usuario de la plataforma?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          this.exitoCompleto('Usuario eliminado correctamente');
        },
        error: (err) => {
          this.mensajeError = err.error?.mensaje || 'Error al eliminar usuario';
          this.cdr.detectChanges();
          this.temporizadorMensajes();
        }
      });
    }
  }
}