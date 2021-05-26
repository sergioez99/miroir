import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from "@angular/core";
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { interval } from 'rxjs';
import { WebGLService } from '../../services/webgl.service';
import { TicketService } from '../../services/ticket.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-probador-prueba',
  templateUrl: './probador-prueba.component.html',
  styleUrls: ['./probador-prueba.component.css']
})
export class ProbadorPruebaComponent implements OnInit, OnDestroy {

  @ViewChild("sceneCanvas") private canvas: ElementRef<HTMLCanvasElement>;

  private _60fpsInterval = 16.666666666666666667;
  private gl: WebGLRenderingContext;
  private rotX = 0; rotY = 0; rotZ = 0;
  private lastX = 0; lastY = 0; trackingMouseMotion = false; dMouseX = 0; dMouseY = 0; rollCamera = true;
  private trasX = 0; trasY = 0; trasZ = 0;
  private scale = 1; // zoom
  private drawSceneInterval;
  private prendas = 0;
  private animacion = 0;

  private ticket = null;
  private modelosTicket: string[];
  private fuera = false;

  //cosas pal ticket
  private clave; usuario; prendaID; talla;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private webglService: WebGLService,
    private ticketService: TicketService,
    private usuarioService: UsuarioService) { }


  async funcionCanvas(num) {
    if (!this.canvas) {
      alert("canvas not supplied! cannot bind WebGL context!");
      return;
    }
    if(this.prendas == 0){
      this.gl = await this.webglService.initialiseWebGLContext(this.canvas.nativeElement);
      this.iniciarEvents()
    }
    this.prendas++;
    this.animacion+=num;
    if(this.animacion < 0)
      this.animacion = 2; //El número máximo de animaciones que haya
    if(this.animacion > 2)
      this.animacion = 0;
    let cambio = await this.webglService.initialiseAnimacion(this.animacion);
   
    console.log(this.fuera)
    if(!this.fuera){
      this.drawSceneInterval = setInterval(() => {
        this.drawScene();
      }, this._60fpsInterval)
    }
  }

  ngOnInit(): void {
    setTimeout(() =>{this.funcionCanvas(0)}, 1000);
    this.fuera = false;
  }


  @HostListener('unloaded')
  ngOnDestroy(): void {
    clearInterval(this.drawSceneInterval);
    this.fuera = true;
  }

  drawScene() {
    this.webglService.animaciones();
  }

  iniciarEvents(){
    // Eventos de ratón aquí por el elemento canvas html

    this.canvas.nativeElement.addEventListener('mousedown', e => {
      var x = e.clientX;
      var y = e.clientY;

      var rect = this.canvas.nativeElement.getBoundingClientRect();

      if (rect.left <= x && rect.right > x &&
          rect.top <= y && rect.bottom > y) {
          this.lastX = x;
          this.lastY = y;
          this.trackingMouseMotion = true;
      }

    })


    this.canvas.nativeElement.addEventListener('mouseup', e => {
      this.trackingMouseMotion = false;
    })


    this.canvas.nativeElement.addEventListener('mousemove', e =>{
      var x = e.clientX;
      var y = e.clientY;

      if (this.trackingMouseMotion) {
        //Rotacion z
          this.dMouseX = (x - this.lastX)/this.canvas.nativeElement.width;
          this.dMouseY = (y - this.lastY)/this.canvas.nativeElement.height;
          this.rotZ += 30 * this.dMouseX;
          this.rotZ %= 360;

      }
      this.lastX = x;
      this.lastY = y;

      //Rotación solo de Z, X e Y no son necesarias, pq la cámara deja de ver el modelo, traslación por ver
      this.webglService.updateMouseevent(this.rotZ);

    })

    this.canvas.nativeElement.addEventListener('wheel', e => {
      e.preventDefault();
      //const [clipX, clipY] = this.getClipSpaceMousePosition(e);

      let hacerzoom = e.deltaY;

      if(hacerzoom < 0){
        this.scale = this.scale + 0.05;
        hacerzoom = 0;
      }
      if(hacerzoom > 0){
        this.scale = this.scale - 0.05;
        hacerzoom = 0;
      }



      if(this.scale < 1){
        this.scale = 1;
      }

      //this.scale = Math.min(Math.max(.125, this.scale), 4);

      this.webglService.updateZoom(this.scale);



    }, {
      passive: false
    })
  }

}
