import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlimentoService } from '../../core/services/alimento.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { SolicitudService } from '../../core/services/solicitud.service';
import { AuthService } from '../../core/services/auth.service';
import { Alimento } from '../../core/models/alimento';
import { Categoria } from '../../core/models/categoria';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  alimentos: Alimento[] = [];
  alimentosFiltrados: Alimento[] = [];
  categorias: Categoria[] = [];
  
  categoriaSeleccionada: number = 0;
  mensajeRespuesta: string = '';
  mensajeError: string = '';

  mostrarModalSolicitud: boolean = false;
  alimentoSeleccionado: Alimento | null = null;
  mensajeSolicitud: string = '';

  constructor(
    private alimentoService: AlimentoService,
    private categoriaService: CategoriaService,
    private solicitudService: SolicitudService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarAlimentos();
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  cargarAlimentos(): void {
    const rol = this.authService.getRoleId();

    const peticion$ = (rol === 1) 
      ? this.alimentoService.obtenerMisAlimentos() 
      : this.alimentoService.obtenerTodos();

    peticion$.subscribe({
      next: (data) => {
        const todos = data || [];
        
        if (rol === 1) {
          this.alimentos = todos;
        } else {
          this.alimentos = todos.filter((a: any) => {
            const estado = (a.estado || '').toLowerCase();
            return estado !== 'entregado' && estado !== 'reservado';
          });
        }

        this.filtrar();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar alimentos', err)
    });
  }

  filtrar(): void {
    const idCat = Number(this.categoriaSeleccionada);
    if (idCat === 0) {
      this.alimentosFiltrados = [...this.alimentos];
    } else {
      this.alimentosFiltrados = this.alimentos.filter(
        a => Number(a.id_categoria) === idCat
      );
    }
    this.cdr.detectChanges();
  }

  abrirModalSolicitud(alimento: Alimento): void {
    this.alimentoSeleccionado = alimento;
    this.mensajeSolicitud = 'Solicitud de alimento realizada desde la plataforma';
    this.mostrarModalSolicitud = true;
    this.cdr.detectChanges();
  }

  cerrarModalSolicitud(): void {
    this.mostrarModalSolicitud = false;
    this.alimentoSeleccionado = null;
    this.mensajeSolicitud = '';
    this.cdr.detectChanges();
  }

  enviarSolicitudModal(): void {
    if (!this.alimentoSeleccionado || !this.alimentoSeleccionado.id_publicacion) return;

    const nuevaSolicitud = {
      id_publicacion: this.alimentoSeleccionado.id_publicacion,
      mensaje: this.mensajeSolicitud || 'Solicitud de alimento realizada desde la plataforma'
    };

    this.solicitudService.crearSolicitud(nuevaSolicitud as any).subscribe({
      next: () => {
        this.mensajeRespuesta = 'Solicitud enviada exitosamente';
        this.cerrarModalSolicitud();
        this.cargarAlimentos();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.mensajeRespuesta = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'Error al enviar la solicitud';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.mensajeError = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  confirmarEntrega(id_publicacion: number | undefined): void {
    if (!id_publicacion) return;

    this.alimentoService.actualizar(id_publicacion, { estado: 'entregado' } as any).subscribe({
      next: () => {
        this.mensajeRespuesta = 'Estado actualizado a entregado correctamente';
        this.cargarAlimentos();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.mensajeRespuesta = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'Error al actualizar el estado';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.mensajeError = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  get esBeneficiario(): boolean {
    const rol = this.authService.getRoleId();
    return rol === 2 || rol === 3;
  }

  get esDonante(): boolean {
    const rol = this.authService.getRoleId();
    return rol === 1 || rol === 3;
  }
}