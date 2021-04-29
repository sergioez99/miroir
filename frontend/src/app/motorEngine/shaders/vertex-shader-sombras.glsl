attribute vec4 vertices;

    mat4 scalem(float x, float y, float z){
        mat4 scale = mat4( x,  0.0,  0.0, 0.0,
        0.0,  y,  0.0, 0.0,
        0.0,  0.0,  z, 0.0,
        0.0,  0.0,  0.0, 1.0 );
        return scale;
    }
    mat4 translate(float x, float y, float z){
        mat4 trans = mat4( 1.0,  0.0, 0.0, 0.0,
        0.0,  1.0, 0.0, 0.0,
        0.0,  0.0, 1.0, 0.0,
        x,  y, z, 1.0 );
        return trans;
    }

    uniform mat4 orthoMatrix;
    uniform mat3 rotMatrix;

    uniform vec3 sc;
    uniform vec3 rot;
    uniform vec3 t;

void main()
{   
    vec4 verticesa = vertices;

    mat4 mFinal = translate(t.x, t.y, t.z) * mat4(rotMatrix) * scalem(sc.x, sc.y, sc.z);

    verticesa = mFinal*verticesa;
    verticesa = orthoMatrix*verticesa;

    gl_Position = verticesa;
}