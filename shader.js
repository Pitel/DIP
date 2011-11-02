vertexShader = [
"uniform float phase;",
"varying vec3 vLightWeighting;",
THREE.ShaderChunk["lights_lambert_pars_vertex"],

"void main() {",
	"float y = 50.0 * (sin(position.x / 50.0 + phase) + sin(position.z / 50.0 + phase));",
	"vec4 mvPosition = modelViewMatrix * vec4(position.x, y, position.z, 1);",
	"vec3 transformedNormal = normalize(normalMatrix * normal);",
	THREE.ShaderChunk["lights_lambert_vertex"],
	"gl_Position = projectionMatrix * mvPosition;",
"}"
].join("\n");
