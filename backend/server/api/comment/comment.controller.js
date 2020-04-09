'use strict';

var _ = require('lodash');
var Comment = require('./comment.model');



// Creates a new comment in the DB.
exports.create = function(req, res) {
  req.body.userCommented = req.user.firstname;
  Comment.create(req.body, function(err, comment) {
    if(err) { return res.status(400).send({message: "Something Went wrong Please Try Again Later"}); }
    else { return res.status(201).send({message:'Success'})}
  });
};


function handleError(res, err) {
  return res.status(500).send(err);
}