attribute float aFrequency;
attribute float aRadian;

uniform float uRadius;
uniform float uTick;


varying vec2 vUv;
varying vec3 vPos;
varying float vFrequency;


const float PI = 3.1415926;


mat2 calcRotate2D(float _time){
  float _sin = sin(_time);
  float _cos = cos(_time);
  return mat2(_cos, _sin, -_sin, _cos);
}


void main(){
  vUv =  uv;
  vFrequency = min(10.0, aFrequency);

  float time = uTick * 0.005;

  vec3 offset = vec3(cos(aRadian), sin(aRadian), 0.0) * uRadius;

  vec3 _position = position - offset;

  _position *= (1.0 + aFrequency);

  _position -= offset;

  _position.xy = calcRotate2D(time * 1.2) * _position.xy;



  vec4 mvPos = vec4(_position, 1.0);

  mvPos = modelViewMatrix * mvPos;

  vPos = mvPos.xyz;

  gl_Position =projectionMatrix * mvPos;
}