var mongoose = require("mongoose");

var Bar_Schema = new mongoose.Schema({
	id: String,
	going: []
	
});

var Bar = module.exports =  mongoose.model("NLBar", Bar_Schema);