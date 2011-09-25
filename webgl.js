$(function() {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}
	var width = $(window).width(), height = $(window).height();
	var container = $("body");
	var renderer = new THREE.WebGLRenderer({antialias: true});
	var scene = new THREE.Scene();
	
	var ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 200, 200), new THREE.MeshBasicMaterial({color: 0, wireframe: true}));
	ground.rotation.x = Math.PI/2;	//Normals up?
	
	scene.add(ground);
	
	var camera = new THREE.FirstPersonCamera({
		fov: 60,
		aspect: width/height,
		lookSpeed: 0.1,
		movementSpeed: 1000
	});
	camera.position.y = 200;
	renderer.setSize(width, height);
	
	container.append(renderer.domElement);
	
	var gui = new DAT.GUI();
	gui.add(ground.materials[0].color, "r", 0, 1);
	gui.add(ground.materials[0].color, "g", 0, 1);
	gui.add(ground.materials[0].color, "b", 0, 1);
	
	var stats = new Stats();
	stats.domElement.style.position = "absolute";
	stats.domElement.style.bottom = 0;
	stats.domElement.style.right = 0;
	container.append(stats.domElement);
	
	$(":not(> canvas)", container).hover(function() {camera.activeLook = false});
	$("> canvas", container).hover(function() {camera.activeLook = true});
	
	frame();
	
	function frame() {
		requestAnimationFrame(frame);
		stats.update();
		renderer.render(scene, camera);
	}
});
