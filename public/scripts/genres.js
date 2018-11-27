{	
	let 
		db = firebase.firestore(),
		genresCol = db.collection("genres"),

        loadBar = $("#load-bar");

	function removeGenre(genreId) {
		loadBar.css("display", "block");

		genresCol.doc(genreId).delete()
		.then(function() {
			$("[data-id=" + genreId + "]").remove();
			loadBar.css("display", "none");
		});
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