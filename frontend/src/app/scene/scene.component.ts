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


    ngAfterViewInit(): void {
      if (!this.canvas) {
        alert("canvas not supplied! cannot bind WebGL context!");
        return;
      }
      this.webglService.initialiseWebGLContext(this.canvas.nativeElement).then(gl => this.gl = gl);
      // Set up to draw the scene periodically.
      const drawSceneInterval = interval(this._60fpsInterval);
      drawSceneInterval.subscribe(() => {
        this.drawScene();
      });
      
     
    }

    ngOnInit(): void {

    }

   

    private drawScene() {
      // prepare the scene and update the viewport
      this.webglService.updateViewport();
      this.webglService.prepareScene();
      // draw the scene
      const vertexCount = 36;
      const type = this.gl.UNSIGNED_SHORT;
      const offset = 0;
      this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
    }
}
