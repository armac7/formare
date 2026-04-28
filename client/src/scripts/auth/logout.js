export async function logout() 
{
    try {
        const res = await fetch('/api/auth/logout', {
            method: "POST",
            credentials: "include"
        });
        
        if (!res.ok) throw new Error("Logout failed");
    } catch (err) 
    {
        console.error("Logout Error: ", err);
    }
}