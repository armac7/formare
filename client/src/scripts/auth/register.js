const regForm = document.getElementById('registerForm');

regForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(regForm);
    const data = Object.fromEntries(formData);

    const res = await fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },        body: JSON.stringify(data)
    });

    if (!res.ok) 
    {
        const errorMessage = await res.text()
        alert(`Error: ${errorMessage}`);
    }
    else
        window.location.replace("/login.html");
});