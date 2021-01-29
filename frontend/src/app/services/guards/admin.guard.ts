import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private usuarioService :UsuarioService,
               private router:Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


      console.log('admin guard: ', this.usuarioService.getRol());
      console.log('admin guard: ¿puedo entrar? ', this.usuarioService.isAdmin());

      if( this.usuarioService.isAdmin() ){
        return true;
      }
      else{
        return this.router.createUrlTree(
          ['/notauth', { message: 'you do not have the permission to enter' }]
        );
      }


  }
}
