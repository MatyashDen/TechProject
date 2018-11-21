{	
	let 
		db = firebase.firestore(),
		genresCol = db.collection("genres"),

		black = document.getElementById("black"),
        loadBar = document.getElementById("load-bar");

	function removeGenre(genreId) {
		//black.style.display = "block";
        //loadBar.style.display = "block";

		genresCol.doc(genreId).delete()
		.then(function() {
			//black.style.display = "none";
            //loadBar.style.display = "none";
		});
	}

	db.collection("genres").onSnapshot(snapshot => {
		let changes = snapshot.docChanges();
		
		changes.forEach(change => {
			if (change.type == "removed") {
				black.style.display = "none";
            	loadBar.style.display = "none";
        		$("[data-id=" + change.doc.id + "]").remove();
			}
		});
	});
}