{
    let 
        db = firebase.firestore(),
        
        genreName = $('#genre-name'),
        addGenreButton = $('#add-genre-button'),

        loadBar = $("#load-bar");

    addGenreButton.on("click", addGenre);

    function addGenre() {
        loadBar.css("display", "block");

        let 
            genreCol = db.collection("genres"),
            key = genreCol.doc().id;

        if (genreName.val()) {
            genreCol.doc(key)
            .set({
                id: key,
                title: genreName.val(),
                dateOfAdd: new Date().getTime()
            }).then(function() {
                genreName.val(null);

                loadBar.css("display", "none");
                
                displayMessage("Жанр додано", 0);  
            });
        } else {
            loadBar.css("display", "none");

            displayMessage("Заповнiть усi поля", 1);
        }
    }
}