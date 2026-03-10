export async function logout() 
{
    try {
        const res = await fetch('/logout', {
            method: "POST",
            credentials: "include"
        });
        
        if (!res.ok) throw new Error("Logout failed");

        // console.log("Redirecting..."); //DEBUG
        window.location.replace("/index.html?cachebust=" + Date.now());
    } catch (err) 
    {
        console.error("Logout Error: ", err);
    }
}