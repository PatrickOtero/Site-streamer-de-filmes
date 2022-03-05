const body = document.querySelector("body");
const movies = document.querySelector(".movies");
const proximo = document.querySelector(".btn-next");
const anterior = document.querySelector(".btn-prev");
const input = document.querySelector(".input");
const destaque = document.querySelector(".highlight__video");
destaque.style.backgroundPosition = "center";
destaque.style.backgroundSize = "cover";
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
const info = document.querySelector(".info");
const modalInt = document.querySelector(".modal-interrogation");
const mensagemBusca = document.querySelector(".busca-zero");
const containerFilmes = document.querySelector(".movies-container");
let movieNode;
let filmeId = "";
let mesTratado = "";
const paginasIniciais = [];
let paginasDeBusca = [];
let paginasDeBuscaTratada;
let indice = 0;

info.addEventListener("click", function() {
    modalInt.classList.toggle("hidden");
});

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
}

function geradorPaginas (array, arrayCorpo) {
    const arrayFiltrado = arrayCorpo.results.filter(dados => dados.adult === false && dados.title && dados.poster_path && dados.vote_average > 0);

    array.push(arrayFiltrado.slice(0, 5));
    array.push(arrayFiltrado.slice(5, 10));
    array.push(arrayFiltrado.slice(10, 15));
    array.push(arrayFiltrado.slice(15, 20));
    paginasDeBuscaTratada = array.filter(pagina => pagina.length > 0);
    if (array[0].length <= 0) {
        containerFilmes.classList.add("hidden");
        mensagemBusca.classList.remove("hidden");
    } 
    if (array[0].length > 0) {
        containerFilmes.classList.remove("hidden");
        mensagemBusca.classList.add("hidden");
    }
}

function esconderFilmes () {
    const filmes = document.querySelectorAll(".movie");
    filmes.forEach(filme => {
        filme.classList.add("hidden");
    });
}

function exibirModal () {
    movieNode = document.querySelectorAll(".movie");
    movieNode.forEach(movie => {
        movie.addEventListener("click", async function () {
            modalGeneros.innerHTML = "";
            filmeId = movie.dataset.id;

            const resTratada5 = await(await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/" + filmeId)).json();

            modal.classList.remove("hidden");
            modalTitulo.textContent = resTratada5.title
            modalImagem.src = resTratada5.backdrop_path ? resTratada5.backdrop_path : "";
            modalDescricao.textContent = resTratada5.overview ? resTratada5.overview : "";
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
    });
}

function primeirosFilmes (array) {
    esconderFilmes();
    array.forEach(filme => {
        geradorMovies(filme);
    });
    exibirModal();
}

function paginacao (index, array) {
    esconderFilmes();
    array[index].forEach((filme, index2) => {
        geradorMovies(filme);
    });
    exibirModal();
}

function sistemaDePaginacao (index, array) {
    proximo.addEventListener("click", function () {
        index = index < array.length-1 ? ++index : index = 0;
        paginacao(index, array);
    });
    
    anterior.addEventListener("click", function () {
        index > 0 ? --index : index = array.length-1;
        paginacao(index, array);
    });
}

async function requisicao () {
    const resTratada = await (await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR")).json();
     geradorPaginas(paginasIniciais, resTratada);
     primeirosFilmes(paginasIniciais[0]);
     sistemaDePaginacao(indice, paginasIniciais);

    input.addEventListener("keydown", async function (event) {        
        if (event.key !== "Enter") return;
        if (event.target.value === "") {
            containerFilmes.classList.remove("hidden");
            mensagemBusca.classList.add("hidden");
            indice = 0;
            primeirosFilmes(paginasIniciais[0]);
            sistemaDePaginacao(indice, paginasIniciais);
            return;
        }
        const resTratada2 = await(await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=" + event.target.value)).json();
        event.target.value = "";
        paginasDeBusca = [];
        geradorPaginas(paginasDeBusca, resTratada2);
        primeirosFilmes(paginasDeBusca[0]);
        sistemaDePaginacao(indice, paginasDeBuscaTratada);
    });

    const resTratada3 = await(await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR")).json();
    
    resTratada3.genres.forEach(genero => {
        destaqueGeneroArray.push(genero.name);
    });
    
    let generos = destaqueGeneroArray.join(", ");
    const date = new Date(resTratada3.release_date);
    const dia = date.getDate();
    const mes = date.getMonth();
    const ano = date.getFullYear();

    mesTratado = meses[mes]
        
    destaque.style.backgroundImage = `url(${resTratada3.backdrop_path})`;
    destaqueTitulo.textContent = resTratada3.title;
    destaqueRating.textContent = resTratada3.vote_average;
    destaqueGenero.textContent = generos;
    destaqueData.textContent = dia + " de " + mesTratado + " de " + ano;
    destaqueDescricao.textContent = resTratada3.overview;
    
    const resTratada4 = await(await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR")).json();
    
    destaqueLink.href = "https://www.youtube.com/watch?v=" + resTratada4.results[0].key;
}

requisicao();

