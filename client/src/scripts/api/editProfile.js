document.addEventListener('DOMContentLoaded', function() {
    const editInfoBtn = document.getElementById('editInfoBtn');

    const hideElements = [
            "usernameDisplay", 
            "passwordDisplay",
            "deleteAccountBtn",
            "editInfoBtn",
            "logoutBtn"
        ];

        const showElements = [
            "saveChangesBtn",
            "cancelEditBtn",
            "editUsername",
            "editPassword"
        ];

    editInfoBtn.addEventListener('click', function() {
        hideElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            } else {
                console.warn(`Element with ID '${id}' not found.`);
            }
        });

        showElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.remove('hidden');
                if (id === 'editUsername') {
                    element.value = document.getElementById('usernameDisplay').textContent;
                }
            } else {
                console.warn(`Element with ID '${id}' not found.`);
            }
        });
    });

    const saveChangesBtn = document.getElementById('saveChangesBtn');
    saveChangesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const newUsername = document.getElementById('editUsername').value;
        const newPassword = document.getElementById('editPassword').value;

        if (!newUsername || !newPassword) {
            alert("Please fill in both username and password fields.");
            return;
        };

        if (username === "") {
            alert("Username cannot be empty.");
            return;
        }
        if (password === "") {
            alert("Password cannot be empty.");
            return;
        }

        saveProfileChanges(newUsername, newPassword);
    });

    const cancelEditBtn = document.getElementById('cancelEditBtn');
    cancelEditBtn.addEventListener('click', function(e) {
        e.preventDefault();

        hideElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.remove('hidden');
            } else {
                console.warn(`Element with ID '${id}' not found.`);
            }
        });

        showElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            } else {
                console.warn(`Element with ID '${id}' not found.`);
            }
        });
    });
});

async function saveProfileChanges(username, password) {

    try {
        const res = await fetch('/users/profile', {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });

        if (res.ok) {
            alert("Profile updated successfully!");
            window.location.reload();
        } else {
            const errorData = await res.json();
            alert("Error updated profile: ", errorData.message || "Unknown error");
        }
    } catch (err) {
        console.error("(saveProfileChanges backend function) Error updating profile: ", err);
        alert("Error updating profile. Please try again later.");
    };
};