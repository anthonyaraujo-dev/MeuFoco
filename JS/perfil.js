function obterUsuario() {
    return JSON.parse(localStorage.getItem("meuFocoUsuario")) || null;
}

function preencherPerfil() {
    const usuario = obterUsuario();

    if (!usuario) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("perfil-nome").value = usuario.nome || "";
    document.getElementById("perfil-email").value = usuario.email || "";
    document.getElementById("perfil-materias").value = usuario.materiasDificeis || "";
    document.getElementById("perfil-objetivo").value = usuario.objetivo || "melhorar-notas";
    document.getElementById("perfil-horario-inicio").value = usuario.rotina?.estudoInicio || "";
    document.getElementById("perfil-horario-fim").value = usuario.rotina?.estudoFim || "";
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("meuFocoLogado") !== "true") {
        window.location.href = "index.html";
        return;
    }

    preencherPerfil();

    document.getElementById("form-perfil").addEventListener("submit", event => {
        event.preventDefault();

        const usuario = obterUsuario();

        usuario.nome = document.getElementById("perfil-nome").value.trim();
        usuario.email = document.getElementById("perfil-email").value.trim().toLowerCase();
        usuario.materiasDificeis = document.getElementById("perfil-materias").value.trim();
        usuario.objetivo = document.getElementById("perfil-objetivo").value;
        usuario.rotina = usuario.rotina || {};
        usuario.rotina.estudoInicio = document.getElementById("perfil-horario-inicio").value;
        usuario.rotina.estudoFim = document.getElementById("perfil-horario-fim").value;

        if (!usuario.nome || !usuario.email) {
            document.getElementById("perfil-mensagem").textContent = "Nome e e-mail são obrigatórios.";
            return;
        }

        localStorage.setItem("meuFocoUsuario", JSON.stringify(usuario));
        document.getElementById("perfil-mensagem").textContent = "Perfil atualizado com sucesso!";
    });

    document.getElementById("botao-backup").addEventListener("click", () => {
        const dados = {
            usuario: obterUsuario(),
            tarefas: JSON.parse(localStorage.getItem("meuFocoTarefas")) || [],
            tempoEstudado: Number(localStorage.getItem("meuFocoTempoEstudado") || 0)
        };

        const arquivo = new Blob([JSON.stringify(dados, null, 2)], {
            type: "application/json"
        });

        const url = URL.createObjectURL(arquivo);
        const link = document.createElement("a");
        link.href = url;
        link.download = "backup-meu-foco.json";
        link.click();
        URL.revokeObjectURL(url);

        document.getElementById("conta-mensagem").textContent = "Backup criado com sucesso!";
    });

    document.getElementById("botao-excluir").addEventListener("click", () => {
        const confirmou = confirm(
            "Tem certeza que deseja excluir sua conta? Esta ação apagará os dados salvos neste navegador."
        );

        if (!confirmou) return;

        localStorage.removeItem("meuFocoUsuario");
        localStorage.removeItem("meuFocoTarefas");
        localStorage.removeItem("meuFocoTempoEstudado");
        localStorage.removeItem("meuFocoLogado");

        window.location.href = "index.html";
    });

    document.getElementById("botao-logout").addEventListener("click", () => {
        localStorage.removeItem("meuFocoLogado");
        window.location.href = "index.html";
    });
});
