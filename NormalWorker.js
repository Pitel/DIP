onmessage = function(e) {
	var cross = function(a, b) {
		return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
	}

	var subtract = function(a, b) {
		return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
	}

	var normalize = function(a) {
		var l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
		return [a[0] / l, a[1] / l, a[2] / l];
	}

	var dem = e.data.dem;
	var data = dem.data;
	var outimg = e.data.normal;
	var output = outimg.data;
	var width = dem.width;
	var height = dem.height;

	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			var ly = y - 1 < 0 ? 0 : y - 1;
			var uy = y + 1 > height - 1 ? height - 1 : y + 1;
			var lx = x - 1 < 0 ? 0 : x - 1;
			var ux = x + 1 > width - 1 ? width - 1 : x + 1;

			var points = [];
			var origin = [0, 0, data[(y * width + x) * 4]];
			points.push([-1, 0, data[(y * width + lx) * 4]]);
			points.push([-1, -1, data[(ly * width + lx) * 4]]);
			points.push([0, -1, data[(ly * width + x) * 4]]);
			points.push([1, -1, data[(ly * width + ux) * 4]]);
			points.push([1, 0, data[(y * width + ux) * 4]]);
			points.push([1, 1, data[(uy * width + ux) * 4]]);
			points.push([0, 1, data[(uy * width + x) * 4]]);
			points.push([-1, 1, data[(uy * width + lx) * 4]]);

			var normals = [];
			var num_points = points.length;

			for (var i = 0; i < num_points; i++) {
				var v1 = points[i];
				var v2 = points[(i + 1) % num_points];
				v1 = subtract(v1, origin);
				v2 = subtract(v2, origin);
				normals.push(normalize(cross(v1, v2)));
			}

			var normal = [0, 0, 0];

			for (var i = 0; i < normals.length; i++) {
				normal[0] += normals[i][0];
				normal[1] += normals[i][1];
				normal[2] += normals[i][2];
			}

			normal[0] /= normals.length;
			normal[1] /= normals.length;
			normal[2] /= normals.length;

			var idx = (y * width + x) * 4;
			output[idx] = ((normal[0] + 1.0 ) / 2.0 * 255) | 0;
			output[idx + 1] = ((normal[1] + 1.0 / 2.0 ) * 255) | 0;
			output[idx + 2] = (normal[2] * 255) | 0;
			output[idx + 3] = 255;
		}
	}

	postMessage(outimg);
	close();
};
