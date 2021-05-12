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
    return gl;
  }

  async cargarModelos(ticket, modelos){
    let espera = await this.miMotor.iniciarProbador(ticket, modelos);
    return true;
  }

  dibujar(dibuja){
    if(dibuja)
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

