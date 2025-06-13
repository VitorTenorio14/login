document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('registerMsg').textContent = 'Cadastro realizado com sucesso! Redirecionando...';
      setTimeout(() => window.location.href = 'index.html', 2000);
    } else {
      document.getElementById('registerMsg').textContent = data.message || 'Erro ao cadastrar.';
    }
  } catch (err) {
    console.error('Erro no cadastro:', err);
    document.getElementById('registerMsg').textContent = 'Erro ao conectar com o servidor.';
  }
});
