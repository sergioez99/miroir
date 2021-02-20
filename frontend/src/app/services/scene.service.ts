import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import fragmentShaderSrc from '../../../assets/toucan-fragment-shader.glsl';
import vertexShaderSrc from '../../../assets/toucan-vertex-shader.glsl';

import * as matrix from 'gl-matrix';


@Injectable({
  providedIn: 'root'
})

export class SceneService{

    constructor(private apiService :ApiService) {}

    private get clientCanvas(): Element {
        return this.gl.canvas as Element
    }
    private fieldOfView = (45 * Math.PI) / 180; // in radians
    private aspect = 1;
    private zNear = 0.1;
    private zFar = 100.0;
    private projectionMatrix = matrix.mat4.create();
    private modelViewMatrix = matrix.mat4.create();
    private buffers: any
    private programInfo: any
    
    private _renderingContext: RenderingContext;
    private get gl(): WebGLRenderingContext {
      return this._renderingContext as WebGLRenderingContext;
    }

    private determineShaderType(shaderMimeType: string): number {
        if (shaderMimeType) {
          if (shaderMimeType === 'x-shader/x-vertex') {
            return this.gl.VERTEX_SHADER;
          } else if (shaderMimeType === 'x-shader/x-fragment') {
            return this.gl.FRAGMENT_SHADER;
          } else {
            console.log('Error: could not determine the shader type');
          }
        }
        return -1;
    }

    private loadShader(shaderSource: string, shaderType: string): WebGLShader {
        const shaderTypeAsNumber = this.determineShaderType(shaderType);
        if (shaderTypeAsNumber < 0) {
          return null;
        }
        // Create the gl shader
        const glShader = this.gl.createShader(shaderTypeAsNumber);
        // Load the source into the shader
        this.gl.shaderSource(glShader, shaderSource);
        // Compile the shaders
        this.gl.compileShader(glShader);
        // Check the compile status
        const compiledShader = this.gl.getShaderParameter(
          glShader,
          this.gl.COMPILE_STATUS
        );
        return this.checkCompiledShader(compiledShader) ? glShader : null;
    }

    private checkCompiledShader(compiledShader: any): boolean {
        if (!compiledShader) {
          // shader failed to compile, get the last error
          const lastError = this.gl.getShaderInfoLog(compiledShader);
          console.log("couldn't compile the shader due to: " + lastError);
          this.gl.deleteShader(compiledShader);
          return false;
        }
        return true;
    }

    initializeShaders(): WebGLProgram {
        // 1. Create the shader program
        let shaderProgram = this.gl.createProgram();
        // 2. compile the shaders
        const compiledShaders = [];
        let fragmentShader = this.loadShader(
          fragmentShaderSrc,
          'x-shader/x-fragment'
        );
        let vertexShader = this.loadShader(
          vertexShaderSrc,
          'x-shader/x-vertex'
        );
        compiledShaders.push(fragmentShader);
        compiledShaders.push(vertexShader);
        // 3. attach the shaders to the shader program using our WebGLContext
        if (compiledShaders.length > 0) {
          for (let i = 0; i < compiledShaders.length; i++) {
            const compiledShader = compiledShaders[i];
            if (compiledShader) {
              this.gl.attachShader(shaderProgram, compiledShader);
            }
          }
        }
        // 4. link the shader program to our gl context
        this.gl.linkProgram(shaderProgram);
        // 5. check if everything went ok
        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
          console.log(
            'Unable to initialize the shader program: ' +
              this.gl.getProgramInfoLog(shaderProgram)
          );
        }
        // 6. return shader
        return shaderProgram;
    }

    initialiseBuffers(): any {
        // Create a buffer for the square's positions.
        const positionBuffer = this.gl.createBuffer();
        // bind the buffer to WebGL and tell it to accept an ARRAY of data
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        // create an array of positions for the square.
        const positions = new Float32Array([
        1.0,  1.0, 
        -1.0,  1.0, 
        1.0, -1.0, 
        -1.0, -1.0
        ]);
        // Pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // array, then use it to fill the current buffer.
        // We tell WebGL that the data supplied is an ARRAY and
        // to handle the data as a statically drawn shape.
        this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        positions,
        this.gl.STATIC_DRAW
        );

        // Set up the colors for the vertices
        let colors = new Uint16Array([
            1.0, 1.0, 1.0, 1.0, // white
            1.0, 0.0, 0.0, 1.0, // red
            0.0, 1.0, 0.0, 1.0, // green
            0.0, 0.0, 1.0, 1.0, // blue
        ]);
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(colors),
            this.gl.STATIC_DRAW
        );

        return {
            position: positionBuffer,
            color: colorBuffer,
        };
    }

    bindVertexPosition(programInfo: any, buffers: any) {
        const bufferSize = 2;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
        this.gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          bufferSize,
          type,
          normalize,
          stride,
          offset
        );
        this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    bindVertexColor(programInfo: any, buffers: any) {
        const bufferSize = 4;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
        this.gl.vertexAttribPointer(
          programInfo.attribLocations.vertexColor,
          bufferSize,
          type,
          normalize,
          stride,
          offset
        );
        this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    initialiseWebGLContext(canvas: HTMLCanvasElement) {
      // Try to grab the standard context. If it fails, fallback to experimental.
      this._renderingContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      // If we don't have a GL context, give up now... only continue if WebGL is available and working...
      if (!this.gl) {
          alert('Unable to initialize WebGL. Your browser may not support it.');
          return;
      }
      // *** set width, height and initialise the webgl canvas ***
        this.setWebGLCanvasDimensions(canvas);
        this.initialiseWebGLCanvas();
        // initialise shaders into WebGL
        let shaderProgram = this.initializeShaders();

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
              vertexPosition: this.gl.getAttribLocation(
                shaderProgram,
                'aVertexPosition'
              ),
              vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
              projectionMatrix: this.gl.getUniformLocation(
                shaderProgram,
                'uProjectionMatrix'
              ),
              modelViewMatrix: this.gl.getUniformLocation(
                shaderProgram,
                'uModelViewMatrix'
              ),
            },
        };
        // initalise the buffers to define what we want to draw
        this.buffers = this.initialiseBuffers();
        // prepare the scene to display content
        this.prepareScene();
        return this.gl;
    }

    resizeWebGLCanvas() {
        const width = this.clientCanvas.clientWidth;
        const height = this.clientCanvas.clientHeight;
        if (this.gl.canvas.width !== width || this.gl.canvas.height !== height) {
          this.gl.canvas.width = width;
          this.gl.canvas.height = height;
        }
    }

    updateWebGLCanvas() {
        this.initialiseWebGLCanvas();
        this.aspect = this.clientCanvas.clientWidth / this.clientCanvas.clientHeight;
        this.projectionMatrix = matrix.mat4.create();
        matrix.mat4.perspective(
          this.projectionMatrix,
          this.fieldOfView,
          this.aspect,
          this.zNear,
          this.zFar
        );
        // Set the drawing position to the "identity" point, which is the center of the scene.
        this.modelViewMatrix = matrix.mat4.create();
    }

    setWebGLCanvasDimensions(canvas: HTMLCanvasElement) {
        // set width and height based on canvas width and height - good practice to use clientWidth and clientHeight
        this.gl.canvas.width = canvas.clientWidth;
        this.gl.canvas.height = canvas.clientHeight;
    }

    initialiseWebGLCanvas() {
        // Set clear colour to black, fully opaque
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Enable depth testing
        this.gl.enable(this.gl.DEPTH_TEST);
        // Near things obscure far things
        this.gl.depthFunc(this.gl.LEQUAL);
        // Clear the colour as well as the depth buffer.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    prepareScene() {
        this.resizeWebGLCanvas();
        this.updateWebGLCanvas();
        // move the camera position a bit backwards to a position where 
        // we can observe the content that will be drawn from a distance
        matrix.mat4.translate(
          this.modelViewMatrix, // destination matrix
          this.modelViewMatrix, // matrix to translate
          [0.0, 0.0, -6.0]      // amount to translate
        );
        // tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        this.bindVertexPosition(this.programInfo, this.buffers);
        // tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        this.bindVertexColor(this.programInfo, this.buffers);
        // tell WebGL to use our program when drawing
        this.gl.useProgram(this.programInfo.program);
        // set the shader uniforms
        this.gl.uniformMatrix4fv(
          this.programInfo.uniformLocations.projectionMatrix,
          false,
          this.projectionMatrix
        );
        this.gl.uniformMatrix4fv(
          this.programInfo.uniformLocations.modelViewMatrix,
          false,
          this.modelViewMatrix
        );
    }

    updateViewport() {
        if (this.gl) {
          this.gl.viewport(
            0,
            0,
            this.gl.drawingBufferWidth,
            this.gl.drawingBufferHeight
          );
          this.initialiseWebGLCanvas();
        } 
        else {
          alert(
            'Error! WebGL has not been initialised! Ignoring updateViewport() call...'
          );
        }
    }
    

}