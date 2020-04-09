'use strict';

var express = require('express');
var controller = require('./comment.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();


router.post('/',auth.isAuthenticated(),controller.create);


module.exports = router;