attribute vec3 a_Position;

uniform mat4 u_MvpMatrix;
uniform mat4 lightMatrix;

void main() {

    gl_Position = lightMatrix * u_MvpMatrix * vec4(a_Position, 1.0);

}