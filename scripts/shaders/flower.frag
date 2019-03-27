uniform sampler2D texture;
uniform float     textureCols;
uniform float     textureRows;
uniform vec3      fogColor;
uniform float     fogNear;
uniform float     fogFar;

varying float     vRotation;
varying float     vTextureIndex;

void main() {
  float textureColSize = 1.0 / textureCols;
  float textureRowSize = 1.0 / textureRows;
  float textureCol = floor(mod(vTextureIndex + 0.5, textureCols));
  float textureRow = floor((vTextureIndex + 0.5) / textureCols);
  float drawSize = textureColSize * 0.7;

  vec2 textureCenter = vec2(
    (textureCol + 0.5) * textureColSize,
    (textureRow + 0.5) * textureRowSize
  );

  vec2 pointCoordRotated = vec2(
    cos(vRotation) * (gl_PointCoord.x - 0.5) + sin(vRotation) * (gl_PointCoord.y - 0.5) + 0.5,
    cos(vRotation) * (gl_PointCoord.y - 0.5) - sin(vRotation) * (gl_PointCoord.x - 0.5) + 0.5
  );

  vec2 textureCoord = pointCoordRotated * drawSize + textureCenter - 0.5 * drawSize;
  vec4 textureColor = texture2D(texture, textureCoord);

  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep(fogNear, fogFar, depth);

  gl_FragColor = mix(textureColor, vec4(fogColor, textureColor.w), fogFactor);
}
