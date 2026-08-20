document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-login");
    const mensagem = document.getElementById("login-mensagem");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("login-email").value.trim().toLowerCase();
        const senha = document.getElementById("login-senha").value;

        if (!email || !senha) {
            mensagem.textContent = "Preencha o e-mail e a senha.";
            return;
        }

        const usuario = JSON.parse(localStorage.getItem("meuFocoUsuario"));

        if (!usuario) {
            mensagem.textContent = "Nenhuma conta encontrada. Cadastre-se primeiro.";
            return;
        }

        if (email !== usuario.email.toLowerCase() || senha !== usuario.senha) {
            mensagem.textContent = "E-mail ou senha incorretos.";
            return;
        }

        localStorage.setItem("meuFocoLogado", "true");
        window.location.href = "inicio.html";
    });
});
