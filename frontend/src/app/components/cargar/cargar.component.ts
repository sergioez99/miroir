import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay } from "rxjs/operators";

@Component({
  selector: 'app-cargar',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.css']
})

export class CargarComponent implements OnInit {

  public archivo1:any;
  public archivo2:any;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    console.log(this.archivo1);
    console.log(this.archivo2);
    this.cargarArchivos();
    console.log(this.archivo1);
    console.log(this.archivo2);
    console.log('Terminado de cargar');
  }

  imprimir() {
    console.log(this.archivo1);
    console.log(this.archivo2);
  }

  cargarArchivos() {
    this.cargar('archivo1.json').subscribe(res => this.archivo1 = res);
    this.cargar('archivo2.json').subscribe(res => this.archivo2 = res);
    console.log('terminar cargarArchivos');
  }

  cargar(nombre:string) {
    return this.http.get(`/assets/${nombre}`).pipe(delay(5000));
  }
}
