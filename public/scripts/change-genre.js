{
    let 
        db = firebase.firestore(),

        genreName = $('#genre-name'),
        changeGenreButton = $('#change-genre-button'),

        loadBar = $("#load-bar"),

        link = window.location.pathname,
        key = link;

    key = key.substr(key.lastIndexOf("/") + 1);

    changeGenreButton.on("click", changeGenre);

    function changeGenre() {
        loadBar.css("display", "block");

        let genreCol = db.collection("genres").doc(key);

        if (genreName.val()) {
            genreCol.get()
            .then(function(doc) {
                if (doc.exists) {
                    genreCol.update({
                        title: genreName.val()
                    }).then(function() {
                        window.location.href = "/genres";
                    });
                } else {
                    loadBar.css("display", "none");

                    displayMessage("Документу не iснує", 1);
                }
            });
        } else {
            loadBar.css("display", "none");

            displayMessage("Заповнiть усi поля", 1);
        }
    }
}