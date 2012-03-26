THREE.ChunkedLOD = function(x1, y1, x2, y2, shiftx, shifty, grid) {
	//console.log("LOD");
	var w = Math.abs(x1 - x2), h = Math.abs(y1 - y2);
	if (w < 6000 || h < 6000) {
		return;
	}
	THREE.Object3D.call(this);
	this.position.x = shiftx;
	this.position.z = shifty;
	console.log(w, h);
	this.terrain = new THREE.Mesh(grid, new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, fog: true, wireframe: true}));
	this.terrain.visible = false;
	this.add(this.terrain);
	var halfx = x1 + w / 2, halfy = y1 + h / 2;
	var scaledgrid = THREE.GeometryUtils.clone(grid);
	scaledgrid.applyMatrix(new THREE.Matrix4().setScale(0.5, 0.5, 0.5));
	this.LODs = [
		new THREE.ChunkedLOD(x1, y1, halfx, halfy, this.position.x - halfx / 2, this.position.z + halfy / 2, scaledgrid),
		new THREE.ChunkedLOD(halfx, y1, x2, halfy, this.position.x + halfx / 2, this.position.z + halfy / 2, scaledgrid),
		new THREE.ChunkedLOD(x1, halfy, halfx, y2, this.position.x - halfx / 2, this.position.z - halfy / 2, scaledgrid),
		new THREE.ChunkedLOD(halfx, halfy, x2, y2, this.position.x + halfx / 2, this.position.z - halfy / 2, scaledgrid)
	];
	for (var i = 0; i < this.LODs.length; i++) {
		this.add(this.LODs[i]);
	}
};

THREE.ChunkedLOD.prototype = new THREE.Object3D();
THREE.ChunkedLOD.prototype.constructor = THREE.ChunkedLOD;
THREE.ChunkedLOD.prototype.supr = THREE.Object3D.prototype;

THREE.ChunkedLOD.prototype.update = function(camera) {
	this.terrain.visible = false;
	for (var i = 0; i < this.LODs.length; i++) {
		this.LODs[i].terrain.visible = true;
	}
};
