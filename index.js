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

var CountdownLatch = function (limit) {
  this.limit = limit;
  this.count = 0;
  this.waitBlock = function () {};
};

CountdownLatch.prototype.countDown = function () {
  this.count = this.count + 1;
  if (this.limit <= this.count) {
    return this.waitBlock();
  }
};

CountdownLatch.prototype.await = function(callback) {
  this.waitBlock = callback;
}

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
  let 
    booksCol = db.collection("books").orderBy("dateOfAdd", "desc"),
    writersCol = db.collection("writers"),
    genresCol = db.collection("genres");

  booksCol.get()
  .then(booksQuery => {
    let 
      books = [],
      barrier = new CountdownLatch(booksQuery.size);

    booksQuery.docs.forEach(function(doc, index) {
      let 
        writersId = doc.data().writersId,
        genresId = doc.data().genresId,
        barrier2 = new CountdownLatch(writersId.length + genresId.length);

      books[index] = doc.data();

      books[index].writers = [];
      books[index].genres = [];

      writersId.forEach(function(id, index2) {
        writersCol.doc(id).get()
        .then(function(doc2) {
          books[index].writers[index2] = doc2.data().name;
          barrier2.countDown();
        });
      });

      genresId.forEach(function(id, index2) {
        genresCol.doc(id).get()
        .then(function(doc2) {
          books[index].genres[index2] = doc2.data().title;
          barrier2.countDown();
        });
      });

      barrier2.await(function() {
        barrier.countDown();
      });
    });


    barrier.await(function() {
      response.render("pages/books", {books: books});
    });
  });
});

// Writers page
app.get("/writers", function(request, response) {
  let writersCol = db.collection("writers").orderBy("dateOfAdd", "desc");

  writersCol.get()
  .then(writersQuery => {
    let writers = [];

    writersQuery.forEach(doc => {
      writers.push(doc.data());
    });

    response.render("pages/writers", {writers: writers});
  });
});

app.get("/writers/change/:writerId", function(request, response) {
  let writersCol = db.collection("writers");

  writersCol.doc(request.params.writerId).get()
  .then(function (doc) {
    if (doc.exists) {
      response.render("pages/change-writer", {writer: doc.data()});
    }
  });
});

// Genres page
app.get("/genres", function(request, response) {
  let genresCol = db.collection("genres").orderBy("dateOfAdd", "desc");

  genresCol.get()
  .then(function(genresQuery) {
    let genres = [];

    genresQuery.forEach(function(doc) {
      genres.push(doc.data());
    });  

    response.render("pages/genres", {genres: genres});
  });
});

app.get("/genres/change/:genreId", function(request, response) {
  let genresCol = db.collection("genres");

  genresCol.doc(request.params.genreId).get()
  .then(function (doc) {
    if (doc.exists) {
      response.render("pages/change-genre", {genre: doc.data()});
    }
  });
});

// Add pages
app.get("/add-book", function(request, response) {
  db.collection("genres").orderBy("dateOfAdd", "desc").get()
  .then(function(genresQuery) {

    db.collection("writers").orderBy("dateOfAdd", "desc").get()
    .then(function(writersQuery) {
      let 
        genres = [],
        writers = [];

      genresQuery.forEach(function(doc) {
        genres.push(doc.data());
      });

      writersQuery.forEach(function(doc) {
        writers.push(doc.data());
      });

      response.render("pages/add-book", {writers: writers, genres: genres});  
    });
  });
});

app.get("/books/change/:bookId", function(request, response) {
  let 
    booksCol = db.collection("books"),
    writersCol = db.collection("writers"),
    genresCol = db.collection("genres");

  genresCol.orderBy("dateOfAdd", "desc").get()
  .then(function(genresQuery) {

    writersCol.orderBy("dateOfAdd", "desc").get()
    .then(function(writersQuery) {
      let 
        allGenres = [],
        allWriters = [];

      genresQuery.forEach(function(doc) {
        allGenres.push(doc.data());
      });

      writersQuery.forEach(function(doc) {
        allWriters.push(doc.data());
      });

      booksCol.doc(request.params.bookId).get()
      .then(function(doc) {
        let 
          book = doc.data(),
          writersId = doc.data().writersId,
          genresId = doc.data().genresId,
          bookWriters = [],
          bookGenres = [],
          barrier = new CountdownLatch(writersId.length + genresId.length);

        writersId.forEach(function(id, index2) {
          writersCol.doc(id).get()
          .then(function(doc2) {
            bookWriters[index2] = doc2.data();
            barrier.countDown();
          });
        });

        genresId.forEach(function(id, index2) {
          genresCol.doc(id).get()
          .then(function(doc2) {
            bookGenres[index2] = doc2.data();
            barrier.countDown();
          });
        });

        barrier.await(function() { 
          response.render("pages/change-book", {book: book, allGenres: allGenres, 
            allWriters: allWriters, bookGenres: bookGenres, bookWriters: bookWriters});
        });
      });
    });
  });
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