{
	let 
		db = firebase.firestore(),
		journalCol = db.collection("journal"),
		booksCol = db.collection("books"),

		loadBar = $("#load-bar");

	function finish(activeId) {
		loadBar.css("display", "block");

		journalCol.doc(activeId).update({
			status: "old",
			dateOfEnd: new Date().toISOString().slice(0, 10)
		}).then(function() {
			$("[data-id=" + activeId + "]").remove();
			loadBar.css("display", "none");
			displayMessage("Заявку додано до архiву");
		});
	}
}