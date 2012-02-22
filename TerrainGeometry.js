THREE.TerrainGeometry = function(vertices, faces) {
	THREE.Geometry.call(this);
	
	/*
	console.log(vertices[0]);
	console.log(faces[0]);
	*/
	
	this.vertices = new Array(vertices.length)
	for (var i = 0; i < vertices.length; i++) {
		var vertex = vertices[i];
		this.vertices[i] = new THREE.Vertex(new THREE.Vector3(vertex[0], vertex[1], vertex[2]));
	}
	
	this.faces = new Array(faces.length)
	for (var i = 0; i < faces.length; i++) {
		var face = faces[i];
		this.faces[i] = new THREE.Face4(face[0], face[1], face[2], face[3]);
	}
};

THREE.TerrainGeometry.prototype = new THREE.Geometry();
THREE.TerrainGeometry.prototype.constructor = THREE.TerrainGeometry;
