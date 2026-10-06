import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    alimentosPublicados: 0,
    solicitudesTotales: 0,
    donacionesCompletadas: 0,
    usuariosRegistrados: 0
  };
  
  cargando: boolean = true;
  mensajeError: string = '';

  constructor(
    private dashboardService: DashboardService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando = true;
    
    // Obtenemos las estadísticas generales
    this.dashboardService.obtenerEstadisticas().subscribe({
      next: (data) => {
        this.stats = data;
        
        // Consultamos los usuarios para recalcular el total excluyendo a los administradores
        this.usuarioService.listarTodos().subscribe({
          next: (usuariosRes: any) => {
            const lista = Array.isArray(usuariosRes) ? usuariosRes : (usuariosRes?.usuarios || usuariosRes?.data || []);
            
            // Filtramos para contar únicamente a los que NO son administradores (id_rol !== 3)
            const usuariosReales = lista.filter((u: Usuario) => Number(u.id_rol) !== 3);
            this.stats.usuariosRegistrados = usuariosReales.length;
            
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al filtrar usuarios para el KPI:', err);
            this.cargando = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.mensajeError = 'Error al cargar las métricas del sistema';
        this.cargando = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }
}