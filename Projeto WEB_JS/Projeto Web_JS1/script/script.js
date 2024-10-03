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
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

function addToCart(name, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));  
    alert(`${name} foi adicionado ao carrinho.`);
}

function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartElement = document.getElementById('cart');
    const cartTotalElement = document.getElementById('total');
    cartElement.innerHTML = "";

    if (cart.length === 0) {
        cartElement.innerHTML = "<p>O carrinho está vazio.</p>";
        cartTotalElement.innerHTML = "";
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart('${item.name}')">Remover</button>
        `;
        cartElement.appendChild(itemElement);
    });

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotalElement.innerHTML = `Total: R$ ${total.toFixed(2)}`;
}

function removeFromCart(name) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}
function calcularPromocao(preco) {
    const total = preco * 2;
    const desconto = total % 1; 
    const precoPromocional = total - desconto; 
    alert(`O valor do produto na promoção é: R$ ${precoPromocional.toFixed(2)}`);
}

function finalizarCompra() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
    }
    localStorage.removeItem('cart');
    alert('Compra finalizada com sucesso!');
    window.location.href = 'index2.html';
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

    if (window.location.pathname.includes('index3.html')) {
        verificarLogin();
        updateCart();

        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = 'Finalizar Compra';
        checkoutButton.className = 'checkout-button';
        checkoutButton.onclick = finalizarCompra;
        document.getElementById('total').appendChild(checkoutButton);
    }

    if (window.location.pathname.includes('index2.html') || window.location.pathname.includes('index3.html')) {
        verificarLogin();
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.onclick = logout;
        }

        const addToCartButtons = document.querySelectorAll('.addToCartButton');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const produtoElement = button.parentElement;
                const nome = produtoElement.querySelector('h4').textContent;
                const precoText = produtoElement.querySelector('p').textContent;
                const preco = parseFloat(precoText.replace('Preço: R$', '').replace(',', '.'));
                addToCart(nome, preco);
            });
        });
    }
});
