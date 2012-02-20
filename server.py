#!/usr/bin/env python

import os.path, sys, gdal, scipy.ndimage, json
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
from urlparse import urlparse, parse_qs
from gdalconst import *
from tempfile import gettempdir

def cache(x, y, w, h, r):
	path = gettempdir() + "/%s_%d_%d_%d_%d_%d.json" % (os.path.split(dataset.GetDescription())[1], r, x, y, w, h)
	#print path
	if not os.path.exists(path):
		#print "caching"
		tile = dem[x:x+w, y:y+h]
		f = open(path, "w")
		f.write(json.dumps(scipy.ndimage.interpolation.zoom(tile, float(r) / tile.shape[0], order = 1).tolist()))
		f.close()
	else:
		pass
		#print "caching not necessary"
	return path

class Tiler(BaseHTTPRequestHandler):
	def do_GET(self):
		url = urlparse(self.path)
		#print url
		if url.path == "/tile":
			query = parse_qs(url.query)
			x = int(query['x'][0])
			y = int(query['y'][0])
			w = int(query['w'][0])
			h = int(query['h'][0])
			r = int(query['r'][0])
			self.send_response(200)
			self.send_header('Content-type', 'application/json')
			self.end_headers()
			path = cache(x, y, w, h, r)
			f = open(path)
			self.wfile.write(f.read())
			f.close()
		elif url.path == "/info":
			self.send_response(200)
			self.send_header('Content-type', 'application/json')
			self.end_headers()
			self.wfile.write(json.dumps([dataset.RasterXSize, dataset.RasterYSize]))
		else:
			self.send_response(404)

dataset = gdal.Open(sys.argv[1], GA_ReadOnly)
print "%s: %d * %d" % (dataset.GetDriver().LongName, dataset.RasterXSize, dataset.RasterYSize)
dem = dataset.ReadAsArray()

print "http://localhost:8000/tile"
HTTPServer(("", 8000), Tiler).serve_forever()
