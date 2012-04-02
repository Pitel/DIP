THREE.ChunkedLOD = function(x1, y1, x2, y2, shiftx, shifty, grid, level) {
	//console.log("LOD", level, x1, y1, x2, y2, shiftx, shifty);
	var w = Math.abs(x1 - x2), h = Math.abs(y1 - y2);
	this.delta = w / 1000;
	//console.log("LOD", level, x1, y1, x2, y2, shiftx, shifty);
	THREE.Object3D.call(this);
	this.position.x += shiftx;
	this.position.z += shifty;
	//this.position.y = 300 * level + Math.random() * 150;	//For debuging,
	//console.log(w, h);
	this.terrain = new THREE.Mesh(grid, new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, fog: false, wireframe: false}));
	var scale = 1 / Math.pow(2, level);
	this.terrain.scale = new THREE.Vector3(scale, scale, scale);
	this.terrain.visible = false;
	this.add(this.terrain);
	this.LODs = new THREE.Object3D();
	if (w / 2 > 256 && h / 2 > 256) {
		var halfx = x1 + w / 2, halfy = y1 + h / 2;
		this.LODs.add(new THREE.ChunkedLOD(x1, y1, halfx, halfy, -w / 4, +h / 4, grid, level + 1));
		this.LODs.add(new THREE.ChunkedLOD(halfx, y1, x2, halfy, +w / 4, +h / 4, grid, level + 1));
		this.LODs.add(new THREE.ChunkedLOD(x1, halfy, halfx, y2, -w / 4, -h / 4, grid, level + 1));
		this.LODs.add(new THREE.ChunkedLOD(halfx, halfy, x2, y2, +w / 4, -h / 4, grid, level + 1));
		this.add(this.LODs);
	}
};

THREE.ChunkedLOD.prototype = new THREE.Object3D();
THREE.ChunkedLOD.prototype.constructor = THREE.ChunkedLOD;
THREE.ChunkedLOD.prototype.supr = THREE.Object3D.prototype;

THREE.ChunkedLOD.prototype.update = function(camera) {
	var rho = (this.delta * THREE.K) / this.matrixWorld.getPosition().distanceTo(camera.position);
	//console.log(this.delta, rho, THREE.tau);
	//console.log(this.delta, this.worldpos.distanceTo(camera.position));
	if (rho <= THREE.tau || this.LODs.children.length != 4) {
		this.terrain.visible = true;
		THREE.SceneUtils.showHierarchy(this.LODs, false);
	} else {
		this.terrain.visible = false;
		for (var i = 0; i < this.LODs.children.length; i++) {
			//this.LODs.children[i].terrain.visible = true;
			this.LODs.children[i].update(camera);
		}
	}
};
