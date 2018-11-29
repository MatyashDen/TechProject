{
	let 
		db = firebase.firestore(),
		booksCol = db.collection("books"),
		genresCol = db.collection("genres"),

		image = document.getElementById("img"),

		title = $("#title"),
		amount = $("#amount"),
		description = $("#description"),

		writersId = $("#writers"),
		genresId = $("#genres"),

		addImageBut = $("#add-image"),
		changeBookBut = $("#change-book"),

		black = $(".black").eq(0),
		loadBar = $("#load-bar"),
		$select = [],

		link = window.location.pathname,
        key = link;

    key = key.substr(key.lastIndexOf("/") + 1);

 	$(document).ready(function() {
    	$select.push(
    		$('#writers').select2({
    			placeholder: 'Виберiть авторiв',
    			dropdownCssClass: 'select2-font-size',
    			minimumResultsForSearch: -1
    		})
    	);
    	$select.push(
    		$('#genres').select2({
    			placeholder: 'Оберiть жанри',
    			dropdownCssClass: 'select2-font-size'
    		})
    	);
	});

	changeBookBut.on("click", changeBook);

	addImageBut.on("change", () => {
		if (validFileType(addImageBut[0].files[0])) {
			displayCropDiv(2 / 3);
		}
	});

	function changeBook() {
		loadBar.css("display", "block");

		if (title.val() && amount.val() && description.val() && 
			writersId.val() && genresId.val()) {
			let docRef = booksCol.doc(key);

			docRef.update({
				title: title.val(),
				amount: parseInt(amount.val()),
				description: description.val(),

				writersId: writersId.val(),
				genresId: genresId.val(),
			}).then(function() {
				if (addImageBut[0].files[0] != undefined) {
					let file = dataURLtoFile(image.src, 'filename.png');

					firebase.storage().ref("books-images/" + key).put(file)
					.then(function() {
						firebase.storage().ref("books-images/" + key).getDownloadURL()
						.then(function(url) {
							docRef.update({
								pictureUrl: url
							}).then(function() {
								window.location.href = "/books";
							});
						});
					});
				} else 
					window.location.href = "/books";
			});
		} else {
			loadBar.css("display", "none");

			displayMessage("Заповнiть усi поля", 1);
		}
	}

	function validFileType(file) {
		let fileTypes = [
			'image/jpeg',
			'image/pjpeg',
			'image/png'
		]

	  	for (let i = 0; i < fileTypes.length; i++)
	    	if (file.type === fileTypes[i])
	      		return true;

		return false;
	}
/*
	genresCol.onSnapshot(snapshot => {
		snapshot.forEach(change => {
			if (change.type == "removed") {
				console.log(change.doc.id);
				$("[value=" + change.doc.id + "]").remove();
			}
		});
	});*/
}