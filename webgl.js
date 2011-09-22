$(function() {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	} else {
		var width = $(window).width(), height = $(window).height();
		var container = $("body");
		var renderer = new THREE.WebGLRenderer({antialias: true});
		var scene = new THREE.Scene();
		
		var ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 200, 200), new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}));
		ground.rotation.x = Math.PI/2;	//Normals up?
		
		scene.add(ground);
		
		var camera = new THREE.FirstPersonCamera({
			fov: 60,
			aspect: width/height,
			lookSpeed: 0.1,
			movementSpeed: 1000,
			noFly: false
		});
		camera.position.y = 200;
		renderer.setSize(width, height);
		
		container.append(renderer.domElement);
		
		var stats = new Stats();
		stats.domElement.style.position = "absolute";
		stats.domElement.style.bottom = 0;
		stats.domElement.style.right = 0;
		container.append(stats.domElement);
		
		frame();
		
		function frame() {
			stats.update();
			renderer.render(scene, camera);
			requestAnimationFrame(frame);
		}
	}
});
