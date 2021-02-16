import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class VerificacionService{

  constructor( private apiService :ApiService) {


  }

  reenviarEmail(email: string) :Promise<any>{

    return new Promise ( (resolve, reject) => {

      this.apiService.reenviarCall(email).subscribe( (res) => {
  
          console.log(res);
          resolve(true);
  
        }, (err) =>{
  
          console.error(err);
          reject(err);
  
       
        });
      });
  }

  verificarEmail(token: string) :Promise<any>{

    return new Promise ( (resolve, reject) => {

    this.apiService.verificationCall(token).subscribe( (res) => {

        console.log(res);
        resolve(true);

      }, (err) =>{

        console.error(err);
        reject(err);

      });


    });
  }
}
