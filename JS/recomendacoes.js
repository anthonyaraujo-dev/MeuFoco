const RECOMENDACOES = [
    {
        materia: "matematica",
        tipo: "videoaula",
        titulo: "Revisão de Matemática",
        descricao: "Videoaula para revisar um conteúdo antes de praticar.",
        acao: "Assistir"
    },
    {
        materia: "matematica",
        tipo: "exercicios",
        titulo: "Lista de exercícios",
        descricao: "Pratique o conteúdo e identifique seus erros.",
        acao: "Praticar"
    },
    {
        materia: "fisica",
        tipo: "apostila",
        titulo: "Apostila de Física",
        descricao: "Material de apoio para compreender conceitos e fórmulas.",
        acao: "Estudar"
    },
    {
        materia: "quimica",
        tipo: "quiz",
        titulo: "Quiz de Química",
        descricao: "Teste rapidamente o que você já aprendeu.",
        acao: "Responder"
    },
    {
        materia: "quimica",
        tipo: "podcast",
        titulo: "Podcast de Química",
        descricao: "Revisão em formato de áudio para momentos de deslocamento.",
        acao: "Ouvir"
    },
    {
        materia: "biologia",
        tipo: "videoaula",
        titulo: "Videoaula de Biologia",
        descricao: "Recurso para reforçar um conteúdo com explicação visual.",
        acao: "Assistir"
    },
    {
        materia: "historia",
        tipo: "apostila",
        titulo: "Apostila de História",
        descricao: "Material de revisão para organizar os principais acontecimentos.",
        acao: "Estudar"
    },
    {
        materia: "linguagens",
        tipo: "quiz",
        titulo: "Quiz de Linguagens",
        descricao: "Pratique interpretação e conteúdos de Linguagens.",
        acao: "Responder"
    }
];

function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[caractere]));
}

function renderizarRecomendacoes() {
    const materia = document.getElementById("filtro-materia").value;
    const tipo = document.getElementById("filtro-tipo").value;
    const lista = document.getElementById("lista-recomendacoes");

    const filtradas = RECOMENDACOES.filter(item =>
        (materia === "todas" || item.materia === materia) &&
        (tipo === "todos" || item.tipo === tipo)
    );

    if (filtradas.length === 0) {
        lista.innerHTML = "<p>Nenhuma recomendação encontrada para esses filtros.</p>";
        return;
    }

    lista.innerHTML = filtradas.map(item => `
        <article class="card-recomendacao">
            <span class="tag-recomendacao">${escaparHTML(item.tipo)}</span>
            <h2>${escaparHTML(item.titulo)}</h2>
            <p>${escaparHTML(item.descricao)}</p>
            <button type="button" class="botao botao-principal" data-recurso="${escaparHTML(item.titulo)}">
                ${escaparHTML(item.acao)}
            </button>
        </article>
    `).join("");

    lista.querySelectorAll("[data-recurso]").forEach(botao => {
        botao.addEventListener("click", () => {
            alert(`Recurso selecionado: ${botao.dataset.recurso}\n\nEm uma versão futura, este botão poderá abrir o conteúdo real.`);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("meuFocoLogado") !== "true") {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("filtro-materia").addEventListener("change", renderizarRecomendacoes);
    document.getElementById("filtro-tipo").addEventListener("change", renderizarRecomendacoes);
    document.getElementById("botao-logout").addEventListener("click", () => {
        localStorage.removeItem("meuFocoLogado");
        window.location.href = "index.html";
    });

    renderizarRecomendacoes();
});
