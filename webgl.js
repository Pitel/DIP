$(function() {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}
	var width = $(window).width(), height = $(window).height();
	var container = $("body");
	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(width, height);
	container.append(renderer.domElement);
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xffffff, 10000, 12000);
	var lod = new THREE.ChunkedLOD();
	
	//var geometry = new THREE.TerrainGeometry(12000 * 60, dem);
	var worker = new Worker("TerrainWorker.js");
	worker.onmessage = function(event) {
		console.log(event.data);
		var start = new Date();
		var geometry = new THREE.TerrainGeometry(event.data.vertices, event.data.faces);
		console.log(new Date() - start + " ms")
		var material = new THREE.MeshLambertMaterial();
		material.fog = true;
		material.wireframe = true;
		var terrain = new THREE.Mesh(geometry, material);
		lod.addLevel(terrain, 3000);
	}
	worker.postMessage({"edge": 12000 * 60, "dem": dem});
	//geometry = new THREE.TerrainGeometry(1000, [[0, 100, 0], [200, 1000, 300], [0, 500, 0]]);
	//console.log(geometry.vertices.length);
	//material.wireframe = true;
	//terrain.doubleSided = true;
	
	/*
	var level = new THREE.Object3D();
	geometry = new THREE.TerrainGeometry(12000 * 60, dem.tl);
	geometry.applyMatrix(new THREE.Matrix4().setScale(1/120, 1/60, 1/120));
	terrain = new THREE.Mesh(geometry, material);
	terrain.position.x = 12000 / 4;
	terrain.position.z = -12000 / 4;
	level.add(terrain);
	
	geometry = new THREE.TerrainGeometry(12000 * 60, dem.tr);
	geometry.applyMatrix(new THREE.Matrix4().setScale(1/120, 1/60, 1/120));
	terrain = new THREE.Mesh(geometry, material);
	terrain.position.x = 12000 / 4;
	terrain.position.z = 12000 / 4;
	level.add(terrain);
	
	geometry = new THREE.TerrainGeometry(12000 * 60, dem.bl);
	geometry.applyMatrix(new THREE.Matrix4().setScale(1/120, 1/60, 1/120));
	terrain = new THREE.Mesh(geometry, material);
	terrain.position.x = -12000 / 4;
	terrain.position.z = -12000 / 4;
	level.add(terrain);
	
	geometry = new THREE.TerrainGeometry(12000 * 60, dem.br);
	geometry.applyMatrix(new THREE.Matrix4().setScale(1/120, 1/60, 1/120));
	terrain = new THREE.Mesh(geometry, material);
	terrain.position.x = -12000 / 4;
	terrain.position.z = 12000 / 4;
	level.add(terrain);
	
	//console.log(level);
	
	//lod.addLevel(new THREE.Mesh(new THREE.SphereGeometry(1000), material));
	level.visible = false;
	lod.addLevel(level);
	*/
	scene.add(lod);
	
	var sun = new THREE.DirectionalLight();
	sun.position.set(0, 0.5, 1).normalize();
	//sun.add(new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({color: 0xffff00, fog: false})));
	scene.add(sun);
	
	var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 12000);
	camera.position.y = 10000 / 60;
	var control = new THREE.FirstPersonControls(camera, renderer.domElement);
	control.lookSpeed = 0.1;
	control.movementSpeed = 1000;
	scene.add(camera);
	
	/*
	var gui = new dat.GUI();
	//gui.addColor(terrain.material, "color");
	gui.add(terrain.material.color, "r", 0, 1);
	gui.add(terrain.material.color, "g", 0, 1);
	gui.add(terrain.material.color, "b", 0, 1);
	gui.add(terrain.material, "wireframe");
	*/
	
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
		lod.update(camera);
		renderer.render(scene, camera);
	}
});
