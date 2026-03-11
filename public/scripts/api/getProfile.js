document.addEventListener("DOMContentLoaded", function () {
    const currPage = window.location.pathname.split("/").pop();
    if (currPage === "profile.html") {
        getProfile().then(data => {
            if (data.loggedIn) {
                document.getElementById("usernameDisplay").textContent = data.username;
            } else {
                window.location.href = "/login.html";
            }
        });
    }
});

export async function getProfile() {
    try {
    const res = await fetch('/users/profile', {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": 'application/json'
        }
    })

    const data = await res.json();
        return data;
    } catch (err) {
        console.error("(getProfile backend function) Error fetching profile: ", err);
        return false;
    }
}