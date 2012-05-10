var fov = 60;

$(function() {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}
	$.getJSON("info.json", function(deminfo) {
		deminfo.w--;
		deminfo.h--;
		//console.log(deminfo);
		var width = $(window).width(), height = $(window).height();
		THREE.K = width / (2 * Math.tan((fov * Math.PI) / 360));
		THREE.tau = 3;
		var container = $("body");
		var renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(width, height);
		container.append(renderer.domElement);
		THREE.anaglyph = false;
		var effect = new THREE.AnaglyphEffect(renderer);
		effect.setSize(width, height);
		var clock = new THREE.Clock();
		var scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xffffff, Math.min(deminfo.w, deminfo.h) * 0.8, Math.min(deminfo.w, deminfo.h));

		var grid = new THREE.PlaneGeometry(deminfo.w, deminfo.h, 255, 255);
		grid.applyMatrix(new THREE.Matrix4().rotateY(-Math.PI / 2));
		grid.computeTangents();
		THREE.uDisplacementBias = -9999/4;
		THREE.uDisplacementScale = 0xff/4;
		THREE.uNormalScale = 1;
		THREE.LODwireframe = false;
		var lod = new THREE.ChunkedLOD(0, 0, deminfo.w, deminfo.h, 0, 0, grid, 0);
		//lod.terrain.visible = true;
		//console.log(lod);
		scene.add(lod);

		var reference = new THREE.Mesh(THREE.GeometryUtils.clone(grid), new THREE.MeshBasicMaterial({color: 0xff0000, fog: false, wireframe: true}));
		reference.visible = false;
		scene.add(reference);	//Calibartion grid

		var sun = new THREE.DirectionalLight();
		sun.position.set(0, 0.5, 1).normalize();
		//sun.add(new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({color: 0xffff00, fog: false})));
		scene.add(sun);

		var camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, Math.sqrt(Math.pow(deminfo.w, 2) + Math.pow(deminfo.h, 2)));
		camera.position.y = 10000 / 60;
		var control = new THREE.MyFirstPersonControls(camera, renderer.domElement);
		control.lookSpeed = 0.1;
		control.movementSpeed = 1000;
		scene.add(camera);

		/*
		var path = "skybox/";
		var format = '.jpg';
		var reflectionCube = THREE.ImageUtils.loadTextureCube([path + 'px' + format, path + 'nx' + format, path + 'py' + format, path + 'ny' + format, path + 'pz' + format, path + 'nz' + format]);
		reflectionCube.format = THREE.RGBFormat;
		var skyshader = THREE.ShaderUtils.lib["cube"];
		skyshader.uniforms["tCube"].texture = reflectionCube;
		var skymesh = new THREE.Mesh(new THREE.CubeGeometry(1000, 1000, 1000), new THREE.ShaderMaterial({fragmentShader: skyshader.fragmentShader, vertexShader: skyshader.vertexShader, uniforms: skyshader.uniforms, depthWrite: false}));
		skymesh.flipSided = true;
		scene.add(skymesh);
		*/

		var gui = new dat.GUI();
		gui.add(THREE, "tau", 0, 10).name("τ");
		var wirectrl = gui.add(THREE, "LODwireframe");
		wirectrl.name("Wireframe");
		wirectrl.onFinishChange(function() {
			lod.wireframe();
		});
		gui.add(THREE, "anaglyph").name("Anaglyph 3D");
		gui.add(reference, "visible").name("Reference grid");
		var displacementgui = gui.addFolder("Displacement");
		var displacementbias = displacementgui.add(THREE, "uDisplacementBias");
		displacementbias.name("Bias");
		displacementbias.onChange(function() {
			lod.displacement();
		});
		var displacementscale = displacementgui.add(THREE, "uDisplacementScale");
		displacementscale.name("Scale");
		displacementscale.onChange(function() {
			lod.displacement();
		});
		var normalscale = displacementgui.add(THREE, "uNormalScale", 0, 2);
		normalscale.name("Normal");
		normalscale.onChange(function() {
			lod.displacement();
		});

		var stats = new Stats();
		stats.domElement.style.position = "absolute";
		stats.domElement.style.bottom = 0;
		stats.domElement.style.right = 0;
		container.append(stats.domElement);

		$("div").hover(function() {control.activeLook = false});
		$("> canvas", container).hover(function() {control.activeLook = true});

		//lod.update(camera);
		frame();

		function frame() {
			requestAnimationFrame(frame);
			stats.update();
			control.update(clock.getDelta());
			lod.update(camera);
			//skymesh.position = camera.position;
			if (THREE.anaglyph) {
				effect.render(scene, camera);
			} else {
				renderer.render(scene, camera);
			}
		}
	});
});
