import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class IsNotJobGuard implements CanActivate {

  constructor(
    private router: Router,
    private tokenS: TokenService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     
        if (this.tokenS.getRole()?.includes('job')) {
          this.router.navigate(['/me']);
          return false;
        } else {
          return true;
        }
  }
  
}
