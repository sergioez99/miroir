import { Injectable } from '@angular/core';
import { GLSLConstants } from '../../assets/GLSLConstants';
import fragmentShaderSrc from '../../assets/toucan-fragment-shader.glsl';
import vertexShaderSrc from '../../assets/toucan-vertex-shader.glsl';
import * as matrix from 'gl-matrix';
import { TNode } from '../motorEngine/TNode';
import { TEntity } from '../motorEngine/TEntity';
import { RMalla } from '../motorEngine/TRecurso';
import { ECamera, ELight } from 'src/app/motorEngine/TEntity';


@Injectable({
  providedIn: 'root',
})

export class WebGLService {

  //Contexto del canvas
  private renderingContext: RenderingContext;

  private get gl(): WebGLRenderingContext {
    return this.renderingContext as WebGLRenderingContext;
  }

  private get clientCanvas(): Element {
    return this.gl.canvas as Element
  }
  

  private fieldOfView = (45 * Math.PI) / 180; // radianes
  private aspect = 1;
  private zNear = 0.1;
  private zFar = 100.0;
  private projectionMatrix = matrix.mat4.create();
  private modelViewMatrix = matrix.mat4.create();
  private buffers: any
  private programInfo: any

  private cubeRotation = 0.0;

  //Variables árbol de la escena
  private miNodo;
  private miLuz;
  private miCamara;

  private then = 0;

  constructor() {}

  async initialiseWebGLContext(canvas: HTMLCanvasElement){

    // Iniciacializamos el contexto
    this.renderingContext =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

    this.setWebGLCanvasDimensions(canvas);

    this.initialiseWebGLCanvas();

    // Inicializamos los shaders
    let shaderProgram = this.initializeShaders();

    // Preparamos la información que le vamos a pasar a los buffers de los shaders
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
    // Inicializamos los buffers con lo que queremos dibujar
    await this.initialiseBuffers().then(buffers => {this.buffers = buffers; console.log(buffers)});
    console.log(this.buffers);

    // Prepramos la escena para dibujar el contenido
    this.prepareScene();

    return this.gl
  }

  initializeShaders(): WebGLProgram {
    let shaderProgram = this.gl.createProgram();

    const compiledShaders = [];
    let fragmentShader = this.loadShader(
      fragmentShaderSrc,
      GLSLConstants.fragmentShaderMimeType
    );
    let vertexShader = this.loadShader(
      vertexShaderSrc,
      GLSLConstants.vertexShaderMimeType
    );
    compiledShaders.push(fragmentShader);
    compiledShaders.push(vertexShader);

    if (compiledShaders && compiledShaders.length > 0) {
      for (let i = 0; i < compiledShaders.length; i++) {
        const compiledShader = compiledShaders[i];
        if (compiledShader) {
          this.gl.attachShader(shaderProgram, compiledShader);
        }
      }
    }

    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.log(
        'Unable to initialize the shader program: ' +
          this.gl.getProgramInfoLog(shaderProgram)
      );
    }

    return shaderProgram;
  }


  initialiseWebGLCanvas() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    //Creando nodos del árbol de la escena
    this.miNodo = new TNode(null, null, null, null, null, null, null, null, null);
    this.miLuz = new ELight(null,null,null,null,null,null, null);
    this.miCamara = new ECamera(null,null,null,null,null,null,null);
  }

  prepareScene() {
    this.resizeWebGLCanvas();
    this.updateWebGLCanvas();

    //Preparamos la animación de rotación
    //transformaciones
    matrix.mat4.translate(this.modelViewMatrix,    
      this.modelViewMatrix,    
      [-0.0, 0.0, -6.0]); 
    matrix.mat4.rotate(this.modelViewMatrix,  
      this.modelViewMatrix,  
      this.cubeRotation,    
      [0, 0, 1]);      
    matrix.mat4.rotate(this.modelViewMatrix, 
      this.modelViewMatrix,  
      this.cubeRotation * .7,
      [0, 1, 0]);      

    this.bindVertexPosition(this.programInfo, this.buffers);

    this.bindVertexColor(this.programInfo, this.buffers);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

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

    this.cubeRotation = this.cubeRotation + 0.01;
  }

  resizeWebGLCanvas() {
    const width = this.clientCanvas.clientWidth;
    const height = this.clientCanvas.clientHeight;
    if (this.gl.canvas.width !== width || this.gl.canvas.height !== height) {
      this.gl.canvas.width = width;
      this.gl.canvas.height = height;
    }
  }

  setWebGLCanvasDimensions(canvas: HTMLCanvasElement) {
    this.gl.canvas.width = canvas.clientWidth;
    this.gl.canvas.height = canvas.clientHeight;
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
    } else {
      alert(
        'Error! WebGL has not been initialised! Ignoring updateViewport() call...'
      );
    }
  }

  updateWebGLCanvas() {
    this.initialiseWebGLCanvas();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.aspect = this.clientCanvas.clientWidth / this.clientCanvas.clientHeight;
    this.projectionMatrix = matrix.mat4.create();
    matrix.mat4.perspective(
      this.projectionMatrix,
      this.fieldOfView,
      this.aspect,
      this.zNear,
      this.zFar
    );

    this.setModelViewAsIdentity();
  }

  private bindVertexColor(programInfo: any, buffers: any) {
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

  private bindVertexPosition(programInfo: any, buffers: any) {
    const bufferSize = 3;
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

  private checkCompiledShader(compiledShader: WebGLShader): boolean {
    if (!compiledShader) {
      // shader failed to compile, get the last error
      const lastError = this.gl.getShaderInfoLog(compiledShader);
      console.log("couldn't compile the shader due to: " + lastError);
      this.gl.deleteShader(compiledShader);
      return false;
    }
    return true;
  }

  private determineShaderType(shaderMimeType: string): number {
    if (shaderMimeType) {
      if (shaderMimeType === GLSLConstants.vertexShaderMimeType) {
        return this.gl.VERTEX_SHADER;
      } else if (shaderMimeType === GLSLConstants.fragmentShaderMimeType) {
        return this.gl.FRAGMENT_SHADER;
      } else {
        console.log('Error: could not determine the shader type');
      }
    }
    return -1;
  }

  
  
  async initialiseBuffers() {
    const cubo = new RMalla();

    var mallas = await cubo.getMallas();

    const positionBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    console.log(mallas);
    console.log(mallas[0]);
    console.log(mallas[0].getVertices());

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(mallas[0].getVertices()),
      this.gl.STATIC_DRAW
    );

    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(mallas[0].getIndices()), this.gl.STATIC_DRAW);

    var colors = [];
  
    for (var j = 0; j < mallas[0].getNormales().length; ++j) {
      const c = mallas[0].getNormales()[j];
  
      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c, c);
    }
  
    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    
    return {
      position: positionBuffer,
      color: colorBuffer,
      indices: indexBuffer,
    };
  }

  private loadShader(shaderSource: string, shaderType: string): WebGLShader {
    const shaderTypeAsNumber = this.determineShaderType(shaderType);
    if (shaderTypeAsNumber < 0) {
      return null;
    }
    
    const glShader: WebGLShader = this.gl.createShader(shaderTypeAsNumber);

   
    this.gl.shaderSource(glShader, shaderSource);

    
    this.gl.compileShader(glShader);

   
    const compiledShader: WebGLShader = this.gl.getShaderParameter(
      glShader,
      this.gl.COMPILE_STATUS
    );
    return this.checkCompiledShader(compiledShader) ? glShader : null;
  }

  private setModelViewAsIdentity() {
    this.modelViewMatrix = matrix.mat4.create();
  }
}
