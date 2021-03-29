import { Injectable } from '@angular/core';
import { GLSLConstants } from '../../assets/GLSLConstants';
import fragmentShaderSrc from '../motorEngine/shaders/toucan-fragment-shader.glsl';
import vertexShaderSrc from '../motorEngine/shaders/toucan-vertex-shader.glsl';
import * as matrix from 'gl-matrix';
import { TRecurso } from '../motorEngine/commons';
import { TMotorTAG } from '../motorEngine/TMotorTAG';



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
  
  //Variables proyección
  private fieldOfView = (45 * Math.PI) / 180; // radianes
  private aspect = 1;
  private zNear = 0.1;
  private zFar = 100;

  //Variables mouseevent proyección
  private lastX = 0
  private lastY = 0;
  private dMouseX = 0
  private dMouseY = 0;
  private trackingMouseMotion = false;
  private rotX = 0
  private rotY = 0
  private rotZ = 0
  private trasX = 0
  private trasY = 0
  private trasZ = 0;

  //Matrices
  private projectionMatrix = matrix.mat4.create();
  private modelViewMatrix = matrix.mat4.create();

  //Buffers y shaders
  private buffers: any
  private buffers2: any
  private programInfo: any

  private cubeRotation = 0.0;

  //Variables árbol de la escena
  private miMotor;

  constructor() {}

  async initialiseWebGLContext(canvas: HTMLCanvasElement){

    //Creando nodos del árbol de la escena
    this.miMotor = new TMotorTAG();
    this.miMotor.crearLuz(null, null, null, null, null, null, null, null, null, null, null);
    this.miMotor.crearCamara(null, null, null, null, null, null, null, null, null, null);

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
    await this.initialiseBuffers("avatar2.json").then(buffers => {this.buffers = buffers; });

    await this.initialiseBuffers("pantalon.json").then(buffers => {this.buffers2 = buffers; });

    
    this.gl.useProgram(this.programInfo.program);

    

    return this.gl
  }

  initializeShaders(): WebGLProgram {
    let shaderProgram = this.gl.createProgram();

    console.log(fragmentShaderSrc);

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
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  }

  prepareScene() {
    this.resizeWebGLCanvas();
    this.updateWebGLCanvas();

    //Preparamos la animación de rotación
    //transformaciones
    matrix.mat4.translate(this.modelViewMatrix,    
      this.modelViewMatrix,    
      [0.0, -2.5, -5.0]); 
    matrix.mat4.rotateY(this.modelViewMatrix, 
      this.modelViewMatrix,  
      this.rotY);
    
    
     
    //Cámara 
    var numFs = 5;
    var radius = 200;
    var angulo;
    
    // Compute a matrix for the camera
    var cameraMatrix = matrix.mat4.create();
    //console.log(cameraMatrix);

    var cameraTarget = matrix.vec3.create();
    //Mira a las transformaciones de traslación del modelo, enfocando asi al avatar bien (o eso creo)
    cameraTarget = [this.modelViewMatrix[12], this.modelViewMatrix[13], this.modelViewMatrix[14]];
    cameraTarget = [0,0,0];
    var cameraPosition = matrix.vec3.create();
    //De momento la cámara está en el centro, pero se tendrá que mover para una mejor vista
    cameraPosition = [0, 0, -10];
    var up = matrix.vec3.create();
    up = [0, 1, 0];

    // Compute the camera's matrix using look at.
    matrix.mat4.lookAt(cameraMatrix, cameraPosition, cameraTarget, up);

    var viewMatrix = matrix.mat4.create();
    matrix.mat4.invert(viewMatrix, cameraMatrix);
    var viewProjectionMatrix = matrix.mat4.create();
    matrix.mat4.multiply(viewProjectionMatrix, this.projectionMatrix, viewMatrix)
    
        

      
    const normalMatrix = matrix.mat4.create();
    matrix.mat4.invert(normalMatrix, this.modelViewMatrix);
    matrix.mat4.transpose(normalMatrix, normalMatrix);

    var texture = this.loadTexture(0); //aqui fichero dentro

    // Tell WebGL we want to affect texture unit 0
    this.gl.activeTexture(this.gl.TEXTURE0);

    // Bind the texture to texture unit 0
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    

    // Tell the shader we bound the texture to texture unit 0
    this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

    this.bindVertexPosition(this.programInfo, this.buffers);

    this.bindVertexTextures(this.programInfo, this.buffers);

    this.bindVertexNormal(this.programInfo, this.buffers);


    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);


    // set the shader uniforms
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.projectionMatrix,
      false,
      //projectionMatrix
      viewProjectionMatrix
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

    // Dibujar camiseta
    var vertexCount = 69855;
    const type = this.gl.UNSIGNED_SHORT;
    const offset = 0;
    this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
    //
    //
    //
    //

    /*var texture = this.loadTexture(2);

    // Tell WebGL we want to affect texture unit 0
    this.gl.activeTexture(this.gl.TEXTURE1);

    // Bind the texture to texture unit 0
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Tell the shader we bound the texture to texture unit 0
    this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 1);

    this.bindVertexPosition(this.programInfo, this.buffers2);

    this.bindVertexTextures(this.programInfo, this.buffers2);

    this.bindVertexNormal(this.programInfo, this.buffers2);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers2.indices);

    matrix.mat4.translate(this.modelViewMatrix,    
      this.modelViewMatrix,    
      [2.0, 0.0, 0.0]); 
    matrix.mat4.rotate(this.modelViewMatrix, 
      this.modelViewMatrix,  
      -5,
      [1, 0, 0]);
    
    // Dibujar pantalon
    vertexCount = 1567;
    this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
    */

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
    this.gl.canvas.width = window.outerWidth;
    this.gl.canvas.height = window.outerHeight;
    
  }

  updateMouseevent(rotZ) {
    
    //this.trasX = rotZ;
    //this.trasY = rotZ;
    this.rotY = rotZ;
    //this.rotY = rotZ * Math.PI / 180;

  }

  updateViewport(){
    //Update del viewport para que se vea bien lol
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

  updateWebGLCanvas() {
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
    this.modelViewMatrix = matrix.mat4.create();

    //Transformaciones de la projection matrix para mover con el ratón
    /*matrix.mat4.translate(this.projectionMatrix, this.projectionMatrix, [this.trasX, 0, 0]);
    matrix.mat4.translate(this.projectionMatrix, this.projectionMatrix, [0, this.trasY, 0]);
    matrix.mat4.translate(this.projectionMatrix, this.projectionMatrix, [0, 0, this.rotY]);
    matrix.mat4.rotateX(this.projectionMatrix, this.projectionMatrix, this.rotX);
    matrix.mat4.rotateY(this.projectionMatrix, this.projectionMatrix, this.rotY);
    matrix.mat4.rotateZ(this.projectionMatrix, this.projectionMatrix, this.rotZ);
    */
    
    
    
  }


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

  
  
  async initialiseBuffers(fichero) {
    var malla = await this.miMotor.crearModelo(null, null, null, null, fichero); 
    malla = malla.getEntidad().getMalla();
    console.log(this.miMotor);
    const positionBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(malla.getVertices()),
      this.gl.STATIC_DRAW
    );


    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(malla.getIndices()), this.gl.STATIC_DRAW);

    const textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(malla.getCoordtex()),
                this.gl.STATIC_DRAW);

    const normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(malla.getNormales()),this.gl.STATIC_DRAW);
    
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

  private loadTexture(num) {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = this.gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = this.gl.RGBA;
    const srcType = this.gl.UNSIGNED_BYTE;
    if(num == 2)
      var pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    else
      var pixel = new Uint8Array([0, 126, 126, 255]);
    this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);
                  

    /*var malla = await this.miMotor.crearModelo(null, null, null, null, fichero); 
    
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
    };
    */
    

    return texture;
  }

  
}
