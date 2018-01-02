const baseUrl = "http://localhost:3000/api/";

let onSuccess = (response) => {
    return response.json();
};
let onError = (error) => {
    console.log(error);
};

function get(url) {
    return fetch(baseUrl + url).then(onSuccess, onError);
}   

function del(url) {
    const request = new Request(baseUrl + url, {
        method: "DELETE"
    });
    return fetch(request).then(onSuccess, onError);
}

function create(film, url) {
    const request = new Request(baseUrl + url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(film)
    });
    return fetch(request).then(onSuccess, onError);
}

function put(film, url) {
    const request = new Request(baseUrl + url, {
        method: "PUT",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(film)
    });
    return fetch(request).then(onSuccess, onError);
}

export function createFilm(film) {
    return create(film, "film");
}

export function getFilm(id) {
    return get(`film/${id}`);
}

export function getFilms() {
    return get("film");
}
export function deleteFilm(id) {
    return del(`film/${id}`);
}
export function editFilm(film, id) {
    return put(film, `film/${id}`);
}