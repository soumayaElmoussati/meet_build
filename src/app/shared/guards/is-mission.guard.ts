import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class IsMissionGuard implements CanActivate {

  constructor(
    private router: Router,
    private tokenS: TokenService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
 
      if (isPlatformBrowser(this.platformId)) {
        if(this.tokenS.getRole()?.includes('mission')){
          return true;
        }else{
          this.router.navigate(['login']);
          return false;
        }
      }if (isPlatformServer(this.platformId)) {
        return true;
      }


  }
  
}
