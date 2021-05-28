import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilGuard implements CanActivate, CanActivateChild {

  constructor( private router:Router,
               private authService :AuthService ) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return new Promise<boolean> ( (resolve, reject) => {
        this.authService.validarToken().then( (res)=> {

          resolve(true);

        }).catch( (error) => {

          console.log('token no valido');
          this.router.navigateByUrl('/login');
          reject(false);

        });
      });

  }


  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return new Promise<boolean> ( (resolve, reject) => {
        this.authService.validarToken().then( (res)=> {

          resolve(true);

        }).catch( (error) => {

          console.log('token no valido');
          this.router.navigateByUrl('/login');
          reject(false);

        });
      });

  /*     // console.log('buscando nuevamente la ruta ', childRoute);
      // console.log('buscando ruta completa: ', state.url);
      let ruta;

      let url = state.url;
      let partes = url.split('/');

      console.log ('partes url: ', partes);
      if(partes.length > 2)
        ruta = partes[2];
      else
        ruta = '';
      // const ruta = childRoute.routeConfig.path;


      if (ruta == ''){

        if(this.usuarioService.isAdmin()){
          console.log('es admin');
          this.router.navigateByUrl('/perfil/admin');
        }
        else if(this.usuarioService.isCliente()){
          console.log('es cliente');
          this.router.navigateByUrl('/perfil/cliente');
        }
        else if(this.usuarioService.isUsuario()){
          console.log('es usuario');
          this.router.navigateByUrl('/perfil/usuario');
        }
        return true;

      }
      else if(ruta == 'admin'){
        console.log('perfil admin');
        if (this.usuarioService.isAdmin()){
          return true;
        }
        this.router.navigateByUrl('/perfil');
      }
      else if(ruta == 'cliente'){
        console.log('perfil cliente');
        if (this.usuarioService.isCliente()){
          return true;
        }
        this.router.navigateByUrl('/perfil');
      }
      else if(ruta == 'usuario'){
        console.log('perfil usuario');
        if (this.usuarioService.isUsuario()){
          return true;
        }
        this.router.navigateByUrl('/perfil');
      }
      else {
        this.router.navigateByUrl('/perfil');
      } */

  }

}
