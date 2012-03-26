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
	var container = $("body");
	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(width, height);
	container.append(renderer.domElement);
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xffffff, 10000, 12000);
	var grid = new THREE.PlaneGeometry(12000, 12000, 256, 256);
	grid.applyMatrix(new THREE.Matrix4().rotateX(-Math.PI / 2));
	//geometry.computeTangents();
	var lod = new THREE.ChunkedLOD(0, 0, 12000, 12000, 0, 0, grid, 0);
	lod.terrain.visible = true;
	console.log(lod);

	//var geometry = new THREE.TerrainGeometry(12000 * 60, dem);
	/*
	var geometry = new THREE.PlaneGeometry(12000, 12000, 256, 256);
	geometry.applyMatrix(new THREE.Matrix4().rotateX(-Math.PI / 2));
	geometry.computeTangents();
	var shader = THREE.ShaderUtils.lib["normal"];
	shader.uniforms["tDisplacement"].texture = THREE.ImageUtils.loadTexture("tile?w=12000&h=12000&x=0&y=0&r=256", new THREE.UVMapping(), function() {
		//shader.uniforms["tDisplacement"].texture.image.type = THREE.UnsignedShortType;
		//shader.uniforms["tDisplacement"].texture.needsUpdate = true;
		shader.uniforms["tDisplacement"].texture.image.width = 256;
		shader.uniforms["tDisplacement"].texture.image.height = 256;
		//shader.uniforms["tNormal"].texture = new THREE.Texture(THREE.ImageUtils.getNormalMap(shader.uniforms["tDisplacement"].texture.image), 1024);
		//shader.uniforms["tNormal"].texture.needsUpdate = true;
	});
	shader.uniforms["uDisplacementBias"].value = -2048;
	shader.uniforms["uDisplacementScale"].value = 12000;
	var material = new THREE.ShaderMaterial({fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: shader.uniforms, lights: true, wireframe: true});
	material.fog = true;
	//material.wireframe = true;
	var terrain = new THREE.Mesh(geometry, material);
	lod.addLevel(terrain, 3000);

	var level = new THREE.Object3D();

	geometry = new THREE.PlaneGeometry(6000, 6000, 256, 256);
	geometry.applyMatrix(new THREE.Matrix4().rotateX(-Math.PI / 2));
	geometry.computeTangents();
	var newuniforms = THREE.UniformsUtils.clone(shader.uniforms);
	newuniforms["tDisplacement"].texture = THREE.ImageUtils.loadTexture("tile?w=6000&h=6000&x=3000&y=3000&r=256", new THREE.UVMapping(), function() {
		newuniforms["tDisplacement"].texture.image.width = 256;
		newuniforms["tDisplacement"].texture.image.height = 256;
		newuniforms["tNormal"].texture = new THREE.Texture(THREE.ImageUtils.getNormalMap(newuniforms["tDisplacement"].texture.image), 1024);
		newuniforms["tNormal"].texture.needsUpdate = true;
	});
	material = new THREE.ShaderMaterial({fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: newuniforms, lights: true, fog: true, wireframe: true});
	terrain = new THREE.Mesh(geometry, material);
	level.add(terrain);
	*/

	//level.visible = false;
	//lod.addLevel(level)
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
