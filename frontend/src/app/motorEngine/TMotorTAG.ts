import { TNode } from "./TNode";
import { gestorRecursos } from "./gestorRecursos";
import { ECamera, ELight, EModel } from "./TEntity";
import { TEntity } from "./commons";

//Imports de GL, motor gráfico y tal
import { GLSLConstants } from '../../assets/GLSLConstants';
import fragmentShaderSrc from '../motorEngine/shaders/toucan-fragment-shader.glsl';
import vertexShaderSrc from '../motorEngine/shaders/toucan-vertex-shader.glsl';
import * as matrix from 'gl-matrix';
import { RTextura } from "./TRecurso";
import { RtlScrollAxisType } from "@angular/cdk/platform";
import { waitForAsync } from "@angular/core/testing";

export class TMotorTAG {

    private raiz: TNode;
    private gestorRecursos: gestorRecursos;

    private registroCamaras: TNode[];
    private registroLuces: TNode[];
    private registroViewports: TNode[];
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

    private rotY;
    private zoom = 1;


    constructor() {
        this.raiz = new TNode(null, null, null, null, null, null, null);
        this.gestorRecursos = new gestorRecursos();
    }

    crearNodo(padre: TNode, trasl: matrix.vec3, rot: matrix.vec3, esc: matrix.vec3) {
        if (padre == null)
            padre = this.raiz;

        let nuevo = new TNode(null, padre, null, null, trasl, rot, esc);

        nuevo.changeActuMatriz();
        padre.addChild(nuevo);

        return nuevo;
    }
    crearCamara(padre: TNode, trasl: matrix.vec3, rot: matrix.vec3, esc: matrix.vec3, esPerspectiva, cercano, lejano, derecha, izquierda, superior, inferior) {
        if (padre == null)
            padre = this.raiz;

        let nuevo = new TNode(null, padre, null, null, trasl, rot, esc);

        nuevo.changeActuMatriz();
        padre.addChild(nuevo);

        let entidad = new ECamera(esPerspectiva, cercano, lejano, derecha, izquierda, superior, inferior);

        nuevo.setentidad(entidad);

        return nuevo;
    }
    crearLuz(padre: TNode, trasl: matrix.vec3, rot: matrix.vec3, esc: matrix.vec3, tipo, intensidad, apertura, atenAngular, atenCte, atenLineal, atenCuadrat) {
        if (padre == null)
            padre = this.raiz;
        let nuevo = new TNode(null, padre, null, null, trasl, rot, esc);
        nuevo.changeActuMatriz();
        padre.addChild(nuevo);

        let entidad = new ELight(tipo, intensidad, apertura, atenAngular, atenCte, atenLineal, atenCuadrat);

        nuevo.setentidad(entidad);

        return nuevo;

    }
    async crearModelo(padre: TNode, trasl: matrix.vec3, rot: matrix.vec3, esc: matrix.vec3, prenda, textura) {
        if (padre == null)
            padre = this.raiz;
        let nuevo = new TNode(null, padre, null, null, trasl, rot, esc);
        nuevo.changeActuMatriz();
        padre.addChild(nuevo);

        let malla = await this.gestorRecursos.getRecurso(prenda);

        //No sé si esto va aquí
        let text = await this.gestorRecursos.getRecurso(textura);
        //malla.setTextura(RText);
        let texture = await this.loadTexture(text);
        console.log(texture);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);


        let entidad = new EModel();
        entidad.setMalla(malla);

        nuevo.setentidad(entidad);
        return nuevo;
    }

    dibujarEscena() {
        let matrizId = matrix.mat4.create();

        for (let i = 0; i < this.registroLuces.length; i++) {
            if (this.lucesActivas[i] == true) {
                let matrizLuz = this.registroLuces[i].getTransformMatrix();
                //Decirle a gl que use las luces (buscar)
            }
        }
        let cameraMatrix = this.registroCamaras[this.camaraActiva].getTransformMatrix();
        let viewMatrix = matrix.mat4.create();
        matrix.mat4.invert(viewMatrix, cameraMatrix);
        //Pasarle la matriz a gl (set el uniform de la matriz aquí)
        //Dudassss de como hacer el viewport
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
        this.gl.canvas.width = window.outerWidth;
        this.gl.canvas.height = window.outerHeight

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
            },
        };

        this.gl.useProgram(this.programInfo.program);

        return this.gl;
    }

    //Programa de inicialización de shaders
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

    // --------------------- Iniciar el probador -----------------------
    async iniciarProbador(avatar, texturaAvatar, prenda, textura) {
        //Creamos la cámara y la luz
        //let luz = this.crearLuz(null, null, null, null, null, null, null, null, null, null, null); //Todavia no sé sos
        //this.registrarLuz(luz);
        //this.setLuzActiva(0, true);

        //let camara = this.crearCamara(null, null, null, null, true, 0.1, 500, null, null, 1, null);
        //this.registrarCamara(camara);
        //this.setCamaraActiva(0);

        //this.registrarViewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        //this.setViewportActivo(0);




        //Cargamos los modelos y sus buffers
        //Inicializamos los buffers con lo que queremos dibujar
        await this.initialiseBuffers(avatar, texturaAvatar).then(buffers => { this.buffers = buffers; });
        //await this.initialiseBuffers("pantalon.json").then(buffers => {this.buffers2 = buffers; });

        //aquí podriamos llamar a los draws
        //this.dibujarEscena();

    }

    async initialiseBuffers(prenda, textura) {
        let modelo = await this.crearModelo(null, null, null, null, prenda, textura);
        let malla = modelo.getEntidad().getMalla();
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

    dibujadoTemporal() {
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
        matrix.mat4.scale(this.modelViewMatrix,
            this.modelViewMatrix,
            [this.zoom, this.zoom, this.zoom]);

        // Compute a matrix for the camera
        let cameraMatrix = matrix.mat4.create();
        //console.log(cameraMatrix);

        let cameraTarget = matrix.vec3.create();
        //Mira a las transformaciones de traslación del modelo, enfocando asi al avatar bien (o eso creo)
        cameraTarget = [this.modelViewMatrix[12], this.modelViewMatrix[13], this.modelViewMatrix[14]];
        cameraTarget = [0, 0, 0];
        let cameraPosition = matrix.vec3.create();
        //De momento la cámara está en el centro, pero se tendrá que mover para una mejor vista
        cameraPosition = [0, 0, -12];
        let up = matrix.vec3.create();
        up = [0, 1, 0];

        // Compute the camera's matrix using look at.
        matrix.mat4.lookAt(cameraMatrix, cameraPosition, cameraTarget, up);

        let viewMatrix = matrix.mat4.create();
        matrix.mat4.invert(viewMatrix, cameraMatrix);
        let viewProjectionMatrix = matrix.mat4.create();
        matrix.mat4.multiply(viewProjectionMatrix, this.projectionMatrix, viewMatrix)




        let normalMatrix = matrix.mat4.create();
        matrix.mat4.invert(normalMatrix, this.modelViewMatrix);
        matrix.mat4.transpose(normalMatrix, normalMatrix);

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
            //this.projectionMatrix
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



        // Dibujar camiseta
        let vertexCount = 10752;
        const type = this.gl.UNSIGNED_SHORT;
        const offset = 0;
        this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
        //
        //
        //
        //

        /*let texture = this.loadTexture(2);
    
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

    // ---------------- Texturas y cosas ------------------------------------
    private isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }

    async loadTexture(image) {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = this.gl.RGBA;
        const srcFormat = this.gl.RGBA;
        const srcType = this.gl.UNSIGNED_BYTE;

        //Textura de color azul
        /*let pixel = new Uint8Array([0, 126, 126, 255]);
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
            1, 1, 0, srcFormat, srcType,
            pixel);
            */
        
        //let pixels = new Uint8Array(image);
        //console.log(pixels);

        this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);
        

        
        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn of mips and set
            // wrapping to clamp to edge
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
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

    registrarViewport(x: number, y: number, alto: number, ancho: number) {
        //esto no lo entiendo
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
        //Update del viewport para que se vea bien lol
        if (this.gl) {
            this.gl.viewport(
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
