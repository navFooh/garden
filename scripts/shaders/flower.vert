attribute float size;
attribute float scale;
attribute float rotation;
attribute float textureIndex;

varying float vRotation;
varying float vTextureIndex;

void main() {
  vRotation = rotation;
  vTextureIndex = textureIndex;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = size * scale * (300.0 / length(mvPosition.xyz));
  gl_Position = projectionMatrix * mvPosition;
}
