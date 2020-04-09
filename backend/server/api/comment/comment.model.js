'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  comment: String,
  status: {type: Boolean,default:true},
  postID:{type:Schema.Types.ObjectId,ref:'Post'},
  userCommented:String,
},{timestamps:true});

module.exports = mongoose.model('Comment', CommentSchema);