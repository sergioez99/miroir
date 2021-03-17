import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js';
import { UsuarioService } from '../../../services/usuario.service';

import { DatePipe } from '@angular/common';
import { ChartService } from '../../../services/charts.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  public totalUsuarios;
  public totalClientes;
  public totalPrendas;

  constructor( private chartServices :ChartService,
               private fb: FormBuilder,
               private datepipe: DatePipe) { }

  ngOnInit():void {
    this.canvas01 = <HTMLCanvasElement> document.querySelector('#chartFechaAltaUsuario');
    this.canvas02 = <HTMLCanvasElement> document.querySelector('#chartHoraAltaUsuario');

    // preparar el formulario de fechas
    let fechaF = new Date(Date.now());
    let fechaI = new Date(fechaF);
    fechaI.setDate(fechaI.getDate()-30);

    this.formFechas = this.fb.group({
      fechaI: [fechaI, [Validators.required]],
      fechaF: [fechaF, [Validators.required]],
    });


    this.cargarValoresFijos();
    this.cargarChartFechasAlta(this.chart01, this.canvas01);
    this.cargarChartHorasAlta(this.chart02, this.canvas02);

  }
  cargarChartHorasAlta(chart, canvas){

    // si se ha creado un chart antes hay que destruirlo (sino hara cosas raras el canvas al pasar el raton)
    if (chart){
      chart.destroy();
    }
    this.chartServices.getAltasHoras().then( (res)=>{

      let labels = res['rango'];
      let usuarios = res['usuarios'];
      let clientes = res['clientes'];

      chart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels, //eje x
            datasets: [{
              label: 'Número de usuarios',
              data: usuarios,
              backgroundColor: "rgba(200, 92, 12, 0.3)",
              borderColor:"rgb(200, 92, 12)",
              borderWidth:1
          },{
            label: 'Número de clientes',
            data: clientes,
            backgroundColor: "rgba(35, 17, 200, 0.3)",
            borderColor:"rgb(35, 17, 200)",
            borderWidth:1

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
  cargarFechas(){
    this.cargarChartFechasAlta(this.chart01, this.canvas01);
  }
  cargarChartFechasAlta(chart, canvas){

    // si se ha creado un chart antes hay que destruirlo (sino hara cosas raras el canvas al pasar el raton)
    if (chart){
      chart.destroy();
    }

    if(this.formFechas.valid){
      // cargar las nuevas fechas del formulario
      let fecha_inicial = this.formFechas.value.fechaI;
      let fecha_final = this.formFechas.value.fechaF;

      console.log(fecha_inicial);
        console.log(fecha_final);

      // hacer la peticion al backend (la creada para este chart)
      this.chartServices.getAltasFechas(fecha_inicial, fecha_final).then( (res)=>{

        console.log('respuesta intentando conseguir los datos de fechas: ', res);

        console.log(res['rango']);

        let labels = [];
        let aux;
        for (let i=0; i < res['rango'].length; i++){
          aux = new Date(res['rango'][i]);
          labels[i] = this.datepipe.transform(aux, 'yyyy-MM-dd');

        }


        // let labels = this.datepipe.transform(res['rango'], 'yyyy-MM-dd');

        // let labels = res['rango'];
        let usuarios = res['usuarios'];
        let clientes = res['clientes'];

        chart = new Chart(canvas, {
          type: "line",
          data: {
              labels: labels, //eje x
              datasets: [{
                label: 'Número de usuarios',
                data: usuarios,
                borderColor:"rgb(200, 92, 12)"
            },{
              label: 'Número de clientes',
              data: clientes,
              borderColor:"rgb(35, 17, 200)"

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
}
