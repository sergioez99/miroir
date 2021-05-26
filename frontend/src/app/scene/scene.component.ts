import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { WebGLService } from '../services/webgl.service';
import { TicketService } from '../services/ticket.service';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

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
  public ayuda: boolean = false;
  public drawSceneInterval: Observable<number>;
  public subs: Subscription;

  public guardar = false;


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
    this.drawSceneInterval = interval(this._60fpsInterval);
    this.subs = this.drawSceneInterval.subscribe(() => {
      this.drawScene();
    });
  }

  ngOnInit(): void {
    this.modelosTicket = [];

    this.ticket = this.route.snapshot.params['ticket'];

    this.canjearTicket();

  }

  canjearTicket() {

    // console.log('empezamos canjear ticket: ', this.ticket);

    this.ticketService.canjearTicket(this.ticket).then((res) => {

      // console.log('canjear ticket ha ido bien (ticket component)');
      // console.log(res);
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


    Swal.fire({
      title: 'Selecciona el formato:',
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: '1920x1080',
      confirmButtonAriaLabel: 'Ordenador',
      denyButtonText: '1080x1920',
      denyButtonAriaLabel: 'Movil',
      denyButtonColor: "#b388ff",
      confirmButtonColor: "#b388ff",
    }).then((result) => {

      let width: number;
      let height: number;

      if (result.isConfirmed) {
        width = 1920;
        height = 1080;
      }
      if (result.isDenied) {
        width = 1080;
        height = 1920;
      }

      if (result.isDenied || result.isConfirmed) {
        this.guardarImagen_toBlob(width, height);
      }
    });

  }

  canvasToBlob(canvas: HTMLCanvasElement, contador): Promise<Blob> {
    return new Promise((resolve, reject) => {

      try {
        canvas.toBlob((res: Blob) => {

          let proporcion = res.size / (canvas.width * canvas.height);
          console.log('contador: ', contador);
          console.log('proporcion: ', proporcion);

          if (proporcion < 0.06 && contador < 20) {
            contador++;
            this.canvasToBlob(canvas, contador).then((res) => {
              resolve(res);
            }).catch((error) => {
              reject(null);
            });
          }
          else {
            resolve(res);
          }
        }, "image/png", 0.9);

      }
      catch (err) {
        reject(null);
      }

    });
  }

  guardarImagen_toBlob(width, height) {

    let canvasProbador = document.getElementById('canvas') as HTMLCanvasElement;

    this.canvasToBlob(canvasProbador, 0).then((res) => {

      let blob = res;

      let logo = new Image();

      logo.onload = () => {

        let canvas = document.getElementById('pictureCanvas') as HTMLCanvasElement;
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var imagen_probador = new Image();

        imagen_probador.onload = function () {

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

          let imagen_ancho;
          let imagen_alto;
          if (proporcion > 1) {
            //movil
            proporcion = canvas.width / canvas.height;
            imagen_ancho = imagen_probador.height * proporcion;
            imagen_alto = imagen_probador.height;
          }
          else {
            //pc
            imagen_ancho = imagen_probador.width;
            imagen_alto = imagen_probador.width * proporcion;
          }

          let imagen_x = Math.abs(imagen_probador.width - imagen_ancho) / 2;
          let imagen_y = Math.abs(imagen_probador.height - imagen_alto) / 2;

          /*
            // CONSOLE LOG VARIOS

            console.log('canvas: height: ', canvas.height);
            console.log('canvas: width: ', canvas.width);
            console.log('canvas: proporcion: ', proporcion);
            console.log('imagen_ancho:', imagen_ancho);
            console.log('imagen_alto:', imagen_alto);
            console.log('imagen_x:', imagen_x);
            console.log('imagen_y:', imagen_y);
          */

          if (proporcion > 1) {
            ctx.drawImage(imagen_probador,
              imagen_x, imagen_y, imagen_ancho, imagen_alto,
              0, 0, canvas.width, canvas.height);
          }
          else {
            ctx.drawImage(imagen_probador,
              imagen_x, imagen_y, imagen_ancho, imagen_alto,
              0, 0, canvas.width, canvas.height);
          }



          ctx.drawImage(logo, 0, 0, 100, 100);


          canvas.toBlob((res: Blob) => {

            let image = res;

            const data = window.URL.createObjectURL(image);


            const a = document.createElement('a')
            a.href = data;
            a.download = "descarga.png";
            a.focus();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);


          }, "image/png", 0.9);

        }

        imagen_probador.src = URL.createObjectURL(blob);

      }
      logo.src = '../../assets/Miroir M.png';


    }).catch((error) => {
      console.log('no ha podido: ', error);
      Swal.fire({
        title: 'Ha habido algún problema, por favor, inténtelo de nuevo.',
        showCloseButton: true,
        confirmButtonText: 'Aceptar',
      });
    });

  }

  menuVisible() {
    this.visible = !this.visible;

    if (this.visible) {
      let objetos = document.getElementsByClassName('mir-menu');
      for (let i = 0; i < objetos.length; i++) {
        let aux = objetos[i] as HTMLElement;
        aux.style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
      }
    }
    else {
      let objetos = document.getElementsByClassName('mir-menu');
      for (let i = 0; i < objetos.length; i++) {
        let aux = objetos[i] as HTMLElement;
        aux.style.backgroundColor = 'rgba(200, 200, 200, 0.0)';
      }
    }
  }
}
