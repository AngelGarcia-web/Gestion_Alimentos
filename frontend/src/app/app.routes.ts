import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AlimentosComponent } from './components/alimentos/alimentos.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { HistorialComponent } from './components/historial/historial.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3] }
  },
  { 
    path: 'alimentos', 
    component: AlimentosComponent, 
    canActivate: [AuthGuard],
    data: { roles: [1, 3] } // Donantes y Admins
  },
  { 
    path: 'solicitudes', 
    component: SolicitudesComponent, 
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3] }
  },
  { 
    path: 'historial', 
    component: HistorialComponent, 
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3] }
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: [3] } // <--- Exclusivo de Admin (Rol 3)
  },
  { 
    path: 'usuarios', 
    component: UsuariosComponent, 
    canActivate: [AuthGuard],
    data: { roles: [3] } // <--- Exclusivo de Admin (Rol 3)
  },
  { 
    path: 'perfil', 
    component: PerfilComponent, 
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3] }
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];