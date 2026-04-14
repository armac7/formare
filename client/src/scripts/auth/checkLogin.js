export async function checkLogin() {
    const res = await fetch('/checkAuth', {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": 'application/json' 
        }
    });

    const userData = await res.json();
    // console.log("User Data ", userData); // DEBUG
    return userData;
}