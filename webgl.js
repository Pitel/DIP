$(function() {
	/*
	var gl = $("canvas").get(0).getContext("experimental-webgl");
	gl.clearColor(1, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	*/
	var container = $("<div>").width(800).height(600);
	var renderer = new THREE.WebGLRenderer();
	var scene = new THREE.Scene();
	
	var mesh = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}));
	
	scene.addObject(mesh);
	
	var camera = new THREE.Camera(60, 800/600, 0.1, 1000);
	camera.position.z = 500;
	renderer.setSize(800, 600);
	
	var stats = new Stats();
	stats.domElement.style.position = "absolute";
	/*
	stats.domElement.style.left = 0;
	stats.domElement.style.top = 0;
	*/
	container.append(stats.domElement);
	
	container.append(renderer.domElement).appendTo("body");
	frame(renderer, scene, camera);
	
	function frame() {
		requestAnimationFrame(frame);
		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.02;
		stats.update();
		renderer.render(scene, camera);
	}
});
