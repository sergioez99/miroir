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
    await this.miMotor.iniciarProbador(ticket, modelos[0], modelos[1]); 
    return gl;
  }

  dibujadoTemporal() {
    this.miMotor.dibujadoTemporal();

  }

  dibujar(){
    this.miMotor.dibujarEscena();
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

