{	
	let 
		db = firebase.firestore(),
		genresCol = db.collection("genres"),
		booksCol = db.collection("books"),

        loadBar = $("#load-bar");

	function removeGenre(genreId) {
		loadBar.css("display", "block");

		booksCol.where("genresId", "array-contains", genreId).get()
		.then(function(booksQuery) {
			if (booksQuery.size == 0) {
				genresCol.doc(genreId).delete()
				.then(function() {
					$("[data-id=" + genreId + "]").remove();
					loadBar.css("display", "none");
				});
			} else {
				loadBar.css("display", "none");

				let books = [];

				booksQuery.docs.forEach(function(doc) {
					books.push(doc.data().title);
				});

				alert("Неможливо видалити, бо цей жанр використовується у книгах: " + books.join(", "));
			}
		})
	}
	/*
	genresCol.onSnapshot(snapshot => {
		let changes = snapshot.docChanges();
		
		changes.forEach(change => {
			if (change.type == "removed") {
        		$("[data-id=" + change.doc.id + "]").remove();
			}
		});
	});*/
}