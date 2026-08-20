const FRASES = [
    "Pequenos passos também levam a grandes objetivos.",
    "Não procure uma rotina perfeita. Procure uma rotina possível.",
    "Você não precisa estudar tudo hoje. Precisa começar.",
    "Seu esforço de hoje constrói o resultado de amanhã.",
    "Cinco minutos podem ser o começo de uma boa sessão de estudos."
];

function exigirLogin() {
    if (localStorage.getItem("meuFocoLogado") !== "true") {
        window.location.href = "index.html";
    }
}

function obterUsuario() {
    return JSON.parse(localStorage.getItem("meuFocoUsuario")) || null;
}

function obterTarefas() {
    return JSON.parse(localStorage.getItem("meuFocoTarefas")) || [];
}

function salvarTarefas(tarefas) {
    localStorage.setItem("meuFocoTarefas", JSON.stringify(tarefas));
}

function formatarData(dataString) {
    if (!dataString) return "Sem prazo";
    const data = new Date(dataString + "T00:00:00");
    return data.toLocaleDateString("pt-BR");
}

function calcularPrioridade(tarefa) {
    let pontos = 0;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (tarefa.prazo) {
        const prazo = new Date(tarefa.prazo + "T00:00:00");
        const dias = Math.ceil((prazo - hoje) / 86400000);

        if (dias < 0) pontos += 100;
        else if (dias <= 1) pontos += 80;
        else if (dias <= 3) pontos += 60;
        else if (dias <= 7) pontos += 30;
    }

    if (tarefa.dificuldade === "alta") pontos += 30;
    if (tarefa.dificuldade === "media") pontos += 15;

    return pontos;
}

function renderizarTarefas() {
    const lista = document.getElementById("lista-tarefas");
    const tarefas = obterTarefas();

    if (tarefas.length === 0) {
        lista.innerHTML = "<p>Nenhuma tarefa cadastrada.</p>";
        atualizarProgresso([]);
        return;
    }

    const ordenadas = [...tarefas].sort((a, b) => {
        if (a.concluida !== b.concluida) return a.concluida ? 1 : -1;
        return calcularPrioridade(b) - calcularPrioridade(a);
    });

    lista.innerHTML = ordenadas.map(tarefa => `
        <article class="item-tarefa ${tarefa.concluida ? "concluida" : ""}">
            <div>
                <h3>${escaparHTML(tarefa.nome)}</h3>
                <p>Matéria: ${escaparHTML(tarefa.materia)}</p>
                <p>Prazo: ${formatarData(tarefa.prazo)}</p>
                <p>Prioridade: ${calcularPrioridade(tarefa) >= 80 ? "Urgente" : calcularPrioridade(tarefa) >= 40 ? "Importante" : "Pode esperar"}</p>
            </div>
            <div class="acoes-tarefa">
                <button type="button" class="botao botao-secundario" data-concluir="${tarefa.id}">
                    ${tarefa.concluida ? "Reabrir" : "Concluir"}
                </button>
                <button type="button" class="botao botao-perigo" data-excluir="${tarefa.id}">Excluir</button>
            </div>
        </article>
    `).join("");

    lista.querySelectorAll("[data-concluir]").forEach(botao => {
        botao.addEventListener("click", () => {
            const id = Number(botao.dataset.concluir);
            const tarefasAtualizadas = obterTarefas().map(tarefa =>
                tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
            );
            salvarTarefas(tarefasAtualizadas);
            renderizarTarefas();
        });
    });

    lista.querySelectorAll("[data-excluir]").forEach(botao => {
        botao.addEventListener("click", () => {
            const id = Number(botao.dataset.excluir);
            salvarTarefas(obterTarefas().filter(tarefa => tarefa.id !== id));
            renderizarTarefas();
        });
    });

    atualizarProgresso(tarefas);
}

function atualizarProgresso(tarefas) {
    const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;
    const pendentes = tarefas.length - concluidas;

    document.getElementById("tarefas-concluidas").textContent = concluidas;
    document.getElementById("tarefas-pendentes").textContent = pendentes;

    const minutos = Number(localStorage.getItem("meuFocoTempoEstudado") || 0);
    const horas = Math.floor(minutos / 60);
    const resto = String(minutos % 60).padStart(2, "0");
    document.getElementById("tempo-estudado").textContent = `${horas}h${resto}`;
}

function renderizarCronograma() {
    const usuario = obterUsuario();
    const lista = document.getElementById("lista-cronograma");

    if (!usuario) return;

    const inicio = usuario.rotina?.estudoInicio || "Não informado";
    const fim = usuario.rotina?.estudoFim || "Não informado";

    const materias = usuario.materiasDificeis
        ? usuario.materiasDificeis.split(",").map(m => m.trim()).filter(Boolean)
        : [];

    if (materias.length === 0) {
        lista.innerHTML = `<p>Você ainda não informou matérias difíceis. Atualize seu perfil.</p>`;
        return;
    }

    lista.innerHTML = materias.map((materia, indice) => `
        <article class="item-cronograma">
            <strong>${escaparHTML(materia)}</strong>
            <span>${indice % 2 === 0 ? inicio : fim} — sessão sugerida</span>
        </article>
    `).join("");
}

function sugerirEstudo() {
    const resultado = document.getElementById("resultado-estudar-agora");
    const pendentes = obterTarefas().filter(tarefa => !tarefa.concluida);

    if (pendentes.length === 0) {
        resultado.innerHTML = "<p>Você não possui tarefas pendentes. Aproveite para revisar algum conteúdo!</p>";
        return;
    }

    const melhor = [...pendentes].sort((a, b) => calcularPrioridade(b) - calcularPrioridade(a))[0];
    const prioridade = calcularPrioridade(melhor);

    resultado.innerHTML = `
        <div class="sugestao-estudo">
            <h3>Agora: ${escaparHTML(melhor.materia)}</h3>
            <p><strong>30 minutos</strong> sugeridos</p>
            <p>Prova/prazo: ${formatarData(melhor.prazo)}</p>
            <p>Prioridade: ${prioridade >= 80 ? "Alta" : prioridade >= 40 ? "Média" : "Normal"}</p>
            <p>Tarefa: ${escaparHTML(melhor.nome)}</p>
        </div>
    `;
}

function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[caractere]));
}

document.addEventListener("DOMContentLoaded", () => {
    exigirLogin();

    const usuario = obterUsuario();

    if (usuario) {
        document.getElementById("nome-usuario").textContent = usuario.nome.split(" ")[0];
    }

    document.getElementById("data-atual").textContent =
        new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const mostrarFrase = () => {
        const indice = Math.floor(Math.random() * FRASES.length);
        document.getElementById("frase-do-dia").textContent = FRASES[indice];
    };

    mostrarFrase();
    document.getElementById("nova-frase").addEventListener("click", mostrarFrase);

    document.getElementById("botao-estudar-agora").addEventListener("click", sugerirEstudo);

    document.getElementById("form-tarefa").addEventListener("submit", event => {
        event.preventDefault();

        const novaTarefa = {
            id: Date.now(),
            nome: document.getElementById("tarefa-nome").value.trim(),
            materia: document.getElementById("tarefa-materia").value.trim(),
            prazo: document.getElementById("tarefa-prazo").value,
            dificuldade: document.getElementById("tarefa-dificuldade").value,
            concluida: false
        };

        if (!novaTarefa.nome || !novaTarefa.materia || !novaTarefa.prazo) {
            document.getElementById("tarefa-mensagem").textContent = "Preencha os campos da tarefa.";
            return;
        }

        const tarefas = obterTarefas();
        tarefas.push(novaTarefa);
        salvarTarefas(tarefas);

        event.target.reset();
        document.getElementById("tarefa-mensagem").textContent = "Tarefa adicionada!";
        renderizarTarefas();
    });

    document.getElementById("botao-logout").addEventListener("click", () => {
        localStorage.removeItem("meuFocoLogado");
        window.location.href = "index.html";
    });

    renderizarTarefas();
    renderizarCronograma();
});
