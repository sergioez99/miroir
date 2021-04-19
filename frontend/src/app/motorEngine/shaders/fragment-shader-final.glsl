//fragment shader lightning maps
precision highp float;
//estructura para guardar el material. ahora utilizamos texturas para guardar las propiedades difusas y especulares del material
struct TMaterial {
    sampler2D Diffuse;
    sampler2D Specular;
    float Shininess;
};

//estructura para guardar las luces (posicion, propiedades ambientas, difusa y especular de la luz)
struct TLight {
    vec3 Position;

    vec3 Ambient;
    vec3 Diffuse;
    vec3 Specular;
};

//estado de opengl: material y luz (del tipo de las estructuras anteriores)
uniform TMaterial Material;
uniform TLight Light;

varying highp vec2 vTextureCoord;
varying highp vec3 vNormal;
varying highp vec3 vPosition;

uniform sampler2D uSampler;


//funcion que calcula el modelo de reflexion de Phong
vec3 Phong() {
    vec3 n  = normalize(vNormal);
    vec3 s = normalize(Light.Position - vPosition);
    vec3 v = normalize(vec3 (-vPosition));
    vec3 r = reflect (-s, n);
    
    //componente ambiental
    vec3 Ambient = Light.Ambient * vec3(texture(Material.Diffuse, vTextureCoord));

    //vec3 Ambient = vec3(1.3, 1.3, 1.3);

    //componente difusa
    vec3 Diffuse = Light.Diffuse * max(dot(s,n), 0.0) * vec3(texture(Material.Diffuse, vTextureCoord));
    //vec3 Diffuse = vec3(0.7, 0.7, 0.7);

    //componente especular
    vec3 Specular = Light.Specular * pow(max(dot(r,v), 0.0), Material.Shininess) * vec3(texture(Material.Specular, vTextureCoord));
    //vec3 Specular = vec3(0.3, 46.0, 0.4);

    return Ambient + Diffuse + Specular;
}

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    gl_FragColor = vec4 (texelColor.rgb * Phong(), texelColor.a);
}