$(function() {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}
	var width = $(window).width(), height = $(window).height();
	var container = $("body");
	var renderer = new THREE.WebGLRenderer({antialias: true});
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xffffff, 1500, 2000);
	
	var geometry = new THREE.PlaneGeometry(2000, 2000, 200, 200);
	//var material = new THREE.MeshLambertMaterial();
	var material = new THREE.ShaderMaterial(THREE.ShaderLib.lambert);
	material.lights = true;
	material.fog = true;
	material.wireframe = true;
	material.uniforms.phase = {type: "f", value: 0};
	var terrain = new THREE.Mesh(geometry, material);
	terrain.rotation.x = -Math.PI / 2;
	material.vertexShader = vertexShader;
	scene.add(terrain);
	
	var sun = new THREE.DirectionalLight();
	sun.position.y = 1000;
	sun.position.z = 1000;
	sun.add(new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({color: 0xffff00, fog: false})));
	scene.add(sun);
	
	var camera = new THREE.PerspectiveCamera(60, width / height);
	camera.position.y = 200;
	var control = new THREE.FirstPersonControls(camera);
	control.lookSpeed = 0.1;
	control.movementSpeed = 1000;
	scene.add(camera);
	
	renderer.setSize(width, height);
	
	container.append(renderer.domElement);
	
	var gui = new DAT.GUI();
	gui.add(terrain.material.uniforms.diffuse.value, "r", 0, 1);
	gui.add(terrain.material.uniforms.diffuse.value, "g", 0, 1);
	gui.add(terrain.material.uniforms.diffuse.value, "b", 0, 1);
	//gui.add(terrain.materials[0].uniforms.phase, "value", 0, Math.PI * 2).name("phase");
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
		terrain.material.uniforms.phase.value += 0.05;
		renderer.render(scene, camera);
	}
});
