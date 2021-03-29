import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../models/cliente.model';

import Chart from 'chart.js';

import { UsuarioService } from '../../../services/usuario.service';
import { ChartService } from '../../../services/charts.service';

@Component({
  selector: 'app-cuadro-cliente',
  templateUrl: './cuadro-cliente.component.html',
  styleUrls: ['./cuadro-cliente.component.css']
})
export class CuadroClienteComponent implements OnInit {

  private uid;

  public canvas01;
  public chart01:Chart;

  public canvas02;
  public chart02:Chart;

  constructor(private usuarioService :UsuarioService, private chartServices :ChartService) {
    this.uid = this.usuarioService.getID();

   }


  ngOnInit(): void {
    console.log(this.uid);
    
    this.canvas01 = <HTMLCanvasElement> document.querySelector('#chartPrendasUsadas');
    this.cargarChartUsos();

    this.canvas02 = <HTMLCanvasElement> document.querySelector('#chartPrendasUsadas2');
    this.cargarChartUsos2();
  }

  cargarChartUsos(){
    console.log("empieza cargar usos");
    // si se ha creado un chart antes hay que destruirlo (sino hara cosas raras el canvas al pasar el raton)
    if (this.chart01){
      this.chart01.destroy();
    }
    this.chartServices.getUsosPrendasCliente().then( (res)=>{
  
      let prendas = res['prenda'];
      let usos = res['usos'];
      let nombres = res['nombres'];
      let aux, aux1, aux2;

      for (let i = 0; i < usos.length-1; i++){
        for (let j = i+1; j < usos.length; j++){
          if(usos[j] > usos[i]) {
            aux = usos[i];
            aux1 = prendas[i];
            aux2 = nombres[i];
            usos[i] = usos[j];
            prendas[i] = prendas[j];
            nombres[i] = nombres [j];
            usos[j] = aux; 
            prendas[j] = aux1; 
            nombres[j] = aux2; 
          }
        }
      }
      console.log(nombres)

      let prendasM = [];
      let usosM = [];
      let nombresM = [];

      let top = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      for(let a = 0; a < prendas.length && a < 5; a++) {
        prendasM.push(prendas[a]);
        usosM.push(usos[a]);
        nombresM.push(nombres[a]);
      }
      this.chart01 = new Chart(this.canvas01, {
        type: "bar",
        data: {
            labels: nombresM, //eje x
            datasets: [{
            label: 'Número de usos',
            data: usosM,
            backgroundColor: "rgba(251, 155, 2, 0.3)",
            borderColor:"rgb(251, 155, 2)",
            borderWidth:2
  
          }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 10,
                    }
                }]
            }
        }
      });
    }).catch(error=>{
      console.log(error);
    });
  
  }

  cargarChartUsos2(){
    console.log("empieza cargar usos");
    // si se ha creado un chart antes hay que destruirlo (sino hara cosas raras el canvas al pasar el raton)
    if (this.chart02){
      this.chart02.destroy();
    }
    this.chartServices.getUsosPrendasCliente().then( (res)=>{
  
      let prendas = res['prenda'];
      let usos = res['usos'];
      let nombres = res['nombres'];
      let aux, aux1, aux2;

      for (let i = 0; i < usos.length-1; i++){
        for (let j = i+1; j < usos.length; j++){
          if(usos[j] < usos[i]) {
            aux = usos[i];
            aux1 = prendas[i];
            aux2 = nombres[i];
            usos[i] = usos[j];
            prendas[i] = prendas[j];
            nombres[i] = nombres [j];
            usos[j] = aux; 
            prendas[j] = aux1; 
            nombres[j] = aux2; 
          }
        }
      }
      console.log(nombres)

      let prendasM = [];
      let usosM = [];
      let nombresM = [];

      let top = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      for(let a = 0; a < prendas.length && a < 5; a++) {
        prendasM.push(prendas[a]);
        usosM.push(usos[a]);
        nombresM.push(nombres[a]);
      }
      this.chart02 = new Chart(this.canvas02, {
        type: "bar",
        data: {
            labels: nombresM, //eje x
            datasets: [{
            label: 'Número de usos',
            data: usosM,
            backgroundColor: "rgba(251, 155, 2, 0.3)",
            borderColor:"rgb(251, 155, 2)",
            borderWidth:2
  
          }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 10,
                    }
                }]
            }
        }
      });
    }).catch(error=>{
      console.log(error);
    });
  
  }

}
