'use strict';
var express = require('express');
var router = express.Router();
var turf = require('@turf/turf');
var fs = require('fs');
var utils = require('../utils/utils');

router.get('/polygonArea', function (req, res) {
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
    res.json({area: area });
});
router.post('/pointAlong', function (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'bad request' });
    }
    if (!utils.IsValidGeoJson(req.body.line)) {
        res.status(401).json({ error: 'not valid' });
    }
    //var line = turf.lineString([[-83, 30], [-84, 36], [-78, 41]]);
    //var options = { units: 'miles' };

    var along = turf.along(req.body.line, req.body.distance);
    res.json(along);
});

module.exports = router;