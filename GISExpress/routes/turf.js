'use strict';
var express = require('express');
var router = express.Router();
var turf = require('@turf/turf');
var fs = require('fs');
var utils = require('../utils/utils');

router.get('/polygonArea', function (req, res) {
    //var convexHull = turf.convex(randomPoints);
    //fs.writeFileSync('./convex_hull.geojson', JSON.stringify(convexHull));
    var polygon = turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
    var line = turf.lineString([[-83, 30], [-84, 36], [-78, 41]]);
    var randomLines = fs.readFileSync('./input/r6edm.geojson');
    randomLines = JSON.parse(randomLines);
    var nearestLine = {};
    var minimumDistance = 10000;
    var pt = turf.point([51.40610218048095,35.73742097953486,]);
    turf.featureEach(randomLines, function (currentFeature, featureIndex) {
        var coords = currentFeature.geometry.coordinates;
        var segments = turf.lineSegment(currentFeature);
        //console.log(segments);
        //turf.featureEach(segments, function (line, lineindex) {
        //    var distance = turf.pointToLineDistance(pt, line);
        //    if (distance < minimumDistance) {
        //        minimumDistance = distance;
        //        nearestLine = currentFeature;
        //    }
        //}
        coords.forEach((c) => {
            var line1 = turf.lineString(c, currentFeature.properties);
            var distance = turf.pointToLineDistance(pt, line1);
            if (distance < minimumDistance) {
              minimumDistance = distance;
                nearestLine = line1;
            }
        });
    });
    
    console.log(minimumDistance);
    console.log(nearestLine);
    console.log(nearestLine.properties.elevation);
    var area = turf.area(polygon);
    res.json({ shape: line, area: area });
});
router.post('/sendTest', function (request, response) {
    console.log(request.body);      // your JSON
    var polygon = request.body;
    var area = turf.area(polygon);
    response.send({ shape: polygon, area: area });
    //response.send(request.body);    // echo the result back
});
router.post('/featureArea', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body)) {
        res.status(401).json({ error: 'not valid' });
    }
    var feature = req.body;
    var area = turf.area(feature);
    res.json({ area: area });
});
router.post('/pointAlong', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body.line)) {
        res.status(401).json({ error: 'not valid' });
    }
    //var options = { units: 'miles' };
    var along = turf.along(req.body.line, req.body.distance);
    res.json(along);
});
router.post('/featureBbox', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body)) {
        res.status(401).json({ error: 'not valid' });
    }
    var bbox = turf.bbox(req.body);
    res.json(bbox);
});
router.post('/bboxPolygon', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (req.body.length !== 4) {
        res.status(401).json({ error: 'not valid' });
    }
    var poly = turf.bboxPolygon(req.body);
    res.json(poly);
});
router.post('/pointsBearing', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body.start)) {
        res.status(401).json({ error: 'start not valid' });
    }
    if (!utils.IsValidGeoJson(req.body.end)) {
        res.status(401).json({ error: 'end not valid' });
    }
    var bearing = turf.bearing(req.body.start, req.body.end);
    res.json({ bearing: bearing });
});
router.post('/centerOfFeatures', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body)) {
        res.status(401).json({ error: 'input not valid' });
    }
    var center = turf.center(req.body);
    res.json(center);
});
router.post('/centerOfMass', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body)) {
        res.status(401).json({ error: 'input not valid' });
    }
    var center = turf.centerOfMass(req.body);
    res.json(center);
});
router.post('/centroid', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body)) {
        res.status(401).json({ error: 'input not valid' });
    }
    var center = turf.centroid(req.body);
    res.json(center);
});
router.post('/destinationOfCoordinate', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (req.body.origin !== 2) {
        res.status(401).json({ error: 'input not valid' });
    }
    if (!req.body.distance) {
        req.body.distance = 1;
    }
    if (!req.body.bearing) {
        req.body.distance = 90;
    }
    if (!req.body.options) {
        req.body.options = { units: 'kilometers' };
    }
    var point = turf.point(req.body.origin);
    var destination = turf.destination(point, req.body.distance, req.body.bearing, req.body.options);
    res.json(destination);
});
router.post('/destinationOfPoint', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body.origin)) {
        res.status(401).json({ error: 'input not valid' });
    }
    if (!req.body.distance) {
        req.body.distance = 1;
    }
    if (!req.body.bearing) {
        req.body.distance = 90;
    }
    if (!req.body.options) {
        req.body.options = { units: 'kilometers' };
    }
    var destination = turf.destination(req.body.origin, req.body.distance, req.body.bearing, req.body.options);
    res.json(destination);
});
router.post('/distanceBetweenPoints', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body.from)) {
        res.status(401).json({ error: 'input not valid(from)' });
    }
    if (!utils.IsValidGeoJson(req.body.to)) {
        res.status(401).json({ error: 'input not valid(to)' });
    }
    if (!req.body.options) {
        req.body.options = { units: 'kilometers' };
    }
    var distance = turf.distance(req.body.from, req.body.to, req.body.options);
    res.json(distance);
});
router.post('/envelopeOfFeatures', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body)) {
        res.status(401).json({ error: 'input not valid' });
    }
    var enveloped = turf.envelope(req.body);
    res.json(enveloped);
});
router.post('/lengthOfFeatures', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body.feature)) {
        res.status(401).json({ error: 'input not valid' });
    }
    if (!req.body.options) {
        req.body.options = { units: 'kilometers' };
    }
    var length = turf.length(req.body.feature, req.body.options);
    res.json({ length: length, units: req.body.options.units });
});
router.post('/midwayOfPoints', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body.point1)) {
        res.status(401).json({ error: 'input not valid(point1)' });
    }
    if (!utils.IsValidGeoJson(req.body.point2)) {
        res.status(401).json({ error: 'input not valid(point2)' });
    }
    var midpoint = turf.midpoint(req.body.point1, req.body.point2);
    res.json(midpoint);
});

module.exports = router;