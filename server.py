#!/usr/bin/env python

import os.path, sys, gdal, numpy, scipy.ndimage, json, png
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
from urlparse import urlparse
from gdalconst import *
from tempfile import gettempdir

def cache(l, x, y, w, h, r):
	path = gettempdir() + "/%s_%d_%d_%d_%d_%d_%d.png" % (os.path.split(dataset.GetDescription())[1], l, x, y, w, h, r)
	#print path
	if not os.path.exists(path):
		#print "caching"
		tile = dem[x:x+w, y:y+h]
		f = open(path, "wb")
		w = png.Writer(r, r, greyscale = True, bitdepth = 16)
		imagedata = scipy.ndimage.interpolation.zoom(tile, float(r) / tile.shape[0], order = 1)
		normalizer = numpy.empty_like(imagedata)
		normalizer.fill(dem.min() * -1)
		normalized = numpy.add(imagedata, normalizer)
		w.write(f, normalized)
		f.close()
	else:
		pass
		#print "caching not necessary"
	return path

class Tiler(BaseHTTPRequestHandler):
	def do_GET(self):
		url = urlparse(self.path)
		print url
		if url.path.startswith("/chunk/"):
			query = url.path.split("/")[-1].split(".")[0].split("_")
			#print query
			l = int(query[0])
			x = int(query[1])
			y = int(query[2])
			w = int(query[3])
			h = int(query[4])
			r = int(query[5])
			self.send_response(200)
			self.send_header('Content-type', 'image/png')
			self.end_headers()
			path = cache(l, x, y, w, h, r)
			f = open(path, "rb")
			self.wfile.write(f.read())
			f.close()
		elif url.path == "/info.json":
			self.send_response(200)
			self.send_header('Content-type', 'application/json')
			self.end_headers()
			self.wfile.write(json.dumps({"w": dataset.RasterXSize, "h": dataset.RasterYSize}))
		else:
			try:
				f = open(url.path[1:])
				self.send_response(200)
				if url.path.endswith('.js'):
					self.send_header('Content-type', 'application/javascript')
				elif url.path.endswith('.css'):
					self.send_header('Content-type', 'text/css')
				elif url.path.endswith('.html') or url.path.endswith('.htm'):
					self.send_header('Content-type', 'text/html')
				elif url.path.endswith('.png'):
					self.send_header('Content-type', 'image/png')
				self.end_headers()
				self.wfile.write(f.read())
				f.close()
			except IOError:
				self.send_error(404)

dataset = gdal.Open(sys.argv[1], GA_ReadOnly)
print "%s: %d * %d" % (dataset.GetDriver().LongName, dataset.RasterXSize, dataset.RasterYSize)
dem = dataset.ReadAsArray()

print "http://localhost:8000/index.html"
HTTPServer(("", 8000), Tiler).serve_forever()
