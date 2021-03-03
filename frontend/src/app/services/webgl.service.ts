import { Injectable } from '@angular/core';
import { GLSLConstants } from '../../assets/GLSLConstants';
import fragmentShaderSrc from '../../assets/toucan-fragment-shader.glsl';
import vertexShaderSrc from '../../assets/toucan-vertex-shader.glsl';
import * as matrix from 'gl-matrix';
import { TNode } from '../motorEngine/TNode';
import { TEntity } from '../motorEngine/TEntity';
import { RMalla } from '../motorEngine/TRecurso';

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

  private then = 0;

  constructor() {}

  //Inicializamos el canvas HTML con el context 
  initialiseWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
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
    this.buffers = this.initialiseBuffers();

    // Prepramos la escena para dibujar el contenido
    this.prepareScene();

    return this.gl
  }

  /**
   * [initializeShaders] provides the functions necessary for loading,
   * compiling and attaching vertex and fragment shaders into a shader program.
   */
  initializeShaders(): WebGLProgram {
    // 1. Create the shader program
    let shaderProgram = this.gl.createProgram();

    // 2. compile the shaders
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

    // 3. attach the shaders to the shader program using our WebGLContext
    if (compiledShaders && compiledShaders.length > 0) {
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

  /**
   * Initialises the WebGL canvas so it is ready for rendering.
   */
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

  /**
   * Prepare's the WebGL context to render content.
   */
  prepareScene() {
    this.resizeWebGLCanvas();
    this.updateWebGLCanvas();

    //Preparamos la animación de rotación
    //transformaciones
    //matrix.mat4.perspective(this.modelViewMatrix, this.fieldOfView, this.aspect, this.zNear, this.zFar);
    matrix.mat4.translate(this.modelViewMatrix,     // destination matrix
      this.modelViewMatrix,     // matrix to translate
      [-0.0, 0.0, -6.0]);  // amount to translate
    matrix.mat4.rotate(this.modelViewMatrix,  // destination matrix
      this.modelViewMatrix,  // matrix to rotate
      this.cubeRotation,     // amount to rotate in radians
      [0, 0, 1]);       // axis to rotate around (Z)
    matrix.mat4.rotate(this.modelViewMatrix,  // destination matrix
      this.modelViewMatrix,  // matrix to rotate
      this.cubeRotation * .7,// amount to rotate in radians
      [0, 1, 0]);       // axis to rotate around (X)


    // tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    this.bindVertexPosition(this.programInfo, this.buffers);

    // tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    this.bindVertexColor(this.programInfo, this.buffers);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

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

    this.cubeRotation = this.cubeRotation + 0.01;
  }

  /**
   * Resize the WebGL canvas based on the canvas's clientWidth and clientHeight.
   */
  resizeWebGLCanvas() {
    const width = this.clientCanvas.clientWidth;
    const height = this.clientCanvas.clientHeight;
    if (this.gl.canvas.width !== width || this.gl.canvas.height !== height) {
      this.gl.canvas.width = width;
      this.gl.canvas.height = height;
    }
  }

  /**
   * Sets the {@link WebGLRenderingContext} canvas width and height based on the {@link HTMLCanvasElement} provided.
z`   *
   * @param canvas - the {@link HTMLCanvasElement}
   */
  setWebGLCanvasDimensions(canvas: HTMLCanvasElement) {
    // set width and height based on canvas width and height - good practice to use clientWidth and clientHeight
    this.gl.canvas.width = canvas.clientWidth;
    this.gl.canvas.height = canvas.clientHeight;
  }

  /**
   * Update the WebGL Viewport if we have a valid rendering context.
   */
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

  /**
   * Update the WebGL canvas and configure the perspective matrix 
   * for our viewpoint and origin before rending.
   */
  updateWebGLCanvas() {
    this.initialiseWebGLCanvas();
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    this.gl.clearDepth(1.0);                 // Clear everything
    this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
    this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Our field of view is 45 degrees, with a width/height ratio of 640:480. 
    // We only want to see objects  between 0.1 units and 100 units away from the camera. 
    // The perspective projection matrix is a special matrix that is used to simulate the 
    // distortion of perspective in a camera.
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
    this.setModelViewAsIdentity();
  }

  /**
   * Tell WebGL how to pull out the colors from the color buffer
   * into the vertexColor attribute.
   */
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

  /**
   * Tell WebGL how to pull out the positions from the position
   * buffer into the vertexPosition attribute
   */
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

  /**
   * Checks the compiled shader and determines if its valid.
   * If it isn't, its deleted from the GL context to prevent integrity issues.
   * 
   * @param compiledShader
   * returns true if valid, false otherwise
   */
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

  /**
   * Determines the shader type and returns the result.
   * @param shaderMimeType
   * @returns -1 if the shader type could not be identified.
   */
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
  
  private initialiseBuffers(): any {
    const cubo = new RMalla();
    cubo.cargarRMalla("../../assets/cubo.json");
    
    const positionBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    const positions = new Float32Array([
       // Cara delantera
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

      // Cara trasera
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

      // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

      // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

      // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

      // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ]);

    // set the list of positions into WebGL to build the
    // shape by passing it into bufferData.
    // We tell WebGL that the data supplied is an ARRAY and
    // to handle the data as a statically drawn shape.
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      positions,
      this.gl.STATIC_DRAW
    );

    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    var cubeVertexIndices = new Uint16Array([
      0,  1,  2,      0,  2,  3,    // enfrente
      4,  5,  6,      4,  6,  7,    // atrás
      8,  9,  10,     8,  10, 11,   // arriba
      12, 13, 14,     12, 14, 15,   // fondo
      16, 17, 18,     16, 18, 19,   // derecha
      20, 21, 22,     20, 22, 23    // izquierda
    ]);
    
    // Ahora enviamos el elemento arreglo a  GL
    
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(cubeVertexIndices), this.gl.STATIC_DRAW);


    // Set up the colors for the vertices
    const faceColors = [
      [1.0,  1.0,  1.0,  1.0],    // Front face: white
      [1.0,  0.0,  0.0,  1.0],    // Back face: red
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
      [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    ];
  
    // Convert the array of colors into a table for all the vertices.
  
    var colors = [];
  
    for (var j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];
  
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

  /**
   * Loads a shader by source code and type supplied.
   * @param shaderSource
   * @param shaderType
   */
  private loadShader(shaderSource: string, shaderType: string): WebGLShader {
    const shaderTypeAsNumber = this.determineShaderType(shaderType);
    if (shaderTypeAsNumber < 0) {
      return null;
    }
    // Create the gl shader
    const glShader: WebGLShader = this.gl.createShader(shaderTypeAsNumber);

    // Load the source into the shader
    this.gl.shaderSource(glShader, shaderSource);

    // Compile the shaders
    this.gl.compileShader(glShader);

    // Check the compile status
    const compiledShader: WebGLShader = this.gl.getShaderParameter(
      glShader,
      this.gl.COMPILE_STATUS
    );
    return this.checkCompiledShader(compiledShader) ? glShader : null;
  }

  /**
   * Loads the {@link modelViewMatrix} as an identity matrix.
   */
  private setModelViewAsIdentity() {
    this.modelViewMatrix = matrix.mat4.create();
  }
}
