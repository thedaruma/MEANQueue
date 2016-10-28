var mongoose = require('mongoose');
var Schema = mongoose.schema;
var schema = new Schema({
  name:{
    type: String,
    required: true
  },
  branch: {
    type: Array,
    required: true
  }
});

module.exports = mongoose.model('Bank', schema);
