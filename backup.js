const body = document.querySelector("body");
const movies = document.querySelector(".movies");
const proximo = document.querySelector(".btn-next");
const anterior = document.querySelector(".btn-prev");
const input = document.querySelector(".input");
const destaque = document.querySelector(".highlight__video");
const destaqueTitulo = document.querySelector(".highlight__title");
const destaqueRating = document.querySelector(".highlight__rating");
const destaqueGenero = document.querySelector(".highlight__genres");
let destaqueGeneroArray = [];
const destaqueData = document.querySelector(".highlight__launch");
const destaqueDescricao = document.querySelector(".highlight__description");
const destaqueLink = document.querySelector(".highlight__video-link");
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Outubro", "Novembro", "Dezembro"];
const modal = document.querySelector(".modal");
const modalTitulo = document.querySelector(".modal__title");
const modalImagem = document.querySelector(".modal__img");
const modalDescricao = document.querySelector(".modal__description");
const modalRating = document.querySelector(".modal__average");
const modalGeneros = document.querySelector(".modal__genres");
const modalClose = document.querySelector(".modal__close");
const botaoTema = document.querySelector(".btn-theme");
const tema = localStorage.getItem("tema");
let movieNode;
let filmeId = "";
let mesTratado = "";
let indice = 1;

function temaClaro () {
    localStorage.setItem("tema", "claro");
    body.style.setProperty("--background-color", "#fff")
    body.style.setProperty("--color", "#242424");
    body.style.setProperty("--highlight-background", "#fff");
    body.style.setProperty("--highlight-description", "#242424");
    body.style.setProperty("--shadow-color", "0px 4px 8px rgba(0, 0, 0, 0.15)");
    body.style.setProperty("--input-border-color", "#979797");
    botaoTema.src = "./assets/light-mode.svg";
    anterior.src = "./assets/seta-esquerda-preta.svg";
    proximo.src = "./assets/seta-direita-preta.svg";
}

function temaEscuro () {
    localStorage.setItem("tema", "escuro");
    body.style.setProperty("--background-color", "#242424");
    body.style.setProperty("--color", "#fff");
    body.style.setProperty("--highlight-background", "#454545");
    body.style.setProperty("--highlight-description", "#fff");
    body.style.setProperty("--shadow-color", "0px 4px 8px rgba(256, 256, 256, 0.15)");
    body.style.setProperty("--input-border-color", "#fff");
    botaoTema.src = "./assets/dark-mode.svg";
    anterior.src = "./assets/seta-esquerda-branca.svg";
    proximo.src = "./assets/seta-direita-branca.svg";
}

    tema === "claro" ? temaClaro() : temaEscuro();

botaoTema.addEventListener("click", function (event) {
    localStorage.getItem("tema") === "claro" ? temaEscuro() : temaClaro();
});

function executarEventoModal (index) {
    movieNode = document.querySelectorAll(".movie");
    const movie = movieNode[index];
        movie.addEventListener("click", async function () {
            modalGeneros.innerHTML = "";
            filmeId = movie.dataset.id;

            console.log(movie.dataset.id);

            const resposta5 = await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/" + filmeId);

            const resTratada5 = await resposta5.json();

            modal.classList.remove("hidden");
            modalTitulo.textContent = resTratada5.title;
            modalImagem.src = resTratada5.backdrop_path;
            modalDescricao.textContent = resTratada5.overview;
            modalRating.textContent = resTratada5.vote_average;
            resTratada5.genres.forEach(genero => {
                const generos = document.createElement("span");
                generos.classList.add("modal__genre");
    
                generos.textContent = genero.name;
                modalGeneros.append(generos);
            });

            modalClose.addEventListener("click", function () {
                modal.classList.add("hidden");
            });
        });
}

function geradorMovies (item, index) {
    
    const movie = document.createElement("div");
    movie.classList.add("movie");

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie__info");

    const title = document.createElement("span");
    title.classList.add("movie__title");

    const voteAverage = document.createElement("span");
    voteAverage.classList.add("movie__rating");

    const estrelaClassificacao = document.createElement("img");

    movie.style.backgroundImage = `url(${item.poster_path})`;
    movie.dataset.id = item.id;
    title.textContent = item.title;
    voteAverage.textContent = item.vote_average;
    estrelaClassificacao.src = "./assets/estrela.svg";

    voteAverage.append(estrelaClassificacao);
    movieInfo.append(title, voteAverage);
    movie.append(movieInfo);
    movies.append(movie);

    executarEventoModal(index)
}

function primeirosFilmes (array) {
    array.forEach((filme, index) => {
        geradorMovies(filme, index);
    });
}

function removerFilmes (nodelist) {
    nodelist.forEach(film => {
        film.remove();
    });
}

function sistemaPaginacao (index, corpo) {
    const paginaUm = corpo.results.slice(0, 5);
    const paginaDois = corpo.results.slice(5, 10);
    const paginaTres = corpo.results.slice(10, 15);
    const paginaQuatro = corpo.results.slice(15, 20);

    if (index === 1) {
        paginaUm.forEach((filme, index2) => {
            geradorMovies(filme, index2);
        });
    }
    if (index === 2) {
        paginaDois.forEach((filme, index2) => {
            geradorMovies(filme, index2);
        });
    }
    if (index === 3) {
        paginaTres.forEach((filme, index2) => {
            geradorMovies(filme, index2);
        });
    }
    if (index === 4) {
        paginaQuatro.forEach((filme, index2) => {
            geradorMovies(filme, index2);
        });
    }
}
async function requisicao () {
    const resposta = await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR")

    const resTratada = await resposta.json();

    const paginaUm = resTratada.results.slice(0, 5);
    primeirosFilmes(paginaUm);

    proximo.addEventListener("click", function () {
        const films = document.querySelectorAll(".movie");
        removerFilmes(films);

        indice++;
        if (indice === 5) indice = 1;
        sistemaPaginacao(indice, resTratada);
    });
    anterior.addEventListener("click", function () {
        const films = document.querySelectorAll(".movie");
        removerFilmes(films);

        indice--;
        if (indice === 0) indice = 4;
        sistemaPaginacao(indice, resTratada);
    });

    input.addEventListener("keydown", async function (event) {
        const films = document.querySelectorAll(".movie");

        if (event.key !== "Enter") return;

        if (event.target.value === "") {
            indice = 1;
            removerFilmes(films);
            paginaUm.forEach((filme, index) => {
                geradorMovies(filme, index);
            });
            return;
        }
        const resposta2 = await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=" + event.target.value);
        const resTratada2 = await resposta2.json();
        
        const paginaBusca = resTratada2.results.slice(0, 5);

        removerFilmes(films);
        paginaBusca.forEach((busca, index) => {
            geradorMovies(busca, index);
        });
    });

    const resposta3 = await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR");

    const resTratada3 = await resposta3.json();
    resTratada3.genres.forEach(genero => {
        destaqueGeneroArray.push(genero.name);
    });

    let generos = destaqueGeneroArray.join(", ");
    const date = new Date(resTratada3.release_date);
    const dia = date.getDate();
    const mes = date.getMonth();

    if (mes === 0) mesTratado = meses[0];
    if (mes === 1) mesTratado = meses[1];
    if (mes === 2) mesTratado = meses[2];
    if (mes === 3) mesTratado = meses[3];
    if (mes === 4) mesTratado = meses[4];
    if (mes === 5) mesTratado = meses[5];
    if (mes === 6) mesTratado = meses[6];
    if (mes === 7) mesTratado = meses[7];
    if (mes === 8) mesTratado = meses[8];
    if (mes === 9) mesTratado = meses[9];
    if (mes === 10) mesTratado = meses[10];
    if (mes === 11) mesTratado = meses[11];

    const ano = date.getFullYear();

    destaque.style.backgroundImage = `url(${resTratada3.backdrop_path})`;
    destaqueTitulo.textContent = resTratada3.title;
    destaqueRating.textContent = resTratada3.vote_average;
    destaqueGenero.textContent = generos;
    destaqueData.textContent = dia + " de " + mesTratado + " de " + ano;
    destaqueDescricao.textContent = resTratada3.overview;

    const resposta4 = await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR");

    const resTratada4 = await resposta4.json();

    destaqueLink.href = "https://www.youtube.com/watch?v=" + resTratada4.results[0].key;
}

requisicao();

