import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor( private router:Router,
               private authService: AuthService ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


      // comprobar si el usuario ha iniciado o no sesion...
      console.log('guard, ¿estás logueado?');

      return new Promise<boolean> ( (resolve, reject) => {
        this.authService.validarToken().then( (res)=> {

          console.log('estoy logueado');
          resolve(true);

        }).catch( (error) => {

          console.log('token no valido');
          // aqui el token no es correcto o ha caducado o lo que sea
          this.router.navigateByUrl('/login');
          reject(false);

        });
      });


  }

}
