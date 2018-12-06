{	
	let 
		db = firebase.firestore(),
		journalCol = db.collection("journal"),
		booksCol = db.collection("books"),

		loadBar = $("#load-bar");

	function acceptRequest(requestId, bookId) {
		loadBar.css("display", "block");

		booksCol.doc(bookId).get()
		.then(function(doc) {
			if (doc.data().amount != 0) {
				booksCol.doc(bookId).update({
					amount: doc.data().amount - 1
				}).then(function() {
					journalCol.doc(requestId).update({
						status: "active",
						dateOfAccept: new Date().toISOString().slice(0, 10)
					}).then(function() {
						$("[data-id=" + requestId + "]").remove();
						loadBar.css("display", "none");
						displayMessage("Заявку прийнято i додано до активних");
					});
				});
			} else {
				loadBar.css("display", "none");
				displayMessage("Неможливо прийняти заявку, бо не вистачає книг", 1);
			}
		});
	}

	function declineRequest(requestId) {
		loadBar.css("display", "block");

		journalCol.doc(requestId).delete()
		.then(function() {
			$("[data-id=" + requestId + "]").remove();
			loadBar.css("display", "none");

			displayMessage("Заявку вiдхилено");
		});
	}
}