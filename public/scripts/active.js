{
	let 
		db = firebase.firestore(),
		journalCol = db.collection("journal"),
		booksCol = db.collection("books"),

		loadBar = $("#load-bar");

	function finish(activeId, bookId) {
		loadBar.css("display", "block");

		booksCol.doc(bookId).get()
		.then(function(doc) {
			booksCol.doc(bookId).update({
				amount: doc.data().amount + 1
			}).then(function() {
				journalCol.doc(activeId).update({
					status: "old",
					dateOfEnd: new Date().toISOString().slice(0, 10)
				}).then(function() {
					$("[data-id=" + activeId + "]").remove();
					loadBar.css("display", "none");
					displayMessage("Заявку додано до архiву");
				});
			});
		});
	}
}