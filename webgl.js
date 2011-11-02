$(function() {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}
	var width = $(window).width(), height = $(window).height();
	var container = $("body");
	var renderer = new THREE.WebGLRenderer({antialias: true});
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xffffff, 150, 200);
	
	var geometry = new THREE.PlaneGeometry(256, 256, 255, 255);
	geometry.applyMatrix(new THREE.Matrix4().setRotationX(-Math.PI / 2));
	for (var x = 0; x < dem.length; x++) {
		for (var z = 0; z < dem.length; z++) {
			geometry.vertices[x * dem.length + z].position.y = dem[x][z] / 256;
		}
	}
	geometry.computeCentroids();
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	var material = new THREE.MeshLambertMaterial();
	material.fog = true;
	var terrain = new THREE.Mesh(geometry, material);
	terrain.doubleSided = true;
	scene.add(terrain);
	
	var sun = new THREE.DirectionalLight();
	sun.position.set(1, 0.5, 0).normalize();
	//sun.add(new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({color: 0xffff00, fog: false})));
	scene.add(sun);
	
	var camera = new THREE.PerspectiveCamera(60, width / height);
	camera.position.y = 20;
	var control = new THREE.FirstPersonControls(camera);
	control.lookSpeed = 0.1;
	control.movementSpeed = 100;
	scene.add(camera);
	
	renderer.setSize(width, height);
	
	container.append(renderer.domElement);
	
	var gui = new DAT.GUI();
	gui.add(terrain.material.color, "r", 0, 1);
	gui.add(terrain.material.color, "g", 0, 1);
	gui.add(terrain.material.color, "b", 0, 1);
	gui.add(terrain.material, "wireframe");
	
	var stats = new Stats();
	stats.domElement.style.position = "absolute";
	stats.domElement.style.bottom = 0;
	stats.domElement.style.right = 0;
	container.append(stats.domElement);
	
	$("div").hover(function() {control.activeLook = false});
	$("> canvas", container).hover(function() {control.activeLook = true});
	
	frame();
	
	function frame() {
		requestAnimationFrame(frame);
		stats.update();
		control.update(clock.getDelta());
		renderer.render(scene, camera);
	}
});
