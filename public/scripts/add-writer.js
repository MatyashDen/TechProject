{
	let 
		db = firebase.firestore(),

		image = document.getElementById("img"),

		name = $("#name"),
		bornDate = $("#born-date"),
		deathDate = $("#death-date"),
		description = $("#description"),

		addImageBut = $("#add-image"),
		addWriterBut = $("#add-writer"),

		black = $(".black").eq(0),
		loadBar = $("#load-bar");

	addWriterBut.on("click", addWriter);

	addImageBut.on("change", () => {
		if (validFileType(addImageBut[0].files[0])) {
			displayCropDiv(1 / 1);
		}
	});

	function addWriter() {
		loadBar.css("display", "block");

		if (name.val() && bornDate.val() && description.val()) {
			if (image.src.indexOf("/favicons/no-image.svg") == -1) {
				let
					millisecondsFrom = Date.parse(bornDate.val()),
					millisecondsEnd = deathDate.val() ? Date.parse(deathDate.val()) : millisecondsFrom + 1,
					currentTime = new Date().getTime(),

					key = db.collection("writers").doc().id,
					docRef = db.collection("writers").doc(key);

				if (millisecondsFrom < millisecondsEnd && millisecondsEnd < currentTime) {
					docRef.set({
						id: key,
						pictureUrl: "",

						name: name.val(),
						bornDate: bornDate.val(),
						deathDate: deathDate.val() || '',
						description: description.val(),

						dateOfAdd: new Date().getTime(),
					}).then(function() {
						let file = dataURLtoFile(image.src, 'filename.png');

						firebase.storage().ref("writers-images/" + key).put(file)
						.then(function() {
							firebase.storage().ref("writers-images/" + key).getDownloadURL()
							.then(function(url) {
								docRef.update({
									pictureUrl: url
								}).then(function() {
									refresh();
								});
							});
						});
					});
				} else {
					loadBar.css("display", "none");

                	displayMessage("Виберiть правильно дати", 1);
				}
			} else {
				loadBar.css("display", "none");

                displayMessage("Виберiть фото автора", 1);
			}
		} else {
			loadBar.css("display", "none");

			displayMessage("Заповнiть усi поля", 1);
		}
	}

	function refresh() {
		image.src = "/favicons/no-image.svg";

		name.val(null);
		bornDate.val(null);
		deathDate.val(null);
		description.val(null);

		loadBar.css("display", "none");

		displayMessage("Письменника додано", 0);
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
}