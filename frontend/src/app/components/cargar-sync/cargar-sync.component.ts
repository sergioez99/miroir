import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay } from "rxjs/operators";

@Component({
  selector: 'app-cargargar-sync',
  templateUrl: './cargar-sync.component.html',
  styleUrls: ['./cargar-sync.component.css']
})
export class CargargarSyncComponent implements OnInit {
  public archivo1:any={};
  public archivo2:any={};

  constructor(private http: HttpClient) {

  }

  async ngOnInit() {
    await this.cargarArchivos();
    console.log('Terminado de cargar');
  }

  async cargarArchivos() {
    this.archivo1 = await this.cargar('archivo1.json');
    this.archivo2 = await this.cargar('archivo2.json');
    console.log('terminar cargarArchivos');
  }

  async cargar(nombre:string) {
    let datos;
    datos = await this.http.get(`/assets/${nombre}`).pipe(delay(5000)).toPromise();
    console.log(nombre,':',datos);
    return datos;
  }

}
