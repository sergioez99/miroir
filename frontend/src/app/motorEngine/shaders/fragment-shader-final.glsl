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

varying highp vec2 vTextureCoord;
varying highp vec3 vNormal;
varying highp vec3 vPosition;

uniform sampler2D uSampler;

uniform sampler2D u_ShadowMap; //Textura proyectada que será la sombra

varying vec4 v_PositionFromLight; //Coordenadas de donde estará proyectada la sombra

//funcion que calcula el modelo de reflexion de Phong
vec3 Phong() {
    vec3 n  = normalize(vNormal);
    //distancia de la luz al vector (y dirección)
    vec3 s = normalize(Light.Position - vPosition);
    vec3 s2 = normalize(Light2.Position - vPosition);
    vec3 v = normalize(vec3 (-vPosition));
    vec3 r = reflect (-s, n);
    vec3 r2 = reflect (-s2, n);

    //componente ambiental
    //vec3 Ambient = Light.Ambient * vec3(texture2D(Material.Diffuse, vTextureCoord));
    vec3 Ambient = Light.Ambient * Material.Diffuse;
    Ambient += Light2.Ambient * Material.Diffuse;
    //vec3 Ambient = Light.Ambient;
    //vec3 Ambient = vec3(0.0,0.0,0.0);



    //componente difusa
    //vec3 Diffuse = Light.Diffuse * max(dot(s,n), 0.0) * vec3(texture2D(Material.Diffuse, vTextureCoord));
    vec3 Diffuse = Light.Diffuse * max(dot(s,n), 0.0) * Material.Diffuse;
    Diffuse += Light2.Diffuse * max(dot(s2,n), 0.0) * Material.Diffuse;
    //vec3 Diffuse = Light.Diffuse;
    //vec3 Diffuse = vec3(0.0,0.0,0.0);



    //componente especular
    //vec3 Specular = Light.Specular * pow(max(dot(r,v), 0.0), Material.Shininess) * vec3(texture2D(Material.Specular, vTextureCoord));
    vec3 Specular = Light.Diffuse * pow(max(dot(r,v), 0.0), Material.Shininess) * Material.Specular;
    Specular += Light2.Diffuse * pow(max(dot(r2,v), 0.0), Material.Shininess) * Material.Specular;
    //vec3 Specular = Light.Specular;
    //vec3 Specular = vec3(0.0,0.0,0.0);


    return Ambient + Diffuse + Specular;
}

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w);
    ///2.0 + 0.5; (esto iba despues de la division)
    shadowCoord = shadowCoord * 0.5 + 0.5;

    float closestDepth = texture2D(u_ShadowMap, shadowCoord.xy).r;
    float currentDepth = shadowCoord.z;
    float shadow = currentDepth > closestDepth  ? 1.0 : 0.0;

    vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);

    float depth = rgbaDepth.r;// Retrieve the z-value from R

    float visibility = (shadowCoord.z > depth + 0.005) ? 0.7 : 1.0;

    gl_FragColor = vec4 (texelColor.rgb * Phong() * visibility, 1.0);
    //gl_FragColor = vec4 (texelColor.rgb * Phong(), 1.0);
    vec3 lightning = Phong();
    lightning = (lightning.x + (1.0 - shadow) * (lightning.y + lightning.z)) * texelColor.rgb;
    //gl_FragColor = vec4(lightning, 1.0);

    //float depthValue = texture2D(u_ShadowMap, vTextureCoord).r;
    //gl_FragColor = vec4(vec3(depthValue), 1.0);
}
