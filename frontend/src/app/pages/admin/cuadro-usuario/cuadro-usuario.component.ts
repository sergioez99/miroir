import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js';
import { UsuarioService } from '../../../services/usuario.service';

import { DatePipe } from '@angular/common';
import { ChartService } from '../../../services/charts.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeoService } from '../../../services/geo.service';
import { GoogleChartComponent, GoogleChartInterface } from 'ng2-google-charts';
import { fromEventPattern } from 'rxjs';
import { GoogleChartsDataTable } from 'ng2-google-charts/lib/google-charts-datatable';

@Component({
  selector: 'app-cuadro-usuario',
  templateUrl: './cuadro-usuario.component.html',
  styleUrls: ['./cuadro-usuario.component.css']
})
export class CuadroUsuarioComponent implements OnInit {

  public formFechas: FormGroup | null = null;

  public canvas01;
  public chart01:Chart;

  public canvas02;
  public chart02:Chart;

  public canvas03;
  public chart03:Chart;

  public totalUsuarios;
  public totalClientes;
  public totalPrendas;

  public geoChart: GoogleChartInterface = {
    chartType: 'GeoChart',
    dataTable: [
      [ 'Comunidad', 'Prenda', 'Núm. de pruebas' ],
      [ 'ES-AR', 'zapatacas', 75 ],
      [ 'ES-CL', 'gameboy', 12 ],
      [ 'ES-VC', 'cacota', 600 ]
    ],
    //firstRowIsData: true,
    options: {region: 'ES',
              resolution:'provinces',
              colorAxis:{'colors:': ['#00853f', 'orange', '#e31b23']},
              backgroundColor:'#81d4fa',
            }
    };

  constructor( private chartServices :ChartService,
               private fb: FormBuilder,
               private datepipe: DatePipe,
               private GeoService: GeoService) { }

  ngOnInit():void {
    this.canvas01 = <HTMLCanvasElement> document.querySelector('#chartFechaAltaUsuario');
    this.canvas02 = <HTMLCanvasElement> document.querySelector('#chartHoraAltaUsuario');
    this.canvas03 = <HTMLCanvasElement> document.querySelector('#chartPrendasUsadas');

    // preparar el formulario de fechas
    let fechaF = new Date(Date.now());
    let fechaI = new Date(fechaF);
    fechaI.setDate(fechaI.getDate()-30);

    this.formFechas = this.fb.group({
      fechaI: [fechaI, [Validators.required]],
      fechaF: [fechaF, [Validators.required]],
    });


    this.cargarValoresFijos();
    this.cargarChartFechasAlta();
    this.cargarChartHorasAlta();
    this.cargarChartUsos();

    this.cargarMapaRegiones();

  }
  cargarChartHorasAlta(){

    // si se ha creado un chart antes hay que destruirlo (sino hara cosas raras el canvas al pasar el raton)
    if (this.chart02){
      this.chart02.destroy();
    }
    this.chartServices.getAltasHoras().then( (res)=>{

      let labels = res['rango'];
      let usuarios = res['usuarios'];
      let clientes = res['clientes'];

      this.chart02 = new Chart(this.canvas02, {
        type: "bar",
        data: {
            labels: labels, //eje x
            datasets: [{
              label: 'Número de usuarios',
              data: usuarios,
              backgroundColor: "rgba(179, 136, 255, 0.3)",
              borderColor:"rgb(179, 136, 255)",
              borderWidth:2
          },{
            label: 'Número de clientes',
            data: clientes,
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

  cargarChartFechasAlta(){

    // si se ha creado un chart antes hay que destruirlo (sino hara cosas raras el canvas al pasar el raton)
    if (this.chart01){
      console.log('anterior chart destruido');
      this.chart01.destroy();
    }

    if(this.formFechas.valid){
      // cargar las nuevas fechas del formulario
      let fecha_inicial = this.formFechas.value.fechaI;
      let fecha_final = this.formFechas.value.fechaF;

      // hacer la peticion al backend (la creada para este chart)
      this.chartServices.getAltasFechas(fecha_inicial, fecha_final).then( (res)=>{

        let labels = [];
        let aux;
        for (let i=0; i < res['rango'].length; i++){
          aux = new Date(res['rango'][i]);
          labels[i] = this.datepipe.transform(aux, 'yyyy-MM-dd');

        }

        // let labels = res['rango'];
        let usuarios = res['usuarios'];
        let clientes = res['clientes'];

        this.chart01 = new Chart(this.canvas01, {
          type: "line",
          data: {
              labels: labels, //eje x
              datasets: [{
                    label: 'Número de usuarios',
                    data: usuarios,
                    backgroundColor: "rgba(179, 136, 255, 0.3)",
                    borderColor:"rgb(179, 136, 255)",
                    borderWidth:2
                },{
                    label: 'Número de clientes',
                    data: clientes,
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

  cargarValoresFijos(){

    // total de usuarios
    this.chartServices.getTotalUsuarios().then(res => {
      this.totalUsuarios = res;
    }).catch( error =>{
      console.log(error);
    });

    // total de clientes
    this.chartServices.getTotalClientes().then(res => {
      this.totalClientes = res;
    }).catch( error =>{
      console.log(error);
    });

    // total de clientes
    this.chartServices.getTotalPrendas().then(res => {
      this.totalPrendas = res;
    }).catch( error =>{
      console.log(error);
    });


  }

  cargarChartUsos(){
    console.log("empieza cargar usos");
    // si se ha creado un chart antes hay que destruirlo (sino hara cosas raras el canvas al pasar el raton)
    if (this.chart03){
      this.chart03.destroy();
    }
    this.chartServices.getUsosPrendas().then( (res)=>{

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
      for(let a = 0; a < prendas.length && a < 10; a++) {
        prendasM.push(prendas[a]);
        usosM.push(usos[a]);
        nombresM.push(nombres[a]);
      }
      this.chart03 = new Chart(this.canvas03, {
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

  async cargarMapaRegiones(){

    let datos = await this.GeoService.getRegiones();

    console.log(datos);

    this.geoChart = {
      chartType: 'GeoChart',
      dataTable: datos,
      //firstRowIsData: true,
      options: {region: 'ES',
                resolution:'provinces',
                colorAxis:{'colors:': ['#00853f', 'orange', '#e31b23']},
                backgroundColor:'#81d4fa',
              }
      };

  }

}

