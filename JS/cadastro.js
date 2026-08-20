document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-cadastro");
    const mensagem = document.getElementById("cadastro-mensagem");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nome = document.getElementById("cadastro-nome").value.trim();
        const email = document.getElementById("cadastro-email").value.trim().toLowerCase();
        const senha = document.getElementById("cadastro-senha").value;
        const confirmacao = document.getElementById("cadastro-confirmacao").value;
        const objetivo = document.getElementById("objetivo").value;

        if (!nome || !email || !senha || !confirmacao || !objetivo) {
            mensagem.textContent = "Preencha todos os campos obrigatórios.";
            return;
        }

        if (senha.length < 6) {
            mensagem.textContent = "A senha precisa ter pelo menos 6 caracteres.";
            return;
        }

        if (senha !== confirmacao) {
            mensagem.textContent = "As senhas não coincidem.";
            return;
        }

        const usuarioExistente = JSON.parse(localStorage.getItem("meuFocoUsuario"));

        if (usuarioExistente && usuarioExistente.email.toLowerCase() === email) {
            mensagem.textContent = "Já existe uma conta com esse e-mail.";
            return;
        }

        const usuario = {
            nome,
            email,
            senha,
            rotina: {
                escolaInicio: document.getElementById("horario-escola-inicio").value,
                escolaFim: document.getElementById("horario-escola-fim").value,
                estudoInicio: document.getElementById("horario-estudo-inicio").value,
                estudoFim: document.getElementById("horario-estudo-fim").value
            },
            materiasDificeis: document.getElementById("materias-dificeis").value.trim(),
            provas: document.getElementById("dias-prova").value.trim(),
            objetivo
        };

        localStorage.setItem("meuFocoUsuario", JSON.stringify(usuario));

        const tarefasIniciais = [
            {
                id: Date.now(),
                nome: "Revisar conteúdo da semana",
                materia: usuario.materiasDificeis.split(",")[0]?.trim() || "Estudos",
                prazo: "",
                dificuldade: "media",
                concluida: false
            }
        ];

        localStorage.setItem("meuFocoTarefas", JSON.stringify(tarefasIniciais));
        localStorage.setItem("meuFocoTempoEstudado", "0");
        localStorage.setItem("meuFocoLogado", "true");

        window.location.href = "inicio.html";
    });
});
