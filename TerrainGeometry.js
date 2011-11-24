THREE.TerrainGeometry = function(edge, dem) {
	THREE.Geometry.call(this);
	
	var step = edge / (dem.length - 1);
	console.log(step);
	
	for (var z = 0; z < dem.length; z++) {
		for (var x = 0; x < dem.length; x++) {
			this.vertices.push(new THREE.Vertex(new THREE.Vector3(-x * step + edge, dem[x][z], z * step)));
			
			if (x > 0 && z > 0) {
				this.faces.push(new THREE.Face4(
					x * dem.length + z,
					x * dem.length + z - 1,
					(x - 1) * dem.length + z - 1,
					(x - 1) * dem.length + z
				));
			}
		}
	}
	
	this.computeFaceNormals();
	this.computeVertexNormals();
	/*
	<mrdoob> if you're using CanvasRenderer you need computeCentroids
	<mrdoob> if your object is going to be rendered with FlatShading you need computeFaceNormals
	<mrdoob> if your object is going to be rendered with SmoothShading your object needs computeVertexNormals
	<Pitel> mrdoob: all those boundning spheres and cubes are just for physics?
	<mrdoob> or raycasting
	<mrdoob> (object picking)
	*/
};

THREE.TerrainGeometry.prototype = new THREE.Geometry();
THREE.TerrainGeometry.prototype.constructor = THREE.TerrainGeometry;
