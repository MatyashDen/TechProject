{	
	let 
		db = firebase.firestore(),
		storage = firebase.storage(),
		booksCol = db.collection("books"),

        loadBar = $("#load-bar");

	function removeBook(bookId) {
		loadBar.css("display", "block");

		booksCol.doc(bookId).delete()
		.then(function() {
			storage.ref("books-images/" + bookId).delete()
			.then(() => {
				$("[data-id=" + bookId + "]").remove();
				loadBar.css("display", "none");
			}).catch(function() {
				$("[data-id=" + bookId + "]").remove();
				loadBar.css("display", "none");
			});
		});
	}
}