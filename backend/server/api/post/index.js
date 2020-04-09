'use strict';

var express = require('express');
var controller = require('./post.controller');
var multiparty = require('connect-multiparty');
var path = require('path');
var router = express.Router();
var auth = require('../../auth/auth.service');

router.use(multiparty({ uploadDir: path.dirname('./uploads')+'/uploads' }));

router.get('/',auth.isAuthenticated(),controller.index);
router.get('/:id',auth.isAuthenticated(),controller.show);
router.post('/',auth.isAuthenticated(),controller.create);


module.exports = router;