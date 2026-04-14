import { authenticate } from "/scripts/auth/authenticate.js";
import { checkLogin } from "/scripts/auth/checkLogin.js";
import { deleteUser } from "/scripts/auth/deleteUser.js";
import { logout } from "/scripts/auth/logout.js";
import { getProfile } from "/scripts/api/getProfile.js";

async function init() {
    const auth = await checkLogin();
    console.log(auth);

    const allowedPages = ["index.html", "login.html", "register.html"];
    const currPage = window.location.pathname.split("/").pop();
    if (!auth.loggedIn && !allowedPages.includes(currPage)) {
        window.location.replace("/login.html");
    }
};

init();

