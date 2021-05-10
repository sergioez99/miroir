import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PrendaService } from '../prenda.service';

@Injectable({
  providedIn: 'root'
})
export class PrendaGuard implements CanActivate, CanActivateChild {

  constructor( private router:Router,
    private prendaService: PrendaService ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      //if( this.prendaService.isPrenda())
        return true;
/*
      this.router.navigateByUrl('/login');
      return false;
      */
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      //if( this.prendaService.isPrenda())
        return true;
/*
      this.router.navigateByUrl('/login');
      return false;
      */
  }

}
