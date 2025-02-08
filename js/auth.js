// Initialize Back4App
Parse.initialize("s7C0Xt339QlyFlfufornKYww6AvgNPSjHgJ7rb5C", "WUHOoRAw4QUUwae5PVvDRE9MMAfPYyDUe1DRcJvY"); 
Parse.serverURL = "https://parseapi.back4app.com/";

// Redirect logged-in users away from login page
if (window.location.pathname.includes("login.html")) {
    if (localStorage.getItem("userName")) {
        window.location.href = "dashboard.html";
    }
    document.getElementById("login-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const user = await Parse.User.logIn(email, password);
            localStorage.setItem("userName", user.get("username"));
            localStorage.setItem("userEmail", email);
            window.location.href = "dashboard.html";
        } catch (error) {
            alert("Login failed: " + error.message);
        }
    });
}

// Signup form validation and submission (only runs on signup.html)
if (window.location.pathname.includes("signup.html")) {
    document.getElementById("signup-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (!name.trim()) {
            alert("Name is required!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Create a new Back4App user
        const user = new Parse.User();
        user.set("username", name);
        user.set("email", email);
        user.set("password", password);

        try {
            await user.signUp();
            alert("Account created successfully! Redirecting to login...");
            window.location.href = "login.html";
        } catch (error) {
            alert("Error signing up: " + error.message);
        }
    });
}

// Redirect if user is not logged in (Dashboard logic)
if (window.location.pathname.includes("dashboard.html")) {
    if (!localStorage.getItem("userName")) {
        window.location.href = "login.html";
    } else {
        document.getElementById("dashboard-message").innerHTML = `Welcome, ${localStorage.getItem("userName")}!`;
    }

    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            window.location.href = "login.html";
        });
    }
}
