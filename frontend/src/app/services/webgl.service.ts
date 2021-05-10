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
    await this.miMotor.iniciarProbador(); 
    return gl;
  }

  dibujadoTemporal() {
    this.miMotor.dibujadoTemporal();

  }

  dibujar(ticket, modelos){
    this.miMotor.dibujarEscena(ticket, modelos);
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

  zoomCamara([clipX, clipY]){
    this.miMotor.camaraZoom([clipX, clipY]);
  }

}

