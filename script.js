async function autenticarUsuario(email, senha) {
    try {
        const resposta = await fetch('/api/login', {
    credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const resultado = await resposta.json();
        return resultado;
    } catch (erro) {
        console.error('Erro:', erro);
        return {
            sucesso: false,
            mensagem: 'Não foi possível conectar ao servidor.'
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const submitBtn = document.getElementById('submitBtn');

    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePasswordBtn.textContent = isPassword ? 'OCULTAR' : 'VER';
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        feedbackMessage.textContent = '';
        feedbackMessage.className = 'feedback-msg';

        const email = emailInput.value.trim().toLowerCase();
        const senha = passwordInput.value;

        if (!email || !senha) {
            feedbackMessage.textContent = 'Preencha o e-mail e a senha.';
            feedbackMessage.classList.add('error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Verificando...';

        const resultado = await autenticarUsuario(email, senha);

        if (resultado.sucesso) {
            feedbackMessage.textContent = resultado.mensagem;
            feedbackMessage.classList.add('success');

            setTimeout(() => {
                window.location.href = 'home.html';
            }, 800);
        } else {
            feedbackMessage.textContent = resultado.mensagem;
            feedbackMessage.classList.add('error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';
        }
    });
});