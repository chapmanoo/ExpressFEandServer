//Imports
import { getFilms, getFilm, deleteFilm, createFilm, editFilm } from "./moviesApi.js"
let filmIDCount = 1;
let currentFilmID = -1;

//Given an array of films, output them all to the table and apply delete events.
function loadFilmsToScreen(filmList) {
    //output films to table
    let filmBody = "";
    filmList.forEach((film) => {
        filmBody += createTableDataFromFilm(film);
        filmIDCount++;
    });
    document
        .getElementById("filmDetails")
        .innerHTML = filmBody;
    applyDeleteEvents();
    applyEditEvents();
}

// Go through all the elements in the table that have the deleteFilm tag, give
// them the event to delete themselves.
function applyDeleteEvents() {
    // find all elements that have the classname "deleteFilm" and give them onclick
    // events to delete them.
    const deleteLinks = document.getElementsByClassName("deleteFilm");
    Array.from(deleteLinks, (link) => {
        link.onclick = deleteFilmFromTableAndDB;
    });
}

// Ran when they select an X on a table element, will submit a DELETE request and
// remove them from the table.
function deleteFilmFromTableAndDB(event) {
    const element = event.target;
    event.preventDefault();
    deleteFilm(element.attributes["data-id"].value);
    const row = element.parentNode.parentNode;
    row
        .parentNode
        .removeChild(row);
}

function applyEditEvents() {
    const editLinks = document.getElementsByClassName("editFilm");
    Array.from(editLinks, (link) => {
        link.onclick = prepFilmForEdit;
    });
}

function prepFilmForEdit(event) {
    toggleAll();
    const element = event.target;
    event.preventDefault();
    currentFilmID = element.attributes["data-id"].value;
    console.log(currentFilmID);
    let filmPop = getFilm(currentFilmID).then((response) => {
        document.getElementById("inputFilmTitle").value = response.title;
        document.getElementById("inputFilmRunTime").value = response.runTime;
        document.getElementById("inputFilmRelease").value = response.release;
    });

}

function saveChangesToFilm() {
    //save text box values to film of id
    editFilm(getFilmFromInputs(), currentFilmID);
    currentFilmID = -1;
    toggleAll();
    clearInputs();
    reloadTable();
}

//Given a film object, create HTML for it in the table.
function createTableDataFromFilm({ id, title, runTime, release }) {
    return `
    <tr>
        <td> <a href = "#" data-id="${id}" class="deleteFilm"> X </a> </td>
        <td>${title}</td>
        <td>${runTime}</td>
        <td>${release}</td>
        <td> <a href = "#" data-id="${id}" class="editFilm"> Edit </a> </td>
    </tr>`;
}

// Get film inputs from text boxes, then clear the text boxes, check if the inputs
// were all filled, submit a post request, get the result, append result to
// page.
function createAndAppendFilm() {
    const filmInput = getFilmFromInputs();
    clearInputs();
    if (isValidFilm(filmInput)) {
        Promise
            .resolve(createFilm(filmInput))
            .then((newFilm) => {
                document
                    .getElementById("filmDetails")
                    .innerHTML += createTableDataFromFilm(newFilm);
                applyDeleteEvents();
                applyEditEvents();
            });
    }
}

//Checks if a film has all the valid fields
function isValidFilm(film) {
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
}

function cancelEdit() {
    toggleAll();
    clearInputs();
}

//Clears the textboxes
function clearInputs() {
    document
        .getElementById("inputFilmTitle")
        .value = "";
    document
        .getElementById("inputFilmRunTime")
        .value = "";
    document
        .getElementById("inputFilmRelease")
        .value = "";
}

//Returns an object comprised of the data from the textboxes
function getFilmFromInputs() {
    return {
        id: filmIDCount++,
        title: document
            .getElementById("inputFilmTitle")
            .value,
        runTime: document
            .getElementById("inputFilmRunTime")
            .value,
        release: document
            .getElementById("inputFilmRelease")
            .value
    }
}

// Expose the createAndAppendFilm function for the button, otherwise it's stuck in
// here because of modules.
window.createAndAppendFilm = createAndAppendFilm;
window.saveChangesToFilm = saveChangesToFilm;
window.cancelEdit = cancelEdit;
window.reloadTable = reloadTable;

//On page load, load all films.
window.onload = function () {
    //load films into table, including delete events set to each element.
    reloadTable();
    toggleSave();
    toggleCancel();
}

function reloadTable() {
    const filmList = getFilms().then(loadFilmsToScreen);
}

function toggleSave() {
    document.getElementById("cmdSave").disabled = !document.getElementById("cmdSave").disabled;
}

function toggleCancel() {
    document.getElementById("cmdCancel").disabled = !document.getElementById("cmdCancel").disabled;
}

function toggleCreate() {
    document.getElementById("cmdCreate").disabled = !document.getElementById("cmdCreate").disabled;
}

function toggleAll() {
    toggleCancel();
    toggleCreate();
    toggleSave();
}