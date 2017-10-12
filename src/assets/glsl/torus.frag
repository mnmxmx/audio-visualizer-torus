varying vec2 vUv;
varying vec3 vPos;
varying float vFrequency;

const vec3 objColor = vec3(1.0);

const vec3 hemiLight_g_1 = #e50061;
const vec3 hemiLight_s_1 = #efcb03;
const vec3 hemiLight_g_2 = #a20b79;
const vec3 hemiLight_s_2 = #a20b24;


const vec3 dirLight = vec3(0.2);
const vec3 dirLight_2 = vec3(0.15);


const vec3 hemiLightPos_1 = vec3(1.0, 0.0, -1.0);
const vec3 hemiLightPos_2 = vec3(-0.5, 0.5, 1.0);


const vec3 dirLightPos = vec3(-30, 50, 50);
const vec3 dirLightPos_2 = vec3(30, -50, -50);


vec3 calcIrradiance_hemi(vec3 newNormal, vec3 lightPos, vec3 grd, vec3 sky){
  float dotNL = dot(newNormal, normalize(lightPos));
  float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

  return mix(grd, sky, hemiDiffuseWeight);
}

vec3 calcIrradiance_dir(vec3 newNormal, vec3 lightPos, vec3 light){
  float dotNL = dot(newNormal, normalize(lightPos));

  return light * max(0.0, dotNL);
}


void main(){

  vec3 _normal = normalize( cross(dFdx(vPos), dFdy(vPos)) );

  vec3 hemiColor = vec3(0.0);
  hemiColor += calcIrradiance_hemi(_normal, hemiLightPos_1, hemiLight_g_1, hemiLight_s_1) * 0.7;
  hemiColor += calcIrradiance_hemi(_normal, hemiLightPos_2, hemiLight_g_2, hemiLight_s_2) * 0.8;
  
  vec3 dirColor = vec3(0.0);
  dirColor += calcIrradiance_dir(_normal, dirLightPos, dirLight);
  dirColor += calcIrradiance_dir(_normal, dirLightPos_2, dirLight_2);


  vec3 color = objColor * hemiColor;
  
  color += dirColor;

  vec3 offsetColor = vec3(vFrequency * 0.2, vFrequency * 1.5, -vFrequency * 0.7) * 0.008;

  color += offsetColor;
  color.g = min(0.9, color.g);

  color.r = (color.g == 0.9 && color.r > 0.94) ? 0.94 : color.r;

  color = min(vec3(1.0), color);

  float colorOffset = min(0.0, (vPos.x + vPos.y) / 2000.0);
  color -= vec3(colorOffset) * vec3(-0.3, -1.0, 1.2);


  gl_FragColor = vec4(color + 0.1, 0.95);
}