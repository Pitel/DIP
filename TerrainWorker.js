window = {};	//To make Three.js happy

importScripts("Three.js");

onmessage = function(event) {
	var edge = event.data.edge, dem = event.data.dem;
	var geometry = new THREE.Geometry();
	
	//Terrain
	var step = edge / (dem.length - 1);
	for (var x = 0; x < dem.length; x++) {
		for (var z = 0; z < dem.length; z++) {
			geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(
				-x * step + edge / 2,
				dem[x][z],
				z * step - edge / 2
			)));
			
			if (x > 0 && z > 0) {
				var base = z * dem.length + x;
				geometry.faces.push(new THREE.Face4(
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
	var offset = geometry.vertices.length;
	for (var i = 0; i < dem.length; i++) {	//Zadni
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(
			edge / 2,
			dem[0][i],
			i * step - edge / 2
		)));
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(
			edge / 2,
			bottom,
			i * step - edge / 2
		)));
		if (i > 0) {
			var base = i * 2 + offset;
			geometry.faces.push(new THREE.Face4(
				base,
				base + 1,
				base - 1,
				base - 2
			));
		}
		
	}
	
	offset = geometry.vertices.length;
	for (var i = 0; i < dem.length; i++) {	//Predni
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-edge / 2,
			dem[dem.length - 1][i],
			i * step - edge / 2
		)));
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-edge / 2,
			bottom,
			i * step - edge / 2
		)));
		if (i > 0) {
			var base = i * 2 + offset;
			geometry.faces.push(new THREE.Face4(
				base - 2,
				base - 1,
				base + 1,
				base
			));
		}
	}
	
	offset = geometry.vertices.length;
	for (var i = 0; i < dem.length; i++) {	//Leva
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-i * step + edge / 2,
			dem[i][0],
			-edge / 2
		)));
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-i * step + edge / 2,
			bottom,
			-edge / 2
		)));
		if (i > 0) {
			var base = i * 2 + offset;
			geometry.faces.push(new THREE.Face4(
				base - 2,
				base - 1,
				base + 1,
				base
			));
		}
	}
	
	offset = geometry.vertices.length;
	for (var i = 0; i < dem.length; i++) {	//Prava
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-i * step + edge / 2,
			dem[i][dem.length - 1],
			edge / 2
		)));
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(
			-i * step + edge / 2,
			bottom,
			edge / 2
		)));
		if (i > 0) {
			var base = i * 2 + offset;
			geometry.faces.push(new THREE.Face4(
				base,
				base + 1,
				base - 1,
				base - 2
			));
		}
	}
	//console.log(geometry.faces);
	
	//geometry.mergeVertices();	//geometry doubles generation time!
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	geometry.applyMatrix(new THREE.Matrix4().setScale(1/60, 1/60, 1/60));
	/*
	<mrdoob> if you're using CanvasRenderer you need computeCentroids
	<mrdoob> if your object is going to be rendered with FlatShading you need computeFaceNormals
	<mrdoob> if your object is going to be rendered with SmoothShading your object needs computeVertexNormals
	<Pitel> mrdoob: all those boundning spheres and cubes are just for physics?
	<mrdoob> or raycasting
	<mrdoob> (object picking)
	*/
	
	var vertices = [];
	for (var i = 0; i < geometry.vertices.length; i++) {
		var vertex = geometry.vertices[i];
		vertices.push([vertex.position.x, vertex.position.y, vertex.position.z])
	}
	
	var faces = [];
	for (var i = 0; i < geometry.faces.length; i++) {
		var face = geometry.faces[i];
		faces.push([face.a, face.b, face.c, face.d])
	}
	
	postMessage({"vertices": vertices, "faces": faces});
	close();
}
