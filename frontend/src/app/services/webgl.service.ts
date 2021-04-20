import { Injectable } from '@angular/core';
import { TMotorTAG } from '../motorEngine/TMotorTAG';



@Injectable({
  providedIn: 'root',
})

export class WebGLService {

  private miMotor;

  constructor() { }

  async initialiseWebGLContext(canvas: HTMLCanvasElement, modelos:string[], ticket) {

    this.miMotor = new TMotorTAG();
    var gl = this.miMotor.iniciarGL(canvas);
    console.log('modelos: ', modelos);
    await this.miMotor.iniciarProbador(ticket, modelos[0], "cuadritos.jpg", modelos[1], "CamisetaRoja.jpg"); //El segundo modelo no lo pinta

    return gl;
  }

  dibujadoTemporal() {
    this.miMotor.dibujadoTemporal();

  }

  updateMouseevent(rotZ) {
    this.miMotor.updateMouseevent(rotZ);
  }

  updateZoom(zoom){
    this.miMotor.updateZoom(zoom);
  }

  updateViewport(){
    this.miMotor.updateViewport();
  }

}

