vertexShader = [
"uniform float phase;",
"varying vec3 vLightWeighting;",
THREE.ShaderChunk["lights_pars_vertex"],

"void main() {",
	"float z = 50.0 * sin(position.y / 50.0 + phase);",
	"vec4 mvPosition = modelViewMatrix * vec4(position.x, position.y, z, 1);",
	"vec3 transformedNormal = normalize(normalMatrix * normal);",
	THREE.ShaderChunk["lights_vertex"],
	"gl_Position = projectionMatrix * mvPosition;",
"}"
].join("\n");
