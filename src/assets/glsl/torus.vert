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


mat4 quaternion(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle / 2.0);
  float c = cos(angle / 2.0);
  vec4 q;
  vec4 q2;

  q.x = axis.x * s;
  q.y = axis.y * s;
  q.z = axis.z * s;
  q.w = c;

  q2.x = pow(q.x, 2.0);
  q2.y = pow(q.y, 2.0);
  q2.z = pow(q.z, 2.0);
  q2.w = pow(q.w, 2.0);

  return mat4(
    q2.x + q2.y - q2.z - q2.w,      2.0 * (q.y * q.z + q.x * q.w),  2.0 * (q.y * q.w - q.x * q.z), 0.0,
    2.0 * (q.y * q.z - q.x * q.w),  q2.x - q2.y + q2.z - q2.w,      2.0 * (q.z * q.w + q.x * q.y), 0.0, 
    2.0 * (q.y * q.w + q.x * q.z),  2.0 * (q.z * q.w - q.x * q.y),  q2.x - q2.y - q2.z + q2.w,     0.0,
    0.0,                            0.0,                            0.0,                           1.0
  );
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


  vec4 mvPos = quaternion(vec3(1.0, -0.8, 0), PI / 1.5) * vec4(_position, 1.0);

  mvPos = modelViewMatrix * mvPos; 

  vPos = mvPos.xyz;

  gl_Position =projectionMatrix * mvPos;
}