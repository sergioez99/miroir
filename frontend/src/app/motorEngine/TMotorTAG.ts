import { TNode } from "./TNode";
import { gestorRecursos } from "./gestorRecursos";
import { ECamera, ELight, EModel } from "./TEntity";


//Imports de GL, motor gráfico y tal
import { GLSLConstants } from '../../assets/GLSLConstants';
import fragmentShaderSrc from '../motorEngine/shaders/fragment-shader-final.glsl';
import vertexShaderSrc from '../motorEngine/shaders/vertex-shader-final.glsl';
import fragmentShaderShadow from '../motorEngine/shaders/fragment-shader-sombras.glsl';
import vertexShaderShadow from '../motorEngine/shaders/vertex-shader-sombras.glsl';
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
  private get gl(): WebGL2RenderingContext {
    return this.renderingContext as WebGL2RenderingContext;
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
  private viewProjMatrixFromLight = matrix.mat4.create(); // Prepare a view projection matrix for generating a shadow map
  private mvpMatrixFromLight_t = matrix.mat4.create(); // A model view projection matrix from light source (for triangle)
  private mvpMatrixFromLight_p = matrix.mat4.create(); // A model view projection matrix from light source (for plane)

  //Buffers y shaders
  private buffers: any
  private buffers2: any
  private buffers3: any
  private programInfo: any
  private programShadow: any
  private fbo: any

  private rotY = 0;
  private zoom = 1;
  private modelos
  private num = 0;

  private nombreAvatar: string; nombrePrenda: string; nombreSuelo: string;
  private malla1; malla2; malla3;
  private RMalla;
  private pos;

  private animacion;
  private andar;
  private textura;


  constructor() {
    this.raiz = new TNode(null, null, null, null, null, null, null);
    this.gestorRecursos = new gestorRecursos();
    this.registroCamaras = [];
    this.registroLuces = [];
    this.lucesActivas = [];
    this.registroViewports = [[]]
    this.modelos = 0;
    this.nombreAvatar = "avatar";
    this.nombrePrenda = "prenda";
    this.nombreSuelo = "suelo";
    this.pos = 1;
    this.andar = 0;
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

    for (let i in malla.getTexturas()) {
      let text = await this.gestorRecursos.getRecurso(malla.getTexturas()[i], ticket, "textura");
      this.modelos = malla.getTexturas()[i];
      let texture = await this.loadTexture(text);
    }


    let entidad = new EModel();
    entidad.setMalla(malla);

    nuevo.setentidad(entidad);
    return nuevo;
  }

  async comprobarPrendas(ticket, modelos) {
    let RMalla = this.gestorRecursos.dibujarMallas();

    let mallas = RMalla.getMallas();

    if (this.nombreAvatar.localeCompare(modelos[0]) != 0) {
      this.nombreAvatar = modelos[0];
      let avatarNodo = await this.crearModelo(null, null, null, null, modelos[0], ticket, "avatar");
    }
    if (this.nombreSuelo.localeCompare("suelo.json") != 0) {
      this.nombreSuelo = "suelo.json";
      let sueloNodo = await this.crearModelo(null, null, null, null, "suelo.json", ticket, "suelo");
    }
    if (this.nombrePrenda.localeCompare(modelos[1]) != 0) {
      this.nombrePrenda = modelos[1];
      let modeloNodo = await this.crearModelo(null, null, null, null, modelos[1], ticket, "prenda");
    }

    for (let i in mallas) {
      if (mallas[i].getNombre().localeCompare(modelos[0]) == 0 || mallas[i].getNombre().localeCompare(modelos[1]) == 0 || mallas[i].getNombre().localeCompare('suelo.json') == 0) {
        mallas[i].setDibujado(true);
      }
      else {
        mallas[i].setDibujado(false);
      }
    }
  }

  cambioTexturas(textura){
    if(textura){
      this.textura = textura;
    }
  }

  async dibujarEscena() {
    this.resizeWebGLCanvas();
    this.updateWebGLCanvas();
      

    //this.dibujarSombras(2);

    this.gl.useProgram(this.programInfo.program);
    //Reset de esto
    this.modelViewMatrix = matrix.mat4.create();

    // LUCES


    this.gl.uniform3fv(this.programInfo.uniformLocations.lightPosition, [-50, -10, -50]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightAmbiental, [0.3, 0.3, 0.3]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightDiffuse, [0.8, 0.8, 0.8]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightSpecular, [0.2, 0.2, 0.2]);
    /* this.gl.uniform3fv(this.programInfo.uniformLocations.lightAmbiental, [0.0,0.0,0.0]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightDiffuse,  [0.0,0.0,0.0]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightSpecular,  [0.0,0.0,0.0]); */

    this.gl.uniform3fv(this.programInfo.uniformLocations.lightPosition2, [50, -10, -50]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightAmbiental2, [0.2, 0.2, 0.2]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightDiffuse2, [0.5, 0.5, 0.5]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightSpecular2, [0.2, 0.2, 0.2]);




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
    matrix.mat4.rotateY(viewProjectionMatrix, viewProjectionMatrix, this.rotY)

    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, viewProjectionMatrix);

    let normalMatrix = matrix.mat4.create();
    matrix.mat4.invert(normalMatrix, this.modelViewMatrix);
    matrix.mat4.transpose(normalMatrix, normalMatrix);

    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.normalMatrix, false, normalMatrix);


    // VIEWPORT
    this.updateViewport();

    let RMalla = this.gestorRecursos.dibujarMallas();

    let mallas = RMalla.getMallas();

    for (let i in mallas) {
      let vertexCount = mallas[i].getIndices().length;
      switch (i) {
        case '0': //Avatar
          if (mallas[i].getDibujado()) {
            this.modelViewMatrix = matrix.mat4.create();
            matrix.mat4.translate(this.modelViewMatrix,
              this.modelViewMatrix,
              [0, -3, 0])
            matrix.mat4.rotateY(this.modelViewMatrix,
              this.modelViewMatrix,
              180 * Math.PI / 180)
            matrix.mat4.rotateX(this.modelViewMatrix,
              this.modelViewMatrix,
              90 * Math.PI / 180)

            //Puedo cambiar los buffers a array también    
            this.buffers = await this.initialiseBuffers(mallas[i]);

            this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 1);

            this.bindVertexPosition(this.programInfo, this.buffers);

            this.bindVertexTextures(this.programInfo, this.buffers);

            this.bindVertexNormal(this.programInfo, this.buffers);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
            this.gl.uniformMatrix4fv(this.programInfo.program.MVPFromLight, false, this.mvpMatrixFromLight_t);
          }

          break;

        case '1': //suelo{
          this.modelViewMatrix = matrix.mat4.create();
          matrix.mat4.translate(this.modelViewMatrix,
            this.modelViewMatrix,
            [0, -3, 0])
          matrix.mat4.scale(this.modelViewMatrix,
            this.modelViewMatrix,
            [0.068, 0.068, 0.068])


          this.buffers3 = await this.initialiseBuffers(mallas[i]);
         
          this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

          this.bindVertexPosition(this.programInfo, this.buffers3);

          this.bindVertexTextures(this.programInfo, this.buffers3);

          this.bindVertexNormal(this.programInfo, this.buffers3);

          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers3.indices);

          this.gl.uniformMatrix4fv(this.programInfo.program.MVPFromLight, false, this.mvpMatrixFromLight_t);

          break;

        default: //Prenda 1
          if (mallas[i].getDibujado()) {
            //para la camiseta y el pantalon
            this.modelViewMatrix = matrix.mat4.create();
            matrix.mat4.translate(this.modelViewMatrix,
              this.modelViewMatrix,
              [0, -3, 0])
            matrix.mat4.rotateY(this.modelViewMatrix,
              this.modelViewMatrix,
              180 * Math.PI / 180)
            matrix.mat4.rotateX(this.modelViewMatrix,
              this.modelViewMatrix,
              90 * Math.PI / 180)

            if (this.num == 1) //Falda (hay que poner otro if que vaya)
              matrix.mat4.translate(this.modelViewMatrix,
                this.modelViewMatrix,
                [0, -0.033, -1.37])
            else //Camiseta y pantalón
              matrix.mat4.scale(this.modelViewMatrix,
                this.modelViewMatrix,
                [0.0328, 0.0328, 0.0328])


            this.buffers2 = await this.initialiseBuffers(mallas[i]);

            if (this.textura){
              this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, this.textura);
            }  
            else{ 
              this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 3);
            }
              

            this.bindVertexPosition(this.programInfo, this.buffers2);

            this.bindVertexTextures(this.programInfo, this.buffers2);

            this.bindVertexNormal(this.programInfo, this.buffers2);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers2.indices);
            this.gl.uniformMatrix4fv(this.programInfo.program.MVPFromLight, false, this.mvpMatrixFromLight_t);
          }
          break;

      }
      if (mallas[i].getDibujado()) {
        this.gl.uniform3fv(this.programInfo.uniformLocations.matDiffuse, mallas[i].getDiffuse());
        this.gl.uniform3fv(this.programInfo.uniformLocations.matSpecular, mallas[i].getSpecular());
        this.gl.uniform1f(this.programInfo.uniformLocations.matShininess, mallas[i].getGlossiness());

        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);

        this.gl.drawElements(this.gl.TRIANGLES, vertexCount, this.gl.UNSIGNED_SHORT, 0);
      }
    }
  }

  // ---------------- Inicializar el contexto de GL y los shaders ----------------
  iniciarGL(canvas: HTMLCanvasElement) {
    // Iniciacializamos el contexto
    this.renderingContext =
      canvas.getContext('webgl2')
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
    let shaderProgram = this.initializeShaders(1);
    let shadowProgram = this.initializeShaders(2);

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
        lightPosition3: this.gl.getUniformLocation(shaderProgram, 'Light3.Position'),
        lightAmbiental3: this.gl.getUniformLocation(shaderProgram, 'Light3.Ambient'),
        lightDiffuse3: this.gl.getUniformLocation(shaderProgram, 'Light3.Diffuse'),
        lightSpecular3: this.gl.getUniformLocation(shaderProgram, 'Light3.Specular'),
        MVPFromLight: this.gl.getUniformLocation(shaderProgram, 'u_MvpMatrixFromLight'),
        shadowMap: this.gl.getUniformLocation(shaderProgram, 'u_ShadowMap'),
      },
    };

    this.programShadow = {
      program: shadowProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(shadowProgram, 'a_Position'),
      },
      uniformLocations: {
        modelViewMatrix: this.gl.getUniformLocation(shadowProgram, 'uMvp_Matrix'),
        lightMatrix: this.gl.getUniformLocation(shadowProgram, 'lightMatrix')
      }
    }

    //this.gl.useProgram(this.programInfo.program);

    return this.gl;
  }

  //Programa de inicialización de shaders
  initializeShaders(num): WebGLProgram {
    let shaderProgram = this.gl.createProgram();

    const compiledShaders = [];
    if (num == 1) {
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
    }
    else {
      let fragmentShader = this.loadShader(
        fragmentShaderShadow,
        GLSLConstants.fragmentShaderMimeType
      );
      let vertexShader = this.loadShader(
        vertexShaderShadow,
        GLSLConstants.vertexShaderMimeType
      );
      compiledShaders.push(fragmentShader);
      compiledShaders.push(vertexShader);
    }




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
  async iniciarProbador(ticket, modelos) {
    //Creamos la cámara, la luz y el viewport del probador
    let luz = this.crearLuz(null, null, null, null, null, null, null, null, null, null, null); //Todavia no sé sos
    this.registrarLuz(luz);
    this.setLuzActiva(0, true);

    let camara = this.crearCamara(null, null, null, null, true, 0.1, 500, null, null, 1, null);
    this.registrarCamara(camara);
    this.setCamaraActiva(0);

    this.registrarViewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, 0);
    this.setViewportActivo(0);

    if (modelos[1] == 'b0c090e4-5eb5-4ee5-a185-09afefd1e83f.json')
      this.num = 1
    else
      this.num = 0

    let cargando = await this.comprobarPrendas(ticket, modelos);

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

  private bindVertexPositionShadow(programInfo: any, buffers: any) {
    const bufferSize = 3;
    const type = this.gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
    this.gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, bufferSize, type, normalize, stride, offset);
    this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
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
    console.log(this.modelos)
    switch (this.modelos) {
      case 'default.jpg': console.log('cargo default')
       this.gl.activeTexture(this.gl.TEXTURE0); //Default (para el suelo)
        break;
      case 'algodon.jpg': console.log('cargo algodon')
      this.gl.activeTexture(this.gl.TEXTURE1); //Algodón
        break;
      case 'cuadritos.jpg': console.log('cargo cuadritos')
      this.gl.activeTexture(this.gl.TEXTURE2); //Cuadritos
        break;
      case 'vaquero.jpg': console.log('cargo vaquero')
      this.gl.activeTexture(this.gl.TEXTURE3); //Vaquero
        break;
    }
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
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
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


  //Probador con animaciones
  async iniciarAnimacion(ticket, avatar, prenda) {
    //Creamos la cámara, la luz y el viewport del probador
    let luz = this.crearLuz(null, null, null, null, null, null, null, null, null, null, null); //Todavia no sé sos
    this.registrarLuz(luz);
    this.setLuzActiva(0, true);

    let camara = this.crearCamara(null, null, null, null, true, 0.1, 500, null, null, 1, null);
    this.registrarCamara(camara);
    this.setCamaraActiva(0);

    this.registrarViewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, 0);
    this.setViewportActivo(0);

    if (prenda == "b0c090e4-5eb5-4ee5-a185-09afefd1e83f.json")
      this.num = 1;

    //Crear modelos aquí
    let mallas = await this.cargarModelos();
    //let mallas = this.RMalla.getMallas();

    //Animación en 30FPS 
    setInterval(() => {
      if (this.pos == 1) {
        mallas[this.pos].setDibujado(true); //Avatar
        mallas[this.pos + 1].setDibujado(true); //Prenda
        mallas[mallas.length - 1].setDibujado(false); //Prenda del último 
        mallas[mallas.length - 2].setDibujado(false); //Avatar del último
      } else {
        mallas[this.pos].setDibujado(true)
        mallas[this.pos + 1].setDibujado(true)
        mallas[this.pos - 1].setDibujado(false)
        mallas[this.pos - 2].setDibujado(false)
      }


      this.pos += 2;
      if (this.pos >= mallas.length - 1) {
        this.pos = 1;
        // mallas[this.pos].setDibujado(true); //Avatar
        // mallas[this.pos+1].setDibujado(true); //Prenda
        // mallas[mallas.length-1].setDibujado(false); //Prenda del último 
        // mallas[mallas.length-2].setDibujado(false);
        // this.pos+= 2;
      }


    }, 60)
  }

  async dibujarAnimaciones() {
    this.resizeWebGLCanvas();
    this.updateWebGLCanvas();
    let sombras = await this.dibujarSombras(1);

    // LUCES

    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.useProgram(this.programInfo.program);

    this.gl.uniform3fv(this.programInfo.uniformLocations.lightPosition, [-60, -10, 50]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightAmbiental, [0.3, 0.3, 0.3]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightDiffuse, [0.8, 0.8, 0.8]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightSpecular, [0.2, 0.2, 0.2]);

    this.gl.uniform3fv(this.programInfo.uniformLocations.lightPosition2, [60, -10, 50]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightAmbiental2, [0.3, 0.3, 0.3]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightDiffuse2, [0.5, 0.5, 0.5]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightSpecular2, [0.2, 0.2, 0.2]);

    this.gl.uniform3fv(this.programInfo.uniformLocations.lightPosition3, [0, 10, -12]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightAmbiental3, [0.3, 0.3, 0.3]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightDiffuse3, [0.8, 0.8, 0.8]);
    this.gl.uniform3fv(this.programInfo.uniformLocations.lightSpecular3, [0.2, 0.2, 0.2]);


    //CÁMARA

    let cameraMatrix = this.registroCamaras[this.camaraActiva].getTransformMatrix();
    let cameraTarget = matrix.vec3.create();
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
    matrix.mat4.rotateY(viewProjectionMatrix, viewProjectionMatrix, this.rotY)

    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, viewProjectionMatrix);

    let normalMatrix = matrix.mat4.create();
    matrix.mat4.invert(normalMatrix, this.modelViewMatrix);
    matrix.mat4.transpose(normalMatrix, normalMatrix);

    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.normalMatrix, false, normalMatrix);


    // VIEWPORT
    this.updateViewport();


    let RMalla = this.gestorRecursos.dibujarMallas();

    //Tengo aquí todos los modelos
    let mallas = RMalla.getMallas();

    for (let i in mallas) {
      let vertexCount = mallas[i].getIndices().length;
      switch (i) {
        case '0': //Suelo
          this.modelViewMatrix = matrix.mat4.create();
          matrix.mat4.translate(this.modelViewMatrix,
            this.modelViewMatrix,
            [0, -3, 0])
          matrix.mat4.scale(this.modelViewMatrix,
            this.modelViewMatrix,
            [0.068, 0.068, 0.068])


          this.buffers3 = await this.initialiseBuffers(mallas[0]);
          this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

          this.bindVertexPosition(this.programInfo, this.buffers3);

          this.bindVertexTextures(this.programInfo, this.buffers3);

          this.bindVertexNormal(this.programInfo, this.buffers3);

          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers3.indices);

          this.gl.uniformMatrix4fv(this.programInfo.program.MVPFromLight, false, this.mvpMatrixFromLight_t);

          break;

        default: //Avatar y prenda que parece q se ven bien asi
          if (mallas[i].getDibujado()) {

            this.modelViewMatrix = matrix.mat4.create();
            matrix.mat4.translate(this.modelViewMatrix,
              this.modelViewMatrix,
              [0, -3, 0])
            matrix.mat4.rotateY(this.modelViewMatrix,
              this.modelViewMatrix,
              180 * Math.PI / 180)
            // // matrix.mat4.rotateX(this.modelViewMatrix,
            // //   this.modelViewMatrix,
            // //   90 * Math.PI / 180)
            matrix.mat4.scale(this.modelViewMatrix,
              this.modelViewMatrix,
              [0.0328, 0.0328, 0.0328])

            //Puedo cambiar los buffers a array también    
            this.buffers = await this.initialiseBuffers(mallas[i]);
            let num: any = i;
            if (num % 2 == 0)
              this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 1);
            else
              this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 2);
            //cambiar la textura si es avatar o prenda: (par o impar)

            this.bindVertexPosition(this.programInfo, this.buffers);

            this.bindVertexTextures(this.programInfo, this.buffers);

            this.bindVertexNormal(this.programInfo, this.buffers);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
            this.gl.uniformMatrix4fv(this.programInfo.program.MVPFromLight, false, this.mvpMatrixFromLight_t);
          }
          break;

      }

      if (mallas[i].getDibujado()) {
        // this.andar = this.andar - 0.004;
        // if(this.andar <= -2)
        //   this.andar = 0;

        this.gl.uniform3fv(this.programInfo.uniformLocations.matDiffuse, mallas[i].getDiffuse());
        this.gl.uniform3fv(this.programInfo.uniformLocations.matSpecular, mallas[i].getSpecular());
        this.gl.uniform1f(this.programInfo.uniformLocations.matShininess, mallas[i].getGlossiness());

        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);

        this.gl.drawElements(this.gl.TRIANGLES, vertexCount, this.gl.UNSIGNED_SHORT, 0);
      }

    }

  }

  async cargarModelos() {
    this.RMalla = this.gestorRecursos.dibujarMallas();

    //Animacion alberto
    this.animacion = ['0_1.json', '0_2.json', '1_1.json', '1_2.json', '2_1.json', '2_2.json', '3_1.json', '3_2.json', '4_1.json', '4_2.json', '5_1.json', '5_2.json', '6_1.json', '6_2.json', '7_1.json', '7_2.json', '8_1.json', '8_2.json', '9_1.json', '9_2.json', '10_1.json', '10_2.json',
      '11_1.json', '11_2.json', '12_1.json', '12_2.json', '13_1.json', '13_2.json', '14_1.json', '14_2.json', '15_1.json', '15_2.json', '16_1.json', '16_2.json', '17_1.json', '17_2.json', '18_1.json', '18_2.json', '19_1.json', '19_2.json', '20_1.json', '20_2.json',
      '21_1.json', '21_2.json', '22_1.json', '22_2.json', '23_1.json', '23_2.json', '24_1.json', '24_2.json', '25_1.json', '25_2.json', '26_1.json', '26_2.json', '27_1.json', '27_2.json', '28_1.json', '28_2.json', '29_1.json', '29_2.json', '30_1.json', '30_2.json',
      '31_1.json', '31_2.json', '32_1.json', '32_2.json', '33_1.json', '33_2.json', '34_1.json', '34_2.json', '35_1.json', '35_2.json', '36_1.json', '36_2.json', '37_1.json', '37_2.json', '38_1.json', '38_2.json', '39_1.json', '39_2.json', '40_1.json', '40_2.json',
      '41_1.json', '41_2.json', '42_1.json', '42_2.json', '43_1.json', '43_2.json', '44_1.json', '44_2.json', '45_1.json', '45_2.json', '46_1.json', '46_2.json'];



    //Variables de las q cogemos las texturas
    let suelo: any, malla: any
    //Suelo (y fondo) aparte
    suelo = await this.gestorRecursos.ficherosAssets('suelo.json');
    suelo.setDibujado(true);
    let text = await this.gestorRecursos.ficherosAssets(suelo.getTexturas()[0]);
    let texture = await this.loadTexture(text);
    this.RMalla.addMallas(suelo);

    for (let i in this.animacion) {
      malla = await this.gestorRecursos.ficherosAssets(this.animacion[i]);
      if (i == '0' || i == '1') {
        text = await this.gestorRecursos.ficherosAssets(malla.getTexturas()[0]);
        texture = await this.loadTexture(text);
      }
      this.RMalla.addMallas(malla);
    }

    return this.RMalla.getMallas();
  }

  async dibujarSombras(tipo) {
    let frame_buffer, texture;

    //DEPTH BUFFER
    frame_buffer = this.gl.createFramebuffer();
    texture = this.gl.createTexture();

    this.gl.activeTexture(this.gl.TEXTURE5);

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT16, 1024, 1024, 0, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_INT, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frame_buffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, texture, 0);

    this.gl.drawBuffers([this.gl.NONE]);
    this.gl.readBuffer(this.gl.NONE)

    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    let lightSpaceMatrix = matrix.mat4.create();
    let lightProjection = matrix.mat4.create();
    let lightView = matrix.mat4.create();

    matrix.mat4.ortho(lightProjection, 10.0, -10.0, 10.0, -10.0, this.zNear, this.zFar);
    //Es algo de aquí pero no entiendooooooooo
    matrix.mat4.lookAt(lightView, [0.0, 10.0, -12.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    matrix.mat4.invert(lightView, lightView);
    matrix.mat4.multiply(lightSpaceMatrix, lightProjection, lightView);

    this.gl.useProgram(this.programShadow.program);

    this.gl.uniformMatrix4fv(this.programShadow.uniformLocations.lightMatrix, false, lightSpaceMatrix);

    // // SOMBRAS (se dibujan antes que los modelos)        
    this.gl.viewport(0, 0, 1024, 1024);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frame_buffer);
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.cullFace(this.gl.FRONT);



    let RMalla = this.gestorRecursos.dibujarMallas();

    //Tengo aquí todos los modelos
    let mallas = RMalla.getMallas();

    if (tipo == 1) { //Bucle de dibujado para probador animación
      for (let i in mallas) {
        let vertexCount = mallas[i].getIndices().length;
        switch (i) {
          case '0': //Suelo
            matrix.mat4.translate(this.modelViewMatrix,
              this.modelViewMatrix,
              [0, -3, 0])
            matrix.mat4.scale(this.modelViewMatrix,
              this.modelViewMatrix,
              [0.068, 0.068, 0.068])


            //Posicion de la sombra
            this.buffers3 = await this.initialiseBuffers(mallas[0]);
            this.bindVertexPositionShadow(this.programShadow, this.buffers3);
            break;

          default: //Avatar y prenda que parece q se ven bien asi
            if (mallas[i].getDibujado()) {
              this.modelViewMatrix = matrix.mat4.create();
              matrix.mat4.translate(this.modelViewMatrix,
                this.modelViewMatrix,
                [0, -3, 0])
              matrix.mat4.rotateY(this.modelViewMatrix,
                this.modelViewMatrix,
                180 * Math.PI / 180)
              matrix.mat4.rotateZ(this.modelViewMatrix,
                this.modelViewMatrix,
                -90 * Math.PI / 180)
              matrix.mat4.scale(this.modelViewMatrix,
                this.modelViewMatrix,
                [0.0328, 0.0328, 0.0328])

              this.buffers = await this.initialiseBuffers(mallas[i]);
              this.bindVertexPositionShadow(this.programShadow, this.buffers);
            }
            break;

        }
        if (mallas[i].getDibujado()) {
          //Transformaciones del modelo de la sombra      
          this.gl.uniformMatrix4fv(this.programShadow.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
          this.gl.drawElements(this.gl.TRIANGLES, vertexCount, this.gl.UNSIGNED_SHORT, 0);
        }
      }

    }
    else {
      for (let i in mallas) {
        let vertexCount = mallas[i].getIndices().length;
        switch (i) {
          case '0': //Avatar
            this.modelViewMatrix = matrix.mat4.create();
            matrix.mat4.translate(this.modelViewMatrix,
              this.modelViewMatrix,
              [0, -3, 0])
            matrix.mat4.rotateY(this.modelViewMatrix,
              this.modelViewMatrix,
              180 * Math.PI / 180)
            matrix.mat4.rotateX(this.modelViewMatrix,
              this.modelViewMatrix,
              90 * Math.PI / 180)

            this.buffers = await this.initialiseBuffers(mallas[i]);
            this.bindVertexPositionShadow(this.programShadow, this.buffers);
            break;

          case '1': //suelo
            this.modelViewMatrix = matrix.mat4.create();
            matrix.mat4.translate(this.modelViewMatrix,
              this.modelViewMatrix,
              [0, -3, 0])
            matrix.mat4.scale(this.modelViewMatrix,
              this.modelViewMatrix,
              [0.068, 0.068, 0.068])


            this.buffers3 = await this.initialiseBuffers(mallas[i]);
            this.bindVertexPositionShadow(this.programShadow, this.buffers3);
            break;

          default: //Prenda 1
            //para la camiseta y el pantalon
            this.modelViewMatrix = matrix.mat4.create();
            matrix.mat4.translate(this.modelViewMatrix,
              this.modelViewMatrix,
              [0, -3, 0])
            matrix.mat4.rotateY(this.modelViewMatrix,
              this.modelViewMatrix,
              180 * Math.PI / 180)
            matrix.mat4.rotateX(this.modelViewMatrix,
              this.modelViewMatrix,
              90 * Math.PI / 180)

            if (this.num == 1) //Falda (hay que poner otro if que vaya)
              matrix.mat4.translate(this.modelViewMatrix,
                this.modelViewMatrix,
                [0, -0.033, -1.37])
            else //Camiseta y pantalón
              matrix.mat4.scale(this.modelViewMatrix,
                this.modelViewMatrix,
                [0.0328, 0.0328, 0.0328])

            this.buffers2 = await this.initialiseBuffers(mallas[i]);
            this.bindVertexPositionShadow(this.programInfo, this.buffers2);
            break;

        }
        if (mallas[i].getDibujado()) {
          this.gl.uniformMatrix4fv(this.programShadow.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
          this.gl.drawElements(this.gl.TRIANGLES, vertexCount, this.gl.UNSIGNED_SHORT, 0);
        }
      }
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    // //YA HEMOS DIBUJADO LAS SOMBRAS (SE SUPONE)
    this.gl.useProgram(this.programInfo.program);
    this.gl.cullFace(this.gl.BACK);
    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.MVPFromLight, false, lightSpaceMatrix);
    //CONFUSION
    this.gl.uniform1i(this.programInfo.uniformLocations.shadowMap, 5);
  }
}
