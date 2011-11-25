THREE.TerrainGeometry = function(edge, dem) {
	THREE.Geometry.call(this);
	var start = new Date().getTime();
	
	//Terrain
	var step = edge / (dem.length - 1);
	for (var x = 0; x < dem.length; x++) {
		for (var z = 0; z < dem.length; z++) {
			this.vertices.push(new THREE.Vertex(new THREE.Vector3(
				-x * step + edge / 2,
				dem[x][z],
				z * step - edge / 2
			)));
			
			if (x > 0 && z > 0) {
				var base = z * dem.length + x;
				this.faces.push(new THREE.Face4(
					base - dem.length,
					base - 1 - dem.length,
					base - 1,
					base
				));
			}
		}
	}
	
	//Skirts
	var bottom = -9999;
	var offset = this.vertices.length;
	for (var i = 0; i < dem.length; i++) {	//Zadni
		this.vertices.push(new THREE.Vertex(new THREE.Vector3(
			edge / 2,
			dem[0][i],
			i * step - edge / 2
		)));
		this.vertices.push(new THREE.Vertex(new THREE.Vector3(
			edge / 2,
			bottom,
			i * step - edge / 2
		)));
		if (i > 0) {
			var base = i * 2 + offset;
			this.faces.push(new THREE.Face4(
				base,
				base + 1,
				base - 1,
				base - 2
			));
		}
		
	}
	
	offset = this.vertices.length;
	for (var i = 0; i < dem.length; i++) {	//Predni
		this.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-edge / 2,
			dem[dem.length - 1][i],
			i * step - edge / 2
		)));
		this.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-edge / 2,
			bottom,
			i * step - edge / 2
		)));
		if (i > 0) {
			var base = i * 2 + offset;
			this.faces.push(new THREE.Face4(
				base - 2,
				base - 1,
				base + 1,
				base
			));
		}
	}
	
	offset = this.vertices.length;
	for (var i = 0; i < dem.length; i++) {	//Leva
		this.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-i * step + edge / 2,
			dem[i][0],
			-edge / 2
		)));
		this.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-i * step + edge / 2,
			bottom,
			-edge / 2
		)));
		if (i > 0) {
			var base = i * 2 + offset;
			this.faces.push(new THREE.Face4(
				base - 2,
				base - 1,
				base + 1,
				base
			));
		}
	}
	
	offset = this.vertices.length;
	for (var i = 0; i < dem.length; i++) {	//Prava
		this.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-i * step + edge / 2,
			dem[i][dem.length - 1],
			edge / 2
		)));
		this.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-i * step + edge / 2,
			bottom,
			edge / 2
		)));
		if (i > 0) {
			var base = i * 2 + offset;
			this.faces.push(new THREE.Face4(
				base,
				base + 1,
				base - 1,
				base - 2
			));
		}
	}
	//console.log(this.faces);
	
	//this.mergeVertices();	//This doubles generation time!
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
	
	var end = new Date().getTime();
	console.debug("Terrain generation: " + (end - start) + "ms");
};

THREE.TerrainGeometry.prototype = new THREE.Geometry();
THREE.TerrainGeometry.prototype.constructor = THREE.TerrainGeometry;
