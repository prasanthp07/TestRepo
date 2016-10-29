//***************************** Server file *************************************************

//Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var server = express();
var fs = require('fs');
var path = require('path');
var multer = require('multer');

//setting path and filename for file storage 
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './upload/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '_' + file.originalname);
	}
});
var upload = multer({
	storage: storage
});


//Connection string
var dbPath = 'mongodb://localhost/BlogDB';
mongoose.connect(dbPath);

server.use(bodyParser.json());

server.use(upload.single('image'));

server.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API 
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

console.log("path:", __dirname);
var rootPath = path.normalize(__dirname);

//Path of Models and Routes
var modelPath = rootPath + '/Models';
var routePath = rootPath + '/Routes';


var modelPathFiles = fs.readdirSync(modelPath);
console.log(modelPathFiles);


modelPathFiles.forEach(function (file) {
	require(modelPath + '/' + file);
});

fs.readdirSync(routePath).forEach(function (file) {
	require(routePath + '/' + file)(server);
});

// Configuring Passport
server.use(passport.initialize());

//Server listening
server.listen(4000, function () {
	console.log("server is running on port 4000");
});
