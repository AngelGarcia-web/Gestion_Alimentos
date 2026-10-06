import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const rolesPermitidos = route.data['roles'] as Array<number | string>;
    const userRole = this.authService.getRoleId();

    // --- DEPURACIÓN EN CONSOLA ---
    console.log('--- AUTH GUARD DEBUG ---');
    console.log('Ruta intentada:', state.url);
    console.log('Roles permitidos para esta ruta:', rolesPermitidos);
    console.log('Valor exacto de userRole:', userRole);
    console.log('Tipo de dato de userRole:', typeof userRole);

    if (rolesPermitidos && rolesPermitidos.length > 0) {
      if (userRole === null || userRole === undefined) {
        console.warn('Acceso denegado: userRole es null o undefined');
        this.router.navigate(['/home']);
        return false;
      }

      const roleMatches = rolesPermitidos.some(r => Number(r) === Number(userRole));
      console.log('¿El rol del usuario coincide con los permitidos?', roleMatches);

      if (!roleMatches) {
        console.warn('Acceso denegado: El rol no coincide');
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;
  }
}