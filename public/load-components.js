document.addEventListener("DOMContentLoaded", async function() {
    // Load navbar
    const currPage = window.location.pathname.split("/").pop();
    console.log("Current page:", currPage); // Debugging log
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    try {
        const response = await fetch("/components/navbar.html");
        if (!response.ok) throw new Error("Failed to load navbar");

        navbar.innerHTML = await response.text();

        if (currPage === "index.html") {
            document.querySelector('a[href="index.html"]').classList.add("selected");
        } else if (currPage === "login.html") {
            document.querySelector('a[href="login.html"]').classList.add("selected");
        } else if (currPage === "register.html") {
            document.querySelector('a[href="register.html"]').classList.add("selected");
        }
    }
    catch (err) {
        console.error(err);
    }
});