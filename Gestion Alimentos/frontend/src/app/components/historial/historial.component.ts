import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialService } from '../../services/historial.service';
import { HistorialEntrega } from '../../models/historial';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  historiales: HistorialEntrega[] = [];
  cargando: boolean = true;

  constructor(
    private historialService: HistorialService,
    private cdr: ChangeDetectorRef // Injectamos el detector de cambios
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.historialService.obtenerHistorial().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.historiales = res;
        } else if (res && Array.isArray(res.data)) {
          this.historiales = res.data;
        } else if (res && Array.isArray(res.historial)) {
          this.historiales = res.historial;
        } else {
          this.historiales = [];
        }

        this.cargando = false;
        this.cdr.detectChanges(); // Forzamos la actualización inmediata del DOM
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}