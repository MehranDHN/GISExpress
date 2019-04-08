'use strict';
var express = require('express');
var router = express.Router();
var turf = require('@turf/turf');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'GIS Express' });
});


module.exports = router;
