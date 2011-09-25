vertexShader = [
"uniform float phase;",

"void main() {",
	"float z = 50.0 * sin(position.y / 50.0 + phase);",
	"gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, z, 1);",
"}"
].join("\n");
