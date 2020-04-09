'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  description: String,
   image: String,
  status: {type: Boolean,default:true},
},{timestamps:true});

module.exports = mongoose.model('Post', PostSchema);