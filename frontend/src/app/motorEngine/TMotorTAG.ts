import { TNode } from "./TNode";
import { gestorRecursos } from "./gestorRecursos";
import { ECamera, ELight, EModel } from "./TEntity";


//Imports de GL, motor gráfico y tal
import { GLSLConstants } from '../../assets/GLSLConstants';
import fragmentShaderSrc from '../motorEngine/shaders/fragment-shader-final.glsl';
import vertexShaderSrc from '../motorEngine/shaders/vertex-shader-final.glsl';
import * as matrix from 'gl-matrix';


export class TMotorTAG {

  private raiz: TNode;
  private gestorRecursos: gestorRecursos;

  private registroCamaras: TNode[];
  private registroLuces: TNode[];
  private registroViewports: number[][];
  private camaraActiva: number;
  private viewportActivo: number;
  private lucesActivas: boolean[];

  //Contexto del canvas
  private renderingContext: RenderingContext;
  private get gl(): WebGLRenderingContext {
    return this.renderingContext as WebGLRenderingContext;
  }
  private get clientCanvas(): Element {
    return this.gl.canvas as Element
  }

  //letiables proyección
  private fieldOfView = (45 * Math.PI) / 180; // radianes
  private aspect = 1;
  private zNear = 0.1;
  private zFar = 500;

  //Matrices
  private projectionMatrix = matrix.mat4.create();
  private modelViewMatrix = matrix.mat4.create();

  //Buffers y shaders
  private buffers: any
  private buffers2: any
  private programInfo: any

  private rotY = 0;
  private zoom = 1;
  private vertexCount;
  private vertexCount2;
  private malla;
  private modelos


  constructor() {
    this.raiz = new TNode(null, null, null, null, null, null, null);
    this.gestorRecursos = new gestorRecursos();
    this.registroCamaras = [];
    this.registroLuces = [];
    this.lucesActivas = [];
    this.registroViewports = [[]]
    this.modelos = 0;
  }

  crearNodo(padre: TNode, trasl: matrix.vec3, rot: matrix.vec3, esc: matrix.vec3) {
    if (padre == null)
      padre = this.raiz;

    let nuevo = new TNode(matrix.mat4.create(), padre, null, null, trasl, rot, esc);

    nuevo.changeActuMatriz();
    padre.addChild(nuevo);

    return nuevo;
  }
  crearCamara(padre: TNode, trasl: matrix.vec3, rot: matrix.vec3, esc: matrix.vec3, esPerspectiva, cercano, lejano, derecha, izquierda, superior, inferior) {
    if (padre == null)
      padre = this.raiz;

    let nuevo = new TNode(matrix.mat4.create(), padre, null, null, trasl, rot, esc);

    nuevo.changeActuMatriz();
    padre.addChild(nuevo);

    let entidad = new ECamera(esPerspectiva, cercano, lejano, derecha, izquierda, superior, inferior);

    nuevo.setentidad(entidad);

    return nuevo;
  }
  crearLuz(padre: TNode, trasl: matrix.vec3, rot: matrix.vec3, esc: matrix.vec3, tipo, intensidad, apertura, atenAngular, atenCte, atenLineal, atenCuadrat) {
    if (padre == null)
      padre = this.raiz;
    let nuevo = new TNode(matrix.mat4.create(), padre, null, null, trasl, rot, esc);
    nuevo.changeActuMatriz();
    padre.addChild(nuevo);

    let entidad = new ELight(tipo, intensidad, apertura, atenAngular, atenCte, atenLineal, atenCuadrat);

    nuevo.setentidad(entidad);

    return nuevo;

  }
  async crearModelo(padre: TNode, trasl: matrix.vec3, rot: matrix.vec3, esc: matrix.vec3, prenda, ticket, tipo) {
    if (padre == null)
      padre = this.raiz;
    let nuevo = new TNode(matrix.mat4.create(), padre, null, null, trasl, rot, esc);
    nuevo.changeActuMatriz();
    padre.addChild(nuevo);

    let malla = await this.gestorRecursos.getRecurso(prenda, ticket, tipo);

    let text = await this.gestorRecursos.getRecurso(malla.getTexturas()[0], ticket, "textura");

    let texture = await this.loadTexture(text);

    let entidad = new EModel();
    entidad.setMalla(malla);

    nuevo.setentidad(entidad);
    return nuevo;
  }

  dibujarEscena() {
    this.resizeWebGLCanvas();
    this.updateWebGLCanvas();

    // LUCES

    this.gl.uniform3fv(this.programInfo.uniformLocations.lightPosition, [-50,-10,-50]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightAmbiental, [0.3,0.3,0.3]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightDiffuse,  [0.8,0.8,0.8]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightSpecular,  [0.2,0.2,0.2]);
    /* this.gl.uniform3fv(this.programInfo.uniformLocations.lightAmbiental, [0.0,0.0,0.0]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightDiffuse,  [0.0,0.0,0.0]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightSpecular,  [0.0,0.0,0.0]); */

    this.gl.uniform3fv(this.programInfo.uniformLocations.lightPosition2, [50,-10,-50]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightAmbiental2, [0.2,0.2,0.2]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightDiffuse2,  [0.5,0.5,0.5]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightSpecular2,  [0.2,0.2,0.2]);

    /*for (let i = 0; i < this.registroLuces.length; i++) {
        if (this.lucesActivas[i] == true) {
            let matrizLuz = this.registroLuces[i].getTransformMatrix();
            //Decirle a gl que use las luces (buscar)
        }
    }
    */

    //CÁMARA

    let cameraMatrix = this.registroCamaras[this.camaraActiva].getTransformMatrix();
    let cameraTarget = matrix.vec3.create();
    //cameraTarget = [this.modelViewMatrix[12], this.modelViewMatrix[13], this.modelViewMatrix[14]];
    cameraTarget = [0, 0, 0];
    let cameraPosition = matrix.vec3.create();
    cameraPosition = [0, 0, -12];
    let up = matrix.vec3.create();
    up = [0, 1, 0];

    matrix.mat4.lookAt(cameraMatrix, cameraPosition, cameraTarget, up);

    let viewMatrix = matrix.mat4.create();
    matrix.mat4.invert(viewMatrix, cameraMatrix);
    let viewProjectionMatrix = matrix.mat4.create();
    matrix.mat4.multiply(viewProjectionMatrix, this.projectionMatrix, viewMatrix);

    matrix.mat4.scale(viewProjectionMatrix, viewProjectionMatrix, [this.zoom, this.zoom, this.zoom])

    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, viewProjectionMatrix);

    let normalMatrix = matrix.mat4.create();
    matrix.mat4.invert(normalMatrix, this.modelViewMatrix);
    matrix.mat4.transpose(normalMatrix, normalMatrix);

    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.normalMatrix, false, normalMatrix);


    // VIEWPORT
    this.updateViewport();


    // DIBUJAR MODELOS
    //devuelvo las mallas que me he guardado en el gestor de recursos
    let RMalla = this.gestorRecursos.dibujarMallas();

    let mallas = RMalla.getMallas();

    for(let i in mallas){
        let vertexCount = mallas[i].getIndices().length;
        switch(i){
            case '0': //Avatar
            matrix.mat4.translate(this.modelViewMatrix,
                this.modelViewMatrix,
                [0,-3,0])
            matrix.mat4.rotateY(this.modelViewMatrix,
                this.modelViewMatrix,
                180 * Math.PI / 180)
            matrix.mat4.rotateX(this.modelViewMatrix,
                this.modelViewMatrix,
                90 * Math.PI / 180)
    
    
            matrix.mat4.rotateZ(this.modelViewMatrix,
                this.modelViewMatrix,
                this.rotY)
                
            //Puedo cambiar los buffers a array también    

            this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

            this.bindVertexPosition(this.programInfo, this.buffers);
    
            this.bindVertexTextures(this.programInfo, this.buffers);
    
            this.bindVertexNormal(this.programInfo, this.buffers);
    
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

            break;

            case '1': //Prenda 1
            //para la camiseta y el pantalon
            matrix.mat4.scale(this.modelViewMatrix,
                this.modelViewMatrix,
                [0.0328,0.0328,0.0328])


            //para la falda
            /*matrix.mat4.translate(this.modelViewMatrix,
              this.modelViewMatrix,
              [0,-0.033,-1.37])*/
                  

            this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 1);

            this.bindVertexPosition(this.programInfo, this.buffers2);
    
            this.bindVertexTextures(this.programInfo, this.buffers2);
    
            this.bindVertexNormal(this.programInfo, this.buffers2);
    
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers2.indices);

            break;
        }
        this.gl.uniform3fv(this.programInfo.uniformLocations.matDiffuse, mallas[i].getDiffuse());
        this.gl.uniform3fv(this.programInfo.uniformLocations.matSpecular, mallas[i].getSpecular());
        this.gl.uniform1f(this.programInfo.uniformLocations.matShininess, mallas[i].getGlossiness());

        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
        
        this.gl.drawElements(this.gl.TRIANGLES, vertexCount, this.gl.UNSIGNED_SHORT, 0);
    }
}

  // ---------------- Inicializar el contexto de GL y los shaders ----------------
  iniciarGL(canvas: HTMLCanvasElement) {
    // Iniciacializamos el contexto
    this.renderingContext =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

    //Dimensiones del canvas
    this.gl.canvas.width = 650;
    this.gl.canvas.height = 650;

    //Fondo en blanco y propiedades
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Inicializamos los shaders
    let shaderProgram = this.initializeShaders();

    // Preparamos la información que le vamos a pasar a los buffers de los shaders
    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexNormal: this.gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        normalMatrix: this.gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
        uSampler: this.gl.getUniformLocation(shaderProgram, 'uSampler'),
        matDiffuse: this.gl.getUniformLocation(shaderProgram, 'Material.Diffuse'),
        matSpecular: this.gl.getUniformLocation(shaderProgram, 'Material.Specular'),
        matShininess: this.gl.getUniformLocation(shaderProgram, 'Material.Shininess'),
        lightPosition: this.gl.getUniformLocation(shaderProgram, 'Light.Position'),
        lightAmbiental: this.gl.getUniformLocation(shaderProgram, 'Light.Ambient'),
        lightDiffuse: this.gl.getUniformLocation(shaderProgram, 'Light.Diffuse'),
        lightSpecular: this.gl.getUniformLocation(shaderProgram, 'Light.Specular'),
        lightPosition2: this.gl.getUniformLocation(shaderProgram, 'Light2.Position'),
        lightAmbiental2: this.gl.getUniformLocation(shaderProgram, 'Light2.Ambient'),
        lightDiffuse2: this.gl.getUniformLocation(shaderProgram, 'Light2.Diffuse'),
        lightSpecular2: this.gl.getUniformLocation(shaderProgram, 'Light2.Specular'),
      },
    };

    this.gl.useProgram(this.programInfo.program);

    return this.gl;
  }

  //Programa de inicialización de shaders
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

  // --------------------- Iniciar el probador -----------------------
  async iniciarProbador(ticket, avatar,  prenda) {
    //Creamos la cámara, la luz y el viewport del probador
    let luz = this.crearLuz(null, null, null, null, null, null, null, null, null, null, null); //Todavia no sé sos
    this.registrarLuz(luz);
    this.setLuzActiva(0, true);

    let camara = this.crearCamara(null, null, null, null, true, 0.1, 500, null, null, 1, null);
    this.registrarCamara(camara);
    this.setCamaraActiva(0);

    this.registrarViewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, 0);
    this.setViewportActivo(0);

    let avatarNodo = await this.crearModelo(null, null, null, null, avatar, ticket, "avatar");
    await this.initialiseBuffers( avatarNodo.getEntidad().getMalla() ).then(buffers => { this.buffers = buffers; });
    let modeloNodo = await this.crearModelo(null, null, null, null, prenda, ticket, "prenda");
    await this.initialiseBuffers( modeloNodo.getEntidad().getMalla() ).then(buffers => {this.buffers2 = buffers; });
    }

    async initialiseBuffers(malla) {
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

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(malla.getNormales()), this.gl.STATIC_DRAW);

    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
      normal: normalBuffer,
    };
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

  private bindVertexNormal(programInfo: any, buffers: any) {
    const numComponents = 3;
    const type = this.gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.normal);
    this.gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, numComponents, type, normalize, stride, offset);
    this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
  }

  private bindVertexPosition(programInfo: any, buffers: any) {
    const bufferSize = 3;
    const type = this.gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
    this.gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, bufferSize, type, normalize, stride, offset);
    this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }


  // ----------------- Dibujado TEMPORAL ----------------
  updateMouseevent(rotZ) {
    this.rotY = rotZ;
  }

  updateZoom(zoom) {
    this.zoom = zoom;
  }

  // ---------------- Texturas y cosas ------------------------------------
  private isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

  async loadTexture(image) {
    const texture = this.gl.createTexture();
        if(this.modelos == 0)
            this.gl.activeTexture(this.gl.TEXTURE0);
        else
            this.gl.activeTexture(this.gl.TEXTURE1);
        this.modelos++;
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        
        const level = 0;
        const internalFormat = this.gl.RGBA;
        const srcFormat = this.gl.RGBA;
        const srcType = this.gl.UNSIGNED_BYTE;

      
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);
        


        if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        } else {
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR);
        }
        return texture;
  };



  // -----------------  Setters y registros de cámara, viewport y luces -------------
  registrarCamara(cam: TNode) {
    this.registroCamaras.push(cam);
  }
  setCamaraActiva(nCamara: number) {
    this.camaraActiva = nCamara;
  }

  registrarLuz(luz: TNode) {
    this.registroLuces.push(luz);
  }
  setLuzActiva(nLuz: number, activa: boolean) {
    this.lucesActivas[nLuz] = activa;
  }

  registrarViewport(x: number, y: number, alto: number, ancho: number, nViewport: number) {
    this.registroViewports[nViewport].push(x);
    this.registroViewports[nViewport].push(y);
    this.registroViewports[nViewport].push(alto);
    this.registroViewports[nViewport].push(ancho);
  }

  setViewportActivo(nViewport: number) {
    this.viewportActivo = nViewport;
  }

  // ---------- Cosas del canvas de tamaños y cosas -----------------
  resizeWebGLCanvas() {
    const width = this.clientCanvas.clientWidth;
    const height = this.clientCanvas.clientHeight;
    if (this.gl.canvas.width !== width || this.gl.canvas.height !== height) {
      this.gl.canvas.width = width;
      this.gl.canvas.height = height;
    }
  }

  updateViewport() {
    if (this.gl) {
      this.gl.viewport(
        /*this.registroViewports[this.viewportActivo][0],
        this.registroViewports[this.viewportActivo][1],
        this.registroViewports[this.viewportActivo][2],
        this.registroViewports[this.viewportActivo][3]
        */
        0,
        0,
        this.gl.drawingBufferWidth,
        this.gl.drawingBufferHeight
      );
      this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
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
  }


  // ------------------ Código adicional de la compilación de shaders -----------------
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
}
