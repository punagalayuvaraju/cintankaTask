'use strict';

var _ = require('lodash');
var Post = require('./post.model');
var ObjectId = require('mongodb').ObjectID;
var config = require('../../config/environment');
var socketio=require('socket.io-client')(config.backendurl)

// Get list of posts
exports.index = function(req, res) {
  Post.find({status:true}).sort({"createdAt" : -1}).exec(function (err, posts) {
    if(err) { return res.status(400).send({message: 'Something Went Wrong While Getting Posts !!!'}) }
    else { 
      return res.status(200).send(posts);
    }
  });
};

// Get a single post comments
exports.show = function(req, res) {
  console.log(req.params.id)
  Post.aggregate([
    {$match:{_id:ObjectId(req.params.id)}},
    {$lookup:{from: 'comments', localField: '_id', foreignField: 'postID', as: 'part_Comments'}},
    {$unwind: { path: "$comments", preserveNullAndEmptyArrays: true }},
    {$sort: {"comments.createdAt": -1}}
  ]).exec(function(err,response){
      if(err) {
        console.log(err);
      } else {
       res.status(200).send(response);
      }
    });
};

// Creates a new post in the DB.
exports.create = function(req, res) {
  const txt = JSON.parse(req.body.data);
  const obj = {
    description: txt.txtarea,
    image:req.files.uploads.path
  }
  Post.create(obj, function(err, record) {
    if(err) { return res.status(400).send({message:'Something Went Wrong !!!'}) }
    else { 
      const obj = {
        username:req.user.username,
        firstname:req.user.firstname
      }
      socketio.emit('task:save', obj)
      return res.status(201).send({success: 'Posted Successfully !!!'});
    }
  });
};



function handleError(res, err) {
  return res.status(500).send(err);
}