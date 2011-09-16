$(function() {
	var gl = $("canvas").get(0).getContext("experimental-webgl");
	gl.clearColor(1, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
});
