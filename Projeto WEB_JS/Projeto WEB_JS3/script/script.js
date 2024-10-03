let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
    { username: 'usuario1', password: 'senha1' },
    { username: 'usuario2', password: 'senha2' }
];

function salvarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function register(event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    if (!newUsername || !newPassword) {
        const registerMessage = document.getElementById('registerMessage');
        registerMessage.textContent = 'Por favor, preencha todos os campos.';
        registerMessage.style.color = 'red';
        return;
    }

    const userExists = usuarios.some(user => user.username === newUsername);

    if (userExists) {
        const registerMessage = document.getElementById('registerMessage');
        registerMessage.textContent = 'Este nome de usuário já está em uso.';
        registerMessage.style.color = 'red';
        return;
    }

    usuarios.push({ username: newUsername, password: newPassword });
    salvarUsuarios();
    alert('Cadastro realizado com sucesso! Você pode fazer login agora.');
    window.location.href = 'index.html';
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const usuario = usuarios.find(user => user.username === username && user.password === password);

    if (usuario) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('loggedInUser', username);
        window.location.href = 'index2.html';
    } else {
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.textContent = 'Usuário ou senha inválidos.';
        loginMessage.style.color = 'red';
    }
}

function verificarLogin() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInUser');
    alert("Você foi desconectado.");
    window.location.href = 'index.html';
}

function calcularCusto() {
    const precoPor15Minutos = parseFloat(document.getElementById('precoPor15Minutos').value);
    const tempoUso = parseInt(document.getElementById('tempoUso').value);

    if (isNaN(precoPor15Minutos) || isNaN(tempoUso) || precoPor15Minutos <= 0 || tempoUso <= 0) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    const total15Minutos = Math.ceil(tempoUso / 15);
    const total = total15Minutos * precoPor15Minutos;

    alert(`O valor a ser pago é: R$ ${total.toFixed(2)}`);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', register);
    }

    if (window.location.pathname.includes('index2.html')) {
        verificarLogin();

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.onclick = logout;
        }

        const calcularButton = document.getElementById('calcularButton');
        if (calcularButton) {
            calcularButton.onclick = calcularCusto;
        }
    }
});
