{
	let 
		db = firebase.firestore(),

		signInBut = document.getElementById("sign-in-button"),

		userEmail = document.getElementById("sign-in-email"),
		userPassword = document.getElementById("sign-in-password"),

		loadBar = document.getElementById("load-bar");

	signInBut.onclick = signIn;

	function signIn() {
		loadBar.style.display = "block";

		firebase.auth().signInWithEmailAndPassword(userEmail.value, userPassword.value)
		.then(function() {
			db.collection("admins").where("email", "==", userEmail.value).get()
			.then(function(queryAdmins) {
				if (queryAdmins.size == 1) {
					setCookie("uid", firebase.auth().currentUser.uid);
					window.location.href = '/books';
				}

				else {
					loadBar.style.display = "none";

		      		displayMessage("Користувач не є адміністратором", 1);
				}
			});
		}).catch(function(error) {
			var 
				errorCode = error.code,
				errorMessage = error.message;
				
			loadBar.style.display = "none";

			displayMessage("Невірний логін або пароль", 1);
		});
	}
}