"use strict";

var 
	express = require('express'),
	app = express(),
	firebase = require('firebase'),
	//admin = require('firebase-admin'),
	//serviceAccount = require('./admin-key.json'),
	favicon = require('serve-favicon'),
	path = require('path');

firebase.initializeApp({
  apiKey: "AIzaSyCok2kYqVlgwE2D5oB-SwH02P_vAEs6vXc",
  authDomain: "tech-project-713a5.firebaseapp.com",
  databaseURL: "https://tech-project-713a5.firebaseio.com",
  projectId: "tech-project-713a5",
  storageBucket: "tech-project-713a5.appspot.com",
  messagingSenderId: "44726095220"
});
firebase.firestore().settings( { timestampsInSnapshots: true });
/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tui-project-a3956.firebaseio.com"
});*/

var db = firebase.firestore();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicons/favicon.ico'));

app.get('/', function(request, response) {
  response.render('pages/sign-in');
});

app.get("/books", function(request, response) {
  response.render("pages/books");
});

app.get("/writers", function(request, response) {
  response.render("pages/writers");
});

app.get("/genres", function(request, response) {
  response.render("pages/genres");
});

// Add pages
app.get("/add-book", function(request, response) {
  response.render("pages/add-book");
});

app.get("/add-writer", function(request, response) {
  response.render("pages/add-writer");
});

app.get("/add-genre", function(request, response) {
  response.render("pages/add-genre");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});