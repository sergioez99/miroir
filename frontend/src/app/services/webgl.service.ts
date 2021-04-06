import { Injectable } from '@angular/core';
import { TMotorTAG } from '../motorEngine/TMotorTAG';



@Injectable({
  providedIn: 'root',
})

export class WebGLService {

  private miMotor;

  constructor() { }

  async initialiseWebGLContext(canvas: HTMLCanvasElement) {

    this.miMotor = new TMotorTAG();
    var gl = this.miMotor.iniciarGL(canvas);
    await this.miMotor.iniciarProbador("camisa3.json", "CamisaRoja.jpg", "camiseta1.json", "CamisetaRoja.jpg"); //El segundo modelo no lo pinta
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

