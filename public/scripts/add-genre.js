{
    let 
        db = firebase.firestore(),

        genreName = document.getElementById('genre-name'),

        addGenreButton = document.getElementById('add-genre-button'),

        black = document.getElementById("black"),
        loadBar = document.getElementById("load-bar");

    addGenreButton.onclick = addGenre;

    function addGenre() {
        black.style.display = "block";
        loadBar.style.display = "block";

        let 
            genreCol = db.collection("genres"),
            key = genreCol.doc().id;

        if (genreName.value !== "") {
            genreCol.doc(key)
            .set({
                id: key,
                title: genreName.value,
                dateOfAdd: new Date().getTime()
            }).then(function() {
                genreName.value = "";

                black.style.display = "none";
                loadBar.style.display = "none";
                
                displayMessage("Жанр додано", 0);  
            });
        } else {
            black.style.display = "none";
            loadBar.style.display = "none";

            displayMessage("Заповнiть усi поля", 1);
        }
    }
}