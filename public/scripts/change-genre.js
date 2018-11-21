{
    let 
        db = firebase.firestore(),

        genreName = document.getElementById('genre-name'),

        changeGenreButton = document.getElementById('change-genre-button'),

        black = document.getElementById("black"),
        loadBar = document.getElementById("load-bar"),

        link = window.location.pathname,
        key = link;

    key = key.substr(key.lastIndexOf("/") + 1);

    changeGenreButton.onclick = changeGenre;

    function changeGenre() {
        black.style.display = "block";
        loadBar.style.display = "block";

        let genreCol = db.collection("genres").doc(key);

        if (genreName.value !== "") {
            genreCol.get()
            .then(function(doc) {
                if (doc.exists) {
                    genreCol.update({
                        title: genreName.value
                    }).then(function() {
                        window.location.href = "/genres";
                    });
                } else {
                    black.style.display = "none";
                    loadBar.style.display = "none";

                    displayMessage("Документу не iснує", 1);
                }
            });
        } else {
            black.style.display = "none";
            loadBar.style.display = "none";

            displayMessage("Заповнiть усi поля", 1);
        }
    }
}