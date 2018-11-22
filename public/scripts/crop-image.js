{	
	let
		cropPage = $("#crop-bar"),
		viewDivNav = $("#crop-view-nav"),
		cropAccept = $('#img-crop-accept'),
		cropCancel = $("#img-crop-cancel"),
		black = $(".black").eq(0),

		addImageBut = $("#add-image"),
		image = document.getElementById("img");

	function displayCropDiv(ratio) {
		var 
			viewDiv = document.getElementById("crop-view-image"),
			imageView = document.getElementById("view-image"),
			viewClone = viewDiv.cloneNode(true);

		imageView.src = window.URL.createObjectURL(addImageBut[0].files[0]);
		
		let	cropper = new Cropper(imageView, {
			aspectRatio: ratio,
		});

		cropPage.css("display", "block");
		black.css("display", "block");

		cropAccept.on("click", cropImg);
		cropCancel.on("click", cropClose);

		function cropImg() {
			let srcImage = cropper.getCroppedCanvas().toDataURL();
			image.src = srcImage;

			cropClose();
		}

		function cropClose() {
			cropPage.css("display", "none");
			black.css("display", "none");

			viewDiv.remove();
			viewDivNav.append(viewClone);
		}
	}

	function dataURLtoFile(dataurl, filename) {
		var 
			arr = dataurl.split(','), 
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), 
			n = bstr.length, 
			u8arr = new Uint8Array(n);

		while(n--)
			u8arr[n] = bstr.charCodeAt(n);

		return new File([u8arr], filename, {type: mime});
	}
}