$(function() {
	var width = 800, height = 600;
	var container = $("body");;
	var renderer = new THREE.WebGLRenderer();
	var scene = new THREE.Scene();
	
	var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}));
	
	scene.addObject(cube);
	
	var camera = new THREE.Camera(60, width/height);
	camera.position.z = 500;
	renderer.setSize(width, height);
	
	container.append(renderer.domElement);
	
	var stats = new Stats();
	stats.domElement.style.position = "absolute";
	stats.domElement.style.bottom = 0;
	stats.domElement.style.right = 0;
	container.append(stats.domElement);
	
	frame(renderer, scene, camera);
	
	function frame() {
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.02;
		stats.update();
		renderer.render(scene, camera);
		requestAnimationFrame(frame);
	}
});
