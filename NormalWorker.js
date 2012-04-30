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

	var getheight = function(x, y) {
		if (x < 0) {
			x = 0;
		} else if (x > height - 1) {
			x = height - 1;
		}
		if (y < 0) {
			y = 0;
		} else if (y > height - 1) {
			y = height - 1;
		}
		var i = (y * width + x) * 4;
		var h = (data[i] * 255 + data[i + 1]) / 0xffff;
		//if (x == 0x80 && y == 0x80) postMessage({log: h});
		return h;
	}

	var dem = e.data.dem;
	var data = dem.data;
	var outimg = e.data.normal;
	var output = outimg.data;
	var width = dem.width;
	var height = dem.height;

	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			var points = [];
			var origin = [0,  0, getheight(x    , y)];
			points.push([-1,  0, getheight(x - 1, y)]);
			points.push([-1, -1, getheight(x - 1, y - 1)]);
			points.push([ 0, -1, getheight(x    , y - 1)]);
			points.push([ 1, -1, getheight(x + 1, y - 1)]);
			points.push([ 1,  0, getheight(x + 1, y)]);
			points.push([ 1,  1, getheight(x + 1, y + 1)]);
			points.push([ 0,  1, getheight(x    , y + 1)]);
			points.push([-1,  1, getheight(x - 1, y + 1)]);

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
			//if (x % 10 == 0 && y % 10 == 0) postMessage({log: normal});

			var idx = (y * width + x) * 4;
			output[idx] = ((normal[0] + 1) / 2 * 255) | 0;
			output[idx + 1] = ((normal[1] + 1) / 2 * 255) | 0;
			output[idx + 2] = (normal[2] * 255) | 0;
			output[idx + 3] = 255;
		}
	}

	postMessage(outimg);
	close();
};
