THREE.ChunkedLOD = function(x1, y1, x2, y2, shiftx, shifty, grid, level) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.grid = grid;
	this.level = level;
	var w = Math.abs(x1 - x2), h = Math.abs(y1 - y2);
	this.w = w;
	this.h = h;
	this.delta = w / 1000;
	//console.log("LOD", level, x1, y1, x2, y2, shiftx, shifty);
	THREE.Object3D.call(this);
	this.position.x += shiftx;
	this.position.z += shifty;
	//this.position.y = 300 * level + Math.random() * 150;	//For debuging,
	//console.log(w, h);
	var shader = THREE.ShaderUtils.lib["normal"];
	var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
	var _this = this;
	uniforms["tDisplacement"].texture = THREE.ImageUtils.loadTexture("chunk/" + level + "_" + x1 + "_" + y1 + "_" + w + "_" + h + "_256.png", new THREE.UVMapping(), function() {	//Load texture and create basic terrain when it's loaded
		/*
		uniforms["tDisplacement"].texture.type = THREE.UnsignedShortType;
		uniforms["tDisplacement"].texture.needsUpdate = true;
		*/
		uniforms["tDisplacement"].texture.image.width = 256;
		uniforms["tDisplacement"].texture.image.height = 256;

		// Calculate normal map in worker
		var canvas = document.createElement("canvas");
		canvas.width = uniforms["tDisplacement"].texture.image.width;
		canvas.height = uniforms["tDisplacement"].texture.image.height;
		var context = canvas.getContext("2d");
		context.drawImage(uniforms["tDisplacement"].texture.image, 0, 0);
		var worker = new Worker('NormalWorker.js');
		worker.onmessage = function(e) {	//Normals are calculated
			context.putImageData(e.data, 0, 0);
			uniforms["tNormal"].texture = new THREE.Texture(canvas);
			uniforms["tNormal"].texture.needsUpdate = true;
			uniforms["uNormalScale"].value = 8;
			uniforms["uDisplacementBias"].value = THREE.uDisplacementBias;
			uniforms["uDisplacementScale"].value = THREE.uDisplacementScale;
			/*
			uniforms["enableDiffuse"].value = true;
			uniforms["tDiffuse"].texture = uniforms["tDisplacement"].texture;
			*/
			uniforms["uDiffuseColor"].value.setHex(Math.random() * 0xffffff);	//Random chunk color
			_this.terrain = new THREE.Mesh(grid, new THREE.ShaderMaterial({fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, wireframe: THREE.LODwireframe, fog: true}));
			var scale = 1 / Math.pow(2, level);
			_this.terrain.scale = new THREE.Vector3(scale, scale, scale);
			_this.terrain.visible = false;
			_this.add(_this.terrain);
		};
		var dem = context.getImageData(0, 0, canvas.width, canvas.height);
		worker.postMessage({dem: dem, normal: context.createImageData(canvas.width, canvas.height)});
	});

};

THREE.ChunkedLOD.prototype = new THREE.Object3D();
THREE.ChunkedLOD.prototype.constructor = THREE.ChunkedLOD;
THREE.ChunkedLOD.prototype.supr = THREE.Object3D.prototype;

THREE.ChunkedLOD.prototype.update = function(camera) {
	if (!this.terrain) {
		//console.log("wait");
		return;
	}
	var rho = (this.delta * THREE.K) / this.matrixWorld.getPosition().distanceTo(camera.position);
	//console.log(this.delta, rho, THREE.tau);
	//console.log(this.delta, this.worldpos.distanceTo(camera.position));
	var rdy = -1;
	if (this.LODs) {	//Are all chunks ready?
		rdy = 0;
		for (var i = 0; i < this.LODs.children.length; i++) {
			if (this.LODs.children[i].terrain) {
				rdy++;
			}
		}
	}
	if (rho <= THREE.tau || (rdy > 0 && rdy != 4)) {	//Display base terrain, when rho <= tau, or chunks are not ready
		this.terrain.visible = true;
		if (this.LODs) {
			THREE.SceneUtils.showHierarchy(this.LODs, false);
		}
	} else {	//Display chunks
		if (!this.LODs) {	//chunks tiles when needed
			//console.log("Loading level " + (this.level + 1));
			this.terrain.visible = true;
			this.LODs = new THREE.Object3D();
			//if (level < 2) {	//DEBUG
			if (this.w / 2 > 256 && this.h / 2 > 256) {
				var halfx = Math.round(this.x1 + this.w / 2), halfy = Math.round(this.y1 + this.h / 2);
				this.LODs.add(new THREE.ChunkedLOD(this.x1, this.y1, halfx, halfy, -this.w / 4, +this.h / 4, this.grid, this.level + 1));
				this.LODs.add(new THREE.ChunkedLOD(halfx, this.y1, this.x2, halfy, +this.w / 4, +this.h / 4, this.grid, this.level + 1));
				this.LODs.add(new THREE.ChunkedLOD(this.x1, halfy, halfx, this.y2, -this.w / 4, -this.h / 4, this.grid, this.level + 1));
				this.LODs.add(new THREE.ChunkedLOD(halfx, halfy, this.x2, this.y2, +this.w / 4, -this.h / 4, this.grid, this.level + 1));
				this.add(this.LODs);
			}
			//}
		} else {
			if (rdy == 4) {	//Chunks are really ready
				this.terrain.visible = false;
				for (var i = 0; i < this.LODs.children.length; i++) {
					this.LODs.children[i].update(camera);
				}
			} else {	//Chunks are loading
				this.terrain.visible = true;
				THREE.SceneUtils.showHierarchy(this.LODs, false);
			}
		}
	}
};

THREE.ChunkedLOD.prototype.wireframe = function() {
	//console.log(this);
	if (this.terrain) {
		this.terrain.material.wireframe = THREE.LODwireframe;
		if (this.LODs) {
			for (var i = 0; i < this.LODs.children.length; i++) {
				this.LODs.children[i].wireframe();
			}
		}
	}
};

THREE.ChunkedLOD.prototype.displacement = function() {
	//console.log(this);
	if (this.terrain) {
		this.terrain.material.uniforms.uDisplacementBias.value = THREE.uDisplacementBias;
		this.terrain.material.uniforms.uDisplacementScale.value = THREE.uDisplacementScale;
		if (this.LODs) {
			for (var i = 0; i < this.LODs.children.length; i++) {
				this.LODs.children[i].displacement();
			}
		}
	}
};
