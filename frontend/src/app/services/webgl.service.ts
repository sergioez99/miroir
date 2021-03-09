import { Injectable } from '@angular/core';
import { GLSLConstants } from '../../assets/GLSLConstants';
import fragmentShaderSrc from '../../assets/toucan-fragment-shader.glsl';
import vertexShaderSrc from '../../assets/toucan-vertex-shader.glsl';
import * as matrix from 'gl-matrix';
import { TNode } from '../motorEngine/TNode';
import { TEntity } from '../motorEngine/TEntity';
import { RMalla, RTextura } from '../motorEngine/TRecurso';
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
  private Mallas;
  private Textura;

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
        vertexNormal: this.gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
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
        normalMatrix: this.gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
        uSampler: this.gl.getUniformLocation(shaderProgram, 'uSampler'),
      },
    };
    // Inicializamos los buffers con lo que queremos dibujar
    await this.initialiseBuffers().then(buffers => {this.buffers = buffers; console.log(buffers)});
    console.log(this.buffers);

    const texture = this.loadTexture();
    console.log(texture);

    // Tell WebGL we want to affect texture unit 0
    this.gl.activeTexture(this.gl.TEXTURE0);

    // Bind the texture to texture unit 0
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.useProgram(this.programInfo.program);

    // Tell the shader we bound the texture to texture unit 0
    this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

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
    this.Mallas = new RMalla();
    this.Textura = new RTextura();

    this.miNodo.addChild(this.miLuz);
    this.miNodo.addChild(this.miCamara);
    this.miNodo.addChild(this.Mallas);

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

      
    const normalMatrix = matrix.mat4.create();
    matrix.mat4.invert(normalMatrix, this.modelViewMatrix);
    matrix.mat4.transpose(normalMatrix, normalMatrix);

    this.bindVertexPosition(this.programInfo, this.buffers);

    this.bindVertexTextures(this.programInfo, this.buffers);

    this.bindVertexNormal(this.programInfo, this.buffers);


    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

    

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
   this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix);

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

  /*
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
  */

  private bindVertexTextures(programInfo: any, buffers: any) {
    const num = 2; // every coordinate composed of 2 values
    const type = this.gl.FLOAT; // the data in the buffer is 32 bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.textureCoord);
    this.gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
    this.gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  }

  private bindVertexNormal(programInfo: any, buffers:any){
      const numComponents = 3;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.normal);
      this.gl.vertexAttribPointer(
          programInfo.attribLocations.vertexNormal,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      this.gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexNormal);
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
    var mallas = await this.Mallas.getMallas();

    console.log(this.Mallas);

    const positionBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(mallas[0].getVertices()),
      this.gl.STATIC_DRAW
    );

    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(mallas[0].getIndices()), this.gl.STATIC_DRAW);

    /*var colors = [];
  
    for (var j = 0; j < mallas[0].getCoordtex().length; ++j) {
      const c = mallas[0].getCoordtex()[j];
  
      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c, c);
    }
  
    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    */
    const textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(mallas[0].getCoordtex()),
                this.gl.STATIC_DRAW);

    const normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(mallas[0].getNormales()),this.gl.STATIC_DRAW);
    
    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
      normal: normalBuffer,
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

  private isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

  private setModelViewAsIdentity() {
    this.modelViewMatrix = matrix.mat4.create();
  }
  private loadTexture() {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = this.gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = this.gl.RGBA;
    const srcType = this.gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);
                  

    const mallas = this.Mallas.getMallas2();
    var image = mallas[1].getTexturas();
    console.log(image)
    image.onload = () => {
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
                    srcFormat, srcType, image);
      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      }
      /*
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      */
    };
    

    return texture;
  }

  
}
