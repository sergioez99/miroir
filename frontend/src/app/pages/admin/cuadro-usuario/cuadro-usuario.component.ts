import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js';
import { Usuario } from 'src/app/models/usuario.model';
import { Cliente } from 'src/app/models/cliente.model';
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

  constructor( private usuarioService: UsuarioService,
               private chartServices :ChartService,
               private datepipe: DatePipe,
               private fb: FormBuilder,) { }

  ngOnInit(): void {

    this.canvas01 = <HTMLCanvasElement> document.querySelector('#chart')

    this.renderCharts();

    this.formFechas = this.fb.group({
      fechaI: ['', [Validators.required]],
      fechaF: ['', [Validators.required]],
    });
  }

  totalChart(ctx) {

    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ['col1', 'col2', 'col3'], //eje x
            datasets: [{
                label: 'Num datos',
                data: [10, 9, 80, 100, 8]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 50,
                        suggestedMax: 100
                    }
                }]
            }
        }
    });
  }

  chartRegistroUsuarios(canvas){

    if (this.chart01){
      this.chart01.destroy();
    }

    // recoger los datos de usuario
    this.chartServices.getUsuarios().then( res =>{
      let usuarios :Usuario[]= res['usuarios'];

      let fechas = [];
      let repetida = [];
      let contador = -1;

      for(let i=0; i<usuarios.length; i++){

        let fecha :Date= new Date(usuarios[i].alta);
        let latest_date =this.datepipe.transform(fecha, 'yyyy-MM-dd');

        if (fechas[contador] != latest_date){
          ++ contador;
          fechas.push(latest_date);
          repetida.push(1);
        }
        else{
          ++ repetida[contador];
        }
      }

      this.chartServices.getClientes().then ( res =>{
        let clientes :Cliente[]= res['clientes'];

        let fechas = [];
        let repetidaCliente = [];
        let contador = -1;

        for(let i=0; i<clientes.length; i++){

          let fecha :Date= new Date(clientes[i].alta);
          let latest_date =this.datepipe.transform(fecha, 'yyyy-MM-dd');

          if (fechas[contador] != latest_date){
            ++ contador;
            fechas.push(latest_date);
            repetidaCliente.push(1);
          }
          else{
            ++ repetidaCliente[contador];
          }
        }

        let max = 0;
      for(let i=0; i<repetida.length; i++){
        if(repetida[i]>max){
          max = repetida[i];
        }
        if(repetidaCliente[i]>max){
          max = repetidaCliente[i];
        }
      }

      this.chart01 = new Chart(canvas, {
        type: "line",
        data: {
            labels: fechas, //eje x
            datasets: [{
                label: 'Número de usuarios',
                data: repetida,
                borderColor:"rgb(200, 92, 12)"
            },{
              label: 'Número de clientes',
              data: repetidaCliente,
              borderColor:"rgb(35, 17, 200)"

            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: max,
                        backgroundColor: 'rgba(0, 0, 1, 0.1)'
                    }
                }]
            }
        }
      });



    }).catch (error => {
      console.warn(error);
    });

    }).catch( (err) => {
      console.warn(err);
    });

  }


  renderCharts() {
      // const ctx = <HTMLCanvasElement> document.querySelector('#chart');

      let context = this.canvas01.getContext('2d');
      context.clearRect(0, 0, this.canvas01.width, this.canvas01.height);
      // this.totalChart(ctx);
      this.chartRegistroUsuarios(this.canvas01);
  }




  cargar(){

    if(this.formFechas.valid){

      if (this.chart01){
        this.chart01.destroy();
      }


      // const canvas = <HTMLCanvasElement> document.querySelector('#chart');
      let context = this.canvas01.getContext('2d');
      context.clearRect(0, 0, this.canvas01.width, this.canvas01.height);

      let fecha_inicial = this.formFechas.value.fechaI;
      let fecha_final = this.formFechas.value.fechaF;
      let fecha_intervalo = [];

      let fecha_aux = fecha_inicial;

      while ( fecha_aux <= fecha_final){

        fecha_intervalo.push(this.datepipe.transform(fecha_aux, 'yyyy-MM-dd'));
        fecha_aux.setDate(fecha_aux.getDate() + 1);

      }

      // recoger los datos de usuario
      this.chartServices.getUsuarios().then( res =>{
        let usuarios :Usuario[]= res['usuarios'];

        console.log('intervalo de fechas: ', fecha_intervalo);

        let fechas = fecha_intervalo;
        console.log(fechas);
        let repetida :number[] = [];
        let contador = 0;

        for (let i = 0; i< fecha_intervalo.length; i++){
          repetida[i]=0;
        }

        for(let i=0; i<usuarios.length; i++){

          let fecha :Date= new Date(usuarios[i].alta);
          let latest_date =this.datepipe.transform(fecha, 'yyyy-MM-dd');

          for (let j=0; j<fechas.length; j++){

            if (fechas[j] == latest_date){

              repetida[j] ++;
            }
          }


        }

        console.log(repetida);

      this.chartServices.getClientes().then ( res =>{
        let clientes :Cliente[]= res['clientes'];

        let fechas = [];
        let repetidaCliente = [];
        let contador = -1;

        for(let i=0; i<clientes.length; i++){

          let fecha :Date= new Date(clientes[i].alta);
          let latest_date =this.datepipe.transform(fecha, 'yyyy-MM-dd');

          if (fechas[contador] != latest_date){
            ++ contador;
            fechas.push(latest_date);
            repetidaCliente.push(1);
          }
          else{
            ++ repetidaCliente[contador];
          }
        }

        let max = 0;
        for(let i=0; i<repetida.length; i++){
          if(repetida[i]>max){
            max = repetida[i];
          }
          if(repetidaCliente[i]>max){
            max = repetidaCliente[i];
          }
        }

      this.chart01 = new Chart(this.canvas01, {
        type: "line",
        data: {
            labels: fecha_intervalo, //eje x
            datasets: [{
                label: 'Número de usuarios',
                data: repetida,
                borderColor:"rgb(200, 92, 12)"
            },{
              label: 'Número de clientes',
              data: repetidaCliente,
              borderColor:"rgb(35, 17, 200)"

            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: max,
                        backgroundColor: 'rgba(0, 0, 1, 0.1)'
                    }
                }]
            }
        }
    });




      }).catch (error => {
        console.warn(error);
      })




      console.log('lista de fechas: ', fechas);
    }).catch( (err) => {
      console.warn(err);
    });


    }

  }


}
