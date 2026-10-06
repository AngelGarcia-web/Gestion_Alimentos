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

    const rolesPermitidos = route.data['roles'] as Array<number>;
    if (rolesPermitidos && rolesPermitidos.length > 0) {
      const userRole = this.authService.getRoleId();
      if (userRole === null || !rolesPermitidos.includes(userRole)) {
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;
  }
}