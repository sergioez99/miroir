attribute vec4 a_Position;

uniform mat4 u_MvpMatrix;
uniform mat4 lightMatrix;

void main() {

    gl_Position = lightMatrix * u_MvpMatrix * a_Position;

}