import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { interval } from 'rxjs';
import { WebGLService } from '../../services/webgl.service';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-probador01',
  templateUrl: './probador01.component.html',
  styleUrls: ['./probador01.component.css']
})

export class Probador01Component implements OnInit {
  @ViewChild("sceneCanvas") private canvas: ElementRef<HTMLCanvasElement>;

  private _60fpsInterval = 16.666666666666666667;
  private gl: WebGLRenderingContext;
  private rotX = 0; rotY = 0; rotZ = 0;
  private lastX = 0; lastY = 0; trackingMouseMotion = false; dMouseX = 0; dMouseY = 0; rollCamera = true;
  private trasX = 0; trasY = 0; trasZ = 0;
  private scale = 1; // zoom

  private ticket = null;
  private modelosTicket: string[];

  constructor(private router :Router,
    private route: ActivatedRoute,
    private webglService :WebGLService,
    private ticketService: TicketService,) { }


    async funcionCanvas() {
      if (!this.canvas) {
        alert("canvas not supplied! cannot bind WebGL context!");
        return;
      }

      await this.webglService.initialiseWebGLContext(this.canvas.nativeElement, this.modelosTicket, this.ticket).then(gl => this.gl = gl);
      const drawSceneInterval = interval(this._60fpsInterval);
      this.iniciarEvents()
      drawSceneInterval.subscribe(() => {
        this.drawScene();
      });


    }

    ngOnInit(): void {
      this.modelosTicket = [];

      this.ticket = this.route.snapshot.params['ticket'];

      if (this.ticket == null){
        this.crearTicket();
      }
      else {
        this.canjearTicket();
      }


    }

    canjearTicket() {

      console.log('empezamos canjear ticket: ', this.ticket);

      this.ticketService.canjearTicket(this.ticket).then((res) => {

        console.log('canjear ticket ha ido bien (ticket component)');
        console.log(res);
        this.modelosTicket.push(res['avatar']);
        this.modelosTicket.push(res['prenda']);



        this.funcionCanvas();

      }).catch((error) => {

        console.warn(error);

      });
    }

    crearTicket(){

      this.ticketService.obtenerTicket().then((res) => {

        console.log('ticket creado: ',res);

        this.ticket = res;
        this.canjearTicket();

      }).catch((error) => {

        console.warn(error);

      });

    }



   drawScene() {
      //this.webglService.updateViewport();
      //this.webglService.dibujadoTemporal();

      this.webglService.dibujar();
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
