import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SceneService } from '../../services/scene.service';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})

export class SceneComponent implements OnInit, AfterViewInit {
  @ViewChild("sceneCanvas") private canvas: ElementRef<HTMLCanvasElement>;

  private _60fpsInterval = 16.666666666666666667;
  private gl: WebGLRenderingContext

  constructor(private router :Router,
    private route: ActivatedRoute,
    private sceneService :SceneService) { }


    ngAfterViewInit(): void {
      if (!this.canvas) {
        alert("canvas not supplied! cannot bind WebGL context!");
        return;
      }
      this.sceneService.initialiseWebGLContext(this.canvas.nativeElement);
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
      this.sceneService.updateViewport();
      this.sceneService.prepareScene();
      // draw the scene
      const offset = 0;
      const vertexCount = 4;
      this.gl.drawArrays(
        this.gl.TRIANGLE_STRIP,
        offset,
        vertexCount
      );
    }
    

}
