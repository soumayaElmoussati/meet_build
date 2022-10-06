import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class IsJobMissionGuard implements CanActivate {

  constructor(
    private tokenS: TokenService,
    private router: Router
  ){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.tokenS.getRole()?.includes('mission') || this.tokenS.getRole()?.includes('job')){
          return true;
      }else{
        this.router.navigate(['login']);
        return false;
      }
  }
  
}
