// auth.guard.ts
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {

      const userLogged = localStorage.getItem('user'); // ou use um AuthService
      if (userLogged) {
        return true;
      } else {
        this.router.navigate(['/login']); // redireciona se não estiver logado
        return false;
      }
    }else{
      return false;
    }
  }
}
