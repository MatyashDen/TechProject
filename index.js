"use strict";

var 
	express = require('express'),
	app = express(),
	firebase = require('firebase'),
	admin = require('firebase-admin'),
	serviceAccount = require('./admin-key.json'),
	favicon = require('serve-favicon'),
	path = require('path');

firebase.initializeApp({
  apiKey: "AIzaSyA4XPeig_9bj1JjmyOtzaBKeNnxLSPT-PQ",
  authDomain: "tui-project-a3956.firebaseapp.com",
  databaseURL: "https://tui-project-a3956.firebaseio.com",
  projectId: "tui-project-a3956",
  storageBucket: "tui-project-a3956.appspot.com",
  messagingSenderId: "322244282210"
});
firebase.firestore().settings( { timestampsInSnapshots: true });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tui-project-a3956.firebaseio.com"
});

var db = firebase.firestore();

app.set('port', (process.env.PORT || 5002));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicons/favicon.ico'));

app.get('/', function(request, response) {
  response.render('pages/sign-in');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
