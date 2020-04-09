/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below
var Post = require('../api/post/post.model');
var Comment = require('../api/comment/comment.model');

var User = require('../api/user/user.model');

// Insert seed data below
var postSeed = require('../api/post/post.seed.json');
var commentSeed = require('../api/comment/comment.seed.json');


// Thing.find({}).remove(function() {
//   Thing.create(thingSeed);
// });