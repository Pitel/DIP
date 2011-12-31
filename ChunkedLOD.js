/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

THREE.ChunkedLOD = function () {
	THREE.Object3D.call(this);
	this.LODs = [];
};

THREE.ChunkedLOD.prototype = new THREE.Object3D();
THREE.ChunkedLOD.prototype.constructor = THREE.LOD;
THREE.ChunkedLOD.prototype.supr = THREE.Object3D.prototype;

THREE.ChunkedLOD.prototype.addLevel = function (object3D, visibleAtDistance) {
	if (visibleAtDistance === undefined) {
		visibleAtDistance = 0;
	}
	visibleAtDistance = Math.abs(visibleAtDistance);
	for (var l = 0; l < this.LODs.length; l++) {
		if (visibleAtDistance < this.LODs[l].visibleAtDistance) {
			break;
		}
	}
	this.LODs.splice(l, 0, {visibleAtDistance: visibleAtDistance, object3D: object3D});
	this.add(object3D);
};

THREE.ChunkedLOD.prototype.update = function (camera) {
	if (this.LODs.length > 1) {
		camera.matrixWorldInverse.getInverse(camera.matrixWorld);
		var inverse  = camera.matrixWorldInverse;
		var distance = -(inverse.n31 * this.position.x + inverse.n32 * this.position.y + inverse.n33 * this.position.z + inverse.n34);
		this.LODs[0].object3D.visible = true;
		THREE.SceneUtils.showHierarchy(this.LODs[0].object3D, true);
		for (var l = 1; l < this.LODs.length; l++) {
			if (distance >= this.LODs[l].visibleAtDistance) {
				THREE.SceneUtils.showHierarchy(this.LODs[l - 1].object3D, false);
				THREE.SceneUtils.showHierarchy(this.LODs[l].object3D, true);
				this.LODs[l - 1].object3D.visible = false;
				this.LODs[l].object3D.visible = true;
			} else {
				break;
			}
		}
		for(; l < this.LODs.length; l++) {
			THREE.SceneUtils.showHierarchy(this.LODs[l].object3D, false);
			this.LODs[ l ].object3D.visible = false;
		}
	}
};
