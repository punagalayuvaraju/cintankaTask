'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
uri: 'mongodb+srv://yuvi:yuvi@cluster0-3zndo.gcp.mongodb.net/cintanaDB?retryWrites=true&w=majority'
},
backendurl: 'http://localhost:9000',
  seedDB: false
};
