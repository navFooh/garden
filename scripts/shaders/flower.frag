uniform sampler2D textures[3];
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
varying float vRotation;
varying float vTexIndex;

void main() {
  float mid = 0.5;
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep( fogNear, fogFar, depth );
  vec2 rotated = vec2(
    cos(vRotation) * (gl_PointCoord.x - mid) + sin(vRotation) * (gl_PointCoord.y - mid) + mid,
    cos(vRotation) * (gl_PointCoord.y - mid) - sin(vRotation) * (gl_PointCoord.x - mid) + mid
  );
  if     (vTexIndex < 0.5) gl_FragColor = texture2D(textures[0], rotated);
  else if(vTexIndex < 1.5) gl_FragColor = texture2D(textures[1], rotated);
  else                     gl_FragColor = texture2D(textures[2], rotated);
  gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
}
