{	
	let 
		db = firebase.firestore(),
		storage = firebase.storage(),
		writersCol = db.collection("writers"),
		booksCol = db.collection("books"),

        loadBar = $("#load-bar");

	function removeWriter(writerId) {
		loadBar.css("display", "block");

		booksCol.where("writersId", "array-contains", writerId).get()
		.then(function(booksQuery) {
			if (booksQuery.size == 0) {
				writersCol.doc(writerId).delete()
				.then(function() {
					storage.ref("writers-images/" + writerId).delete()
					.then(() => {
						$("[data-id=" + writerId + "]").remove();
						loadBar.css("display", "none");
					}).catch(function() {
						$("[data-id=" + writerId + "]").remove();
						loadBar.css("display", "none");
					});
				});
			} else {
				loadBar.css("display", "none");

				let books = [];

				booksQuery.docs.forEach(function(doc) {
					books.push(doc.data().title);
				});

				alert("Неможливо видалити, бо цей письменник є автором книг: " + books.join(", "));
			}
		});
	}
}