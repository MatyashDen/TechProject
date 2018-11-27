{	
	let 
		db = firebase.firestore(),
		storage = firebase.storage(),
		writersCol = db.collection("writers"),

        loadBar = $("#load-bar");

	function removeWriter(writerId) {
		loadBar.css("display", "block");

		writersCol.doc(writerId).delete()
		.then(function() {
			storage.ref("writers-images/" + writerId).delete()
			.then(() => {
				$("[data-id=" + writerId + "]").remove();
				loadBar.css("display", "none");
			});
		});
	}
}