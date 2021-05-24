//fragment shader lightning maps
precision highp float;
//estructura para guardar el material. ahora utilizamos texturas para guardar las propiedades difusas y especulares del material
struct TMaterial {
    vec3 Diffuse;
    vec3 Specular;
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
uniform TLight Light2;
uniform TLight Light3;

varying highp vec2 vTextureCoord;
varying highp vec3 vNormal;
varying highp vec3 vPosition;

uniform sampler2D uSampler;
uniform sampler2D u_ShadowMap; //Textura proyectada que será la sombra
varying vec4 v_PositionFromLight; //Coordenadas de donde estará proyectada la sombra


//funcion que calcula las sombras
float ShadowCalculation()
{
    vec3 projCoords = v_PositionFromLight.xyz / v_PositionFromLight.w;

    projCoords = projCoords * 0.5 + 0.5;

    float closestDepth = texture2D(u_ShadowMap, projCoords.xy).r; 

    float currentDepth = projCoords.z;

    float shadow = currentDepth > closestDepth  ? 1.0 : 0.0;

    return shadow;
}  

//funcion que calcula el modelo de reflexion de Phong
vec3 Phong() {
    vec3 color = texture2D(uSampler, vTextureCoord).rgb;

    vec3 n  = normalize(vNormal);
    //distancia de la luz al vector (y dirección)
    vec3 s = normalize(Light.Position - vPosition);
    vec3 s2 = normalize(Light2.Position - vPosition);
    vec3 s3 = normalize(Light3.Position - vPosition);
    vec3 v = normalize(vec3 (-vPosition));
    vec3 r = reflect (-s, n);
    vec3 r2 = reflect (-s2, n);
    vec3 r3 = reflect (-s3, n);

    //componente ambiental
    vec3 Ambient = Light.Ambient * Material.Diffuse;
    Ambient += Light2.Ambient * Material.Diffuse;
    Ambient += Light3.Ambient * Material.Diffuse;



    //componente difusa
    vec3 Diffuse = Light.Diffuse * max(dot(s,n), 0.0) * Material.Diffuse;
    Diffuse += Light2.Diffuse * max(dot(s2,n), 0.0) * Material.Diffuse;
    Diffuse += Light3.Diffuse * max(dot(s3,n), 0.0) * Material.Diffuse;




    //componente especular
    vec3 Specular = Light.Diffuse * pow(max(dot(r,v), 0.0), Material.Shininess) * Material.Specular;
    Specular += Light2.Diffuse * pow(max(dot(r2,v), 0.0), Material.Shininess) * Material.Specular;
    Specular += Light3.Diffuse * pow(max(dot(r3,v), 0.0), Material.Shininess) * Material.Specular;  
     
    float bias = max(0.05 * (1.0 - dot(n, s3)), 0.005); 
    float shadow = ShadowCalculation();       
    vec3 lighting = (Ambient + (1.0 - shadow) * (Diffuse + Specular)) * color;

    return lighting;
}

void main(void) {
    gl_FragColor = vec4 (Phong(), 1.0);
}