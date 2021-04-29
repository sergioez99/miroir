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

uniform mat4 u_MvpMatrixFromLight;
varying vec4 v_PositionFromLight;

void main(void) {
    //tranformar el vertice y la normal a coordenadas de vista
    vPosition = vec3(uModelViewMatrix * aVertexPosition);
    vNormal = normalize(vec3(uNormalMatrix * vec4(aVertexNormal, 0.0)));

    //las coordenadas de textura no sufren transformacion
    vTextureCoord = aTextureCoord;

    v_PositionFromLight = u_MvpMatrixFromLight * aVertexPosition;
    //transformar y proyectar el vertice (posicion del fragemtento)
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

}
