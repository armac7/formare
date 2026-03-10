import { checkLogin } from "/scripts/auth/checkLogin.js";
import { deleteUser } from "/scripts/auth/deleteUser.js";
import { logout } from "/scripts/auth/logout.js";

async function init() {
    const auth = await checkLogin();
    console.log(auth);
}

init();