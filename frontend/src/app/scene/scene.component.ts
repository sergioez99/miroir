import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SceneService } from '../services/scene.service';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { interval } from 'rxjs';
import { WebGLService } from '../services/webgl.service';
import { min } from 'rxjs/operators';
import { TEntity } from 'src/app/motorEngine/commons';
import { ECamera, ELight } from 'src/app/motorEngine/TEntity';
import { TNode } from 'src/app/motorEngine/TNode';
import { mat4, vec3, vec4 } from 'gl-matrix';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})

export class SceneComponent implements OnInit, AfterViewInit {
  @ViewChild("sceneCanvas") private canvas: ElementRef<HTMLCanvasElement>;

  private _60fpsInterval = 16.666666666666666667;
  private gl: WebGLRenderingContext;

  constructor(private router :Router,
    private route: ActivatedRoute,
    private sceneService :SceneService,
    private webglService :WebGLService) { }


    async ngAfterViewInit() {
      if (!this.canvas) {
        alert("canvas not supplied! cannot bind WebGL context!");
        return;
      }
      await this.webglService.initialiseWebGLContext(this.canvas.nativeElement).then(gl => this.gl = gl);
      // Set up to draw the scene periodically.
      const drawSceneInterval = interval(this._60fpsInterval);
      drawSceneInterval.subscribe(() => {
        this.drawScene();
      });
      
     
    }

    ngOnInit(): void {

    }

   

   drawScene() {
      // Eventos de ratón aquí por el elemento canvas html
      // If a mouse button is pressed, save the current mouse location
      // and start tracking mouse motion.  
    var lastX = 0, lastY = 0, trackingMouseMotion = false, dMouseX = 0, dMouseY = 0, rollCamera = true;
    var trasX = 0, trasY = 0, trasZ = 0, rotX = 0, rotY = 0, rotZ = 0; 
    this.canvas.nativeElement.addEventListener('mousedown', e => {
      var x = e.clientX;
      var y = e.clientY;
      
      var rect = this.canvas.nativeElement.getBoundingClientRect();
      // Check if the mouse cursor is in canvas. 
      if (rect.left <= x && rect.right > x &&
          rect.top <= y && rect.bottom > y) {
          lastX = x; 
          lastY = y;
          trackingMouseMotion = true;    
      }
    })    

    // If the mouse button is release, stop tracking mouse motion.     
    this.canvas.nativeElement.addEventListener('mouseup', e => {
      trackingMouseMotion = false; 
    })
    
    // Calculate how far the mouse cusor has moved and convert the mouse motion 
    // to rotation angles. 
    this.canvas.nativeElement.addEventListener('mousemove', e =>{
      var x = e.clientX;
      var y = e.clientY;
                  
      if (trackingMouseMotion) {
          var scale = 1;
          // Calculate how much the mouse has moved along X and Y axis, and then
          // normalize them based on the canvas' width and height. 
          dMouseX = (x - lastX)/this.canvas.nativeElement.width;
          dMouseY = (y - lastY)/this.canvas.nativeElement.height;            
              
          if (!rollCamera) { 
              // For camera pitch and yaw motions
              scale = 30;
              // Add the mouse motion to the current rotation angle so that the rotation 
              // is added to the previous rotations. 
              // Use scale to control the speed of the rotation.    
              rotY += scale * dMouseX;
              // Impose the upper and lower limits to the rotation angle. 
              rotY = Math.max(Math.min(rotY, 90), -90); 
              
              rotX += scale * dMouseY;
              rotX = Math.max(Math.min(rotX, 90), 90);
          } else {
              // For camera roll motion
              scale = 100; 
              
              // Add the mouse motion delta to the rotation angle, don't just replace it.
              // Use scale to control the speed of the rotation. 
              rotZ += scale * dMouseX;
              rotZ %= 360;
          }
      }
  
      // Save the current mouse location in order to calculate the next mouse motion. 
      lastX = x;
      lastY = y;
    })
      this.webglService.updateMouseevent(rotX, rotY, rotZ);
      this.webglService.prepareScene();
    }
}
