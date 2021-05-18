import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { interval } from 'rxjs';
import { WebGLService } from '../services/webgl.service';
import { TicketService } from '../services/ticket.service';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})

export class SceneComponent implements OnInit {
  @ViewChild("sceneCanvas") private canvas: ElementRef<HTMLCanvasElement>;

  private _60fpsInterval = 16.666666666666666667;
  private gl: WebGLRenderingContext;
  private rotX = 0; rotY = 0; rotZ = 0;
  private lastX = 0; lastY = 0; trackingMouseMotion = false; dMouseX = 0; dMouseY = 0; rollCamera = true;
  private trasX = 0; trasY = 0; trasZ = 0;
  private scale = 1; // zoom

  private ticket = null;
  private modelosTicket: string[];

  private prendas = 0;
  private cargarProbador = false;

  // variable para la barra de menu
  public visible: boolean = true;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private webglService: WebGLService,
    private ticketService: TicketService,) { }

  //HAY QUE ACTUALIZAR

  async funcionCanvas() {
    if (!this.canvas) {
      alert("canvas not supplied! cannot bind WebGL context!");
      return;
    }
    if (this.prendas == 0) {
      this.gl = await this.webglService.initialiseWebGLContext(this.canvas.nativeElement);
      this.iniciarEvents();
    }
    this.cargarProbador = await this.webglService.cargarModelos(this.ticket, this.modelosTicket);
    this.dibujar();
  }

  dibujar() {
    const drawSceneInterval = interval(this._60fpsInterval);
    drawSceneInterval.subscribe(() => {
      this.drawScene();
    });
  }

  ngOnInit(): void {
    this.modelosTicket = [];

    this.ticket = this.route.snapshot.params['ticket'];

    this.canjearTicket();

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





  drawScene() {
    //this.webglService.updateViewport();
    //this.webglService.dibujadoTemporal();

    this.webglService.dibujar(this.cargarProbador);
  }

  iniciarEvents() {
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


    this.canvas.nativeElement.addEventListener('mousemove', e => {
      var x = e.clientX;
      var y = e.clientY;

      if (this.trackingMouseMotion) {
        //Rotacion z
        this.dMouseX = (x - this.lastX) / this.canvas.nativeElement.width;
        this.dMouseY = (y - this.lastY) / this.canvas.nativeElement.height;
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

      if (hacerzoom < 0) {
        this.scale = this.scale + 0.05;
        hacerzoom = 0;
      }
      if (hacerzoom > 0) {
        this.scale = this.scale - 0.05;
        hacerzoom = 0;
      }



      if (this.scale < 1) {
        this.scale = 1;
      }

      //this.scale = Math.min(Math.max(.125, this.scale), 4);

      this.webglService.updateZoom(this.scale);



    }, {
      passive: false
    })
  }

  // funcion del boton del probador para que abra la pagina de registro en una nueva pestana
  irRegistro() {

    // abrir en una pestaña nueva
    let url = environment.url_front + '/registrarse';
    window.open(url, "_blank");

  }

  guardarImagen() {
    console.log('vamos a guardar una imagen del canvas');

    let canvas_probador = this.canvas.nativeElement.toDataURL();
    let imagen_probador = new Image();

    imagen_probador.onload = () => {

      let logo = new Image();

      logo.onload = ()=> {

        let canvas = document.getElementById('pictureCanvas') as HTMLCanvasElement;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,1920,1080);
        canvas.width = 1920;
        canvas.height = 1080;

        /*
        // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

        image: elemento a dibujar

        sx => La coordenada X de la esquina superior izquierda del sub-rectangulo de la imagen origen a dibujar en el contexto de destino.
        sy => La coordenada Y de la esquina superior izquierda del sub-rectangulo de la imagen origen a dibujar en el contexto de destino.
        sWidth => El ancho del sub-rectangulo de la imagen origen a dibujar en el contexto de destino. Si no se especifica, se utiliza todo el rectangulo entero desde las coordenadas especificadas por sx y sy hasta la esquina inferior derecha de la imagen.
        sHeight => La altura del sub-rectangulo de la imagen origen a dibujar en el contexto de destino.

        dx => La coordenada X del canvas destino en la cual se coloca la esquina superior izquierda de la imagen origen.
        dy => La coordenada Y del canvas destino en la cual se coloca la esquina superior izquierda de la imagen origen.
        dWidth => El ancho para dibujar la imagen en el canvas destino.
        dHeight => El alto para dibujar la imagen en el canvas destino. Esto permite escalar la imagen dibujada. Si no se especifica, el alto de  la imagen no se escala al dibujar.
        */

        let proporcion = canvas.height / canvas.width;
        let imagen_ancho = imagen_probador.width;
        let imagen_alto = imagen_probador.width * proporcion;
        let imagen_x = Math.abs (imagen_probador.width - imagen_ancho) /2;
        let imagen_y = Math.abs (imagen_probador.height - imagen_alto) /2;

        ctx.drawImage(imagen_probador,
                      imagen_x, imagen_y, imagen_probador.width, imagen_alto,
                      0, 0, canvas.width, canvas.height);


        ctx.drawImage(logo, 0, 0, 100, 100);                       // FILL THE CANVAS WITH THE IMAGE.

        let image = canvas.toDataURL();

        let a = document.getElementById('linkDescarga') as HTMLAnchorElement;
        console.log('a: ', a);

        a.download = "esta vez si.png";
        a.href = image;

      }
      logo.src = '../../assets/Miroir M.png';

    }
    imagen_probador.src = canvas_probador;


    /*
    // GET THE IMAGE.
    var img = new Image();
    img.src = '../../assets/Miroir banner.png';

    // WAIT TILL IMAGE IS LOADED.
    img.onload = () => {
      let canvasProbador = document.getElementById('canvas') as HTMLCanvasElement;
      let probador = canvasProbador.toDataURL();
      let imagen_probador = new Image();
      imagen_probador.src = probador;

      imagen_probador.onload = () => {
        console.log(imagen_probador);

        let canvas = document.getElementById('pictureCanvas') as HTMLCanvasElement;
        var ctx = canvas.getContext("2d");
        canvas.width = 1920;
        canvas.height = 1080;

        ctx.drawImage(imagen_probador, 0, 0, 200, 137);      // FILL THE CANVAS WITH THE IMAGE.
        ctx.drawImage(img, 1000, 300, 200, 137);      // FILL THE CANVAS WITH THE IMAGE.

        let image = canvas.toDataURL();


        let a = document.getElementById('linkDescarga') as HTMLAnchorElement;
        console.log('a: ', a);

        a.download = "esta vez si.png";
        a.href = image;
      }

    }

    */


    /*

        //let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let image = this.canvas.nativeElement.toDataURL();

        let a = document.getElementById('linkDescarga') as HTMLAnchorElement;
        console.log('a: ', a);

        a.download = "esta vez si.png";
        a.href = image;
        */

  }

  menuVisible(){
    this.visible = !this.visible;

    if(this.visible){
      let objetos = document.getElementsByClassName('mir-menu');
      for(let i=0; i<objetos.length; i++){
        let aux = objetos[i] as HTMLElement;
        aux.style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
      }
    }
    else{
      let objetos = document.getElementsByClassName('mir-menu');
      for(let i=0; i<objetos.length; i++){
        let aux = objetos[i] as HTMLElement;
        aux.style.backgroundColor = 'rgba(200, 200, 200, 0.0)';
      }
    }
  }
}
