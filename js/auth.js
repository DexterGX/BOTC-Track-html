// Initialize Back4App
Parse.initialize("YOUR_APP_ID", "YOUR_JAVASCRIPT_KEY"); 
Parse.serverURL = "https://parseapi.back4app.com/";

document.getElementById("login-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
        let user = await Parse.User.logIn(email, password);
    } catch (error) {
        let user = new Parse.User();
        user.set("username", email);
        user.set("email", email);
        user.set("password", password);
        await user.signUp();
    }
    document.getElementById("match-section").style.display = "block";
});

document.getElementById("logout").addEventListener("click", async function() {
    await Parse.User.logOut();
    document.getElementById("match-section").style.display = "none";
});
