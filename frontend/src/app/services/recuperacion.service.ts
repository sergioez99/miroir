import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class RecuperacionService{

  constructor( private apiService :ApiService) {


  }

  recuperarPassword(email: string) :Promise<any>{

    return new Promise ( (resolve, reject) => {

      this.apiService.recuperacionCall(email).subscribe( (res) => {
  
          console.log(res);
          resolve(true);
  
        }, (err) =>{
  
          console.error(err);
          reject(err);
  
       
        });
      });
  }

  cambiarPassword(formData) :Promise<any>{

    return new Promise ( (resolve, reject) => {

    this.apiService.cambiarpasswordCall(formData).subscribe( (res) => {

        console.log(res);
        resolve(true);

      }, (err) =>{

        console.error(err);
        reject(err);

      });


    });
  }
}