const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);

    const res = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    alert(await res.text());
});