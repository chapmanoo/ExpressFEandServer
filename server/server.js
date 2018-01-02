let express = require("express");
let bodyParser = require("body-parser");
const cors = require("cors");
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin:"*"}))
app.get("/api/film", function (req, res) {
    res.send(films);
});

app.get("/api/film/:id", function (req, res) {
    const filmID = req.params.id;
    const currentFilm = films.find((film) => film.id == filmID);

    if (currentFilm) {
        res.json(currentFilm);
    } else {
        res.sendStatus(404);
    }
})

app.post("/api/film/", function (req, res) {
    let newFilm = req.body;
    if (isValidFilm(newFilm)) {
        films.push(newFilm);
        res.send(newFilm);
    }
});

function isValidFilm(film) {
    if (film.id != undefined) {
        if (film.title != undefined) {
            if (film.runTime != undefined) {
                if (film.release != undefined) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

app.put("/api/film/:id", function (req, res) {
    let filmID = req.params.id;
    let currentFilm = films.find((film) => film.id == filmID);

    if (currentFilm) {
        let newFilmDetails = req.body;

        currentFilm.name = newFilmDetails.name || currentFilm.name;
        currentFilm.runTime = newFilmDetails.runTime || currentFilm.runTime;
        currentFilm.release = newFilmDetails.release || currentFilm.release;
        
        res.send(currentFilm);
    } else {
        res.sendStatus(500);
    }


});

app.delete("/api/film/:id", function(req, res) {
    let filmID = req.params.id;
    let currentFilm = films.findIndex((film) => film.id == filmID);

    if(currentFilm !== -1) {
        films.splice(currentFilm, 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }

});

app.listen(3000, function () {
    console.log("This app is listening on port 3k!");
});

let films =
    [
        {
            "id": 1,
            "title": "Miracle on 34th Street",
            "runTime": 114,
            "release": 1994
        },
        {
            "id": 2,
            "title": "Elf",
            "runTime": 97,
            "release": 2003
        },
        {
            "id": 3,
            "title": "It's a Wonderful Life",
            "runTime": 130,
            "release": 1946
        }
    ];



