attribute float size;
attribute float rotation;
attribute float texIndex;
varying float vRotation;
varying float vTexIndex;

void main() {
  vRotation = rotation;
  vTexIndex = texIndex;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / length(mvPosition.xyz));
  gl_Position = projectionMatrix * mvPosition;
}
