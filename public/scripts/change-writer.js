{
	let 
		db = firebase.firestore(),

		image = document.getElementById("img"),

		name = $("#name"),
		bornDate = $("#born-date"),
		deathDate = $("#death-date"),
		description = $("#description"),

		addImageBut = $("#add-image"),
		changeWriterBut = $("#change-writer"),

		black = $(".black").eq(0),
		loadBar = $("#load-bar"),

		link = window.location.pathname,
        key = link;

    key = key.substr(key.lastIndexOf("/") + 1);

	changeWriterBut.on("click", changeWriter);

	addImageBut.on("change", () => {
		if (validFileType(addImageBut[0].files[0])) {
			displayCropDiv(1 / 1);
		}
	});

	function changeWriter() {
		loadBar.css("display", "block");

		if (name.val() && bornDate.val() && description.val()) {
			let
				millisecondsFrom = Date.parse(bornDate.val()),
				millisecondsEnd = deathDate.val() ? Date.parse(deathDate.val()) : millisecondsFrom + 1,
				currentTime = new Date().getTime(),

				docRef = db.collection("writers").doc(key);

			if (millisecondsFrom < millisecondsEnd && millisecondsEnd < currentTime) {
				docRef.update({
					name: name.val(),
					bornDate: bornDate.val(),
					deathDate: deathDate.val() || '',
					description: description.val()
				}).then(function() {
					if (addImageBut[0].files[0] != undefined) {
						let file = dataURLtoFile(image.src, 'filename.png');

						firebase.storage().ref("writers-images/" + key).put(file)
						.then(function() {
							firebase.storage().ref("writers-images/" + key).getDownloadURL()
							.then(function(url) {
								docRef.update({
									pictureUrl: url
								}).then(function() {
									window.location.href = "/writers";
								});
							});
						});
					} else
						window.location.href = "/writers";
				});
			} else {
				loadBar.css("display", "none");

            	displayMessage("Виберiть правильно дати", 1);
			}
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
}