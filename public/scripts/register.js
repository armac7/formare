const regForm = document.getElementById('registerForm');

regForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(regForm);
    const data = Object.fromEntries(formData);

    const res = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },        body: JSON.stringify(data)
    });

    alert(await res.text());
});