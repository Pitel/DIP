var fov = 60;

function loadDEM(path, mapping, callback) {
	var image = new Image(), texture = new THREE.Texture(image, mapping);
	texture.type = THREE.UnsignedShortType;
	image.onload = function() {
		texture.needsUpdate = true;
		if (callback) {
			callback(this);
		}
	}
	image.crossOrigin = "anonymous";
	image.src = path;
	return texture;
}

$(function() {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}
	var width = $(window).width(), height = $(window).height();
	THREE.K = width / (2 * Math.tan((fov * Math.PI) / 360));
	THREE.tau = 2;
	var container = $("body");
	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(width, height);
	container.append(renderer.domElement);
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	//scene.fog = new THREE.Fog(0xffffff, 10000, 12000);
	var grid = new THREE.PlaneGeometry(12000, 12000, 256, 256);
	grid.computeTangents();
	var lod = new THREE.ChunkedLOD(0, 0, 12000, 12000, 0, 0, grid, 0);
	//lod.terrain.visible = true;
	//console.log(lod);
	scene.add(lod);

	var sun = new THREE.DirectionalLight();
	sun.position.set(0, 0.5, 1).normalize();
	//sun.add(new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({color: 0xffff00, fog: false})));
	scene.add(sun);

	var camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 12000);
	camera.position.y = 10000 / 60;
	var control = new THREE.FirstPersonControls(camera, renderer.domElement);
	control.lookSpeed = 0.1;
	control.movementSpeed = 1000;
	scene.add(camera);

	var gui = new dat.GUI();
	gui.add(THREE, "tau", 0, 10);

	var stats = new Stats();
	stats.getDomElement().style.position = "absolute";
	stats.getDomElement().style.bottom = 0;
	stats.getDomElement().style.right = 0;
	container.append(stats.getDomElement());

	$("div").hover(function() {control.activeLook = false});
	$("> canvas", container).hover(function() {control.activeLook = true});

	//lod.update(camera);
	frame();

	function frame() {
		requestAnimationFrame(frame);
		stats.update();
		control.update(clock.getDelta());
		lod.update(camera);
		renderer.render(scene, camera);
	}
});
