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
  
  async initialiseAnimacion(num) {
    let espera = await this.miMotor.iniciarAnimacion(num);
    return true;
  }

  async animaciones(){
    let espera = await this.miMotor.dibujarAnimaciones();
  }

  async cambiarTexturas(textura){
    let espera = await this.miMotor.cambioTexturas(textura);
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

