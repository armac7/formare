export async function authenticate() 
{
    const res = await fetch('/auth', {
        method: "GET",
        credentials: "include",
        header: {
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) {
        window.location.replace("/login.html");
    }
}