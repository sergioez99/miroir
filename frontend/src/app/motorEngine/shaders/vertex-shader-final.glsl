//vertex shader lightning maps

attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;

//estructura para guardar las luces (posicion, propiedades ambientas, difusa y especular de la luz)
struct TLight {
    vec3 Position;

    vec3 Ambient;
    vec3 Diffuse;
    vec3 Specular;
};
//estructura para guardar el material. ahora utilizamos texturas para guardar las propiedades difusas y especulares del material
struct TMaterial {
    vec3 Diffuse;
    vec3 Specular;
    float Shininess;
};

//estado de opengl: material y luz (del tipo de las estructuras anteriores)
uniform TMaterial Material;
uniform TLight Light;
uniform TLight Light2;

void main(void) {
    //tranformar el vertice y la normal a coordenadas de vista
    vPosition = vec3(uModelViewMatrix * aVertexPosition);
    vNormal = normalize(vec3(uNormalMatrix * vec4(aVertexNormal, 0.0)));

    //las coordenadas de textura no sufren transformacion
    vTextureCoord = aTextureCoord;

    //transformar y proyectar el vertice (posicion del fragemtento)
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

}
