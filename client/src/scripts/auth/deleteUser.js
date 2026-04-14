import { checkLogin } from "/scripts/auth/checkLogin.js";

export async function deleteUser() {
    const auth = await checkLogin();

    if (!auth.loggedIn) {
        console.error("User not logged in");
        return;
    }

    const username = auth.username;
    if (!confirm("Are you sure you want to delete user: " + username + "? This action cannot be undone.")) {
        return;
    }

    try {
        const res = await fetch(`/users/me`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Hello");

        if (!res.ok) {
            const errorMessage = await res.text();
            console.error("Delete User Failed: ", errorMessage);
            return;
        }

        console.log(`User ${username} deleted successfully`);
        window.location.replace("/index.html?cachebust=" + Date.now());
    } catch (err) {
        console.error("Delete User Error: ", err);
    }
}

window.deleteUser = deleteUser; // Expose the function to the global scope for use in HTML onclick handlers