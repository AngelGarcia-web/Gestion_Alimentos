import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '../../services/solicitud.service';
import { AuthService } from '../../services/auth.service';
import { Solicitud } from '../../models/solicitud';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(
    private solicitudService: SolicitudService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.cargando = true;
    this.solicitudService.obtenerMisSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data || [];
        this.cargando = false;
        this.cdr.detectChanges(); // Forzamos actualización de vista
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
        this.mensajeError = 'No se pudieron obtener las solicitudes.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  actualizarEstado(id: number | undefined, nuevoEstado: 'aprobada' | 'rechazada' | 'completada'): void {
    if (!id) return;

    this.solicitudService.cambiarEstado(id, nuevoEstado).subscribe({
      next: () => {
        this.mensajeExito = `Solicitud ${nuevoEstado} con éxito`;
        this.cargarSolicitudes();
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'Error al actualizar la solicitud';
        setTimeout(() => this.mensajeError = '', 3000);
      }
    });
  }

  get esDonanteOAdmin(): boolean {
    const rol = this.authService.getRoleId();
    return rol === 1 || rol === 3;
  }
}