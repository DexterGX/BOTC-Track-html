async function showInput(fieldId) {
    document.getElementById(fieldId).style.display = 'none';
    document.getElementById(fieldId + '-input').style.display = 'inline-block';
    document.getElementById(fieldId + '-input').focus();
}

document.addEventListener("DOMContentLoaded", async function() {
    const user = await Parse.User.current();
    if (user) {
        document.getElementById("user-name").innerText = user.get("username") || "Not set";
        document.getElementById("favorite-character").innerText = user.get("favoriteCharacter") || "Not set";
        document.getElementById("profile-picture").src = user.get("profilePicture") || "../assets/default-profile.jpg";
    }

    document.getElementById("profile-picture").addEventListener("click", function () {
        document.getElementById("upload-profile-picture").click();
    });
    
    document.getElementById("upload-profile-picture").addEventListener("change", async function () {
        const fileInput = this;
        if (fileInput.files.length === 0) {
            return;
        }
        
        const file = fileInput.files[0];
        const parseFile = new Parse.File(file.name, file);
        
        try {
            await parseFile.save();
            user.set("profilePicture", parseFile.url());
            await user.save();
            document.getElementById("profile-picture").src = parseFile.url();
            alert("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("Failed to upload profile picture.");
        }
    });
});

document.getElementById("save-profile").addEventListener("click", async function() {
    const user = await Parse.User.current();
    if (!user) {
        alert("No user found.");
        return;
    }

    const userName = document.getElementById("user-name-input").value;
    if (userName) {
        user.set("username", userName);
    }

    const favoriteCharacter = document.getElementById("favorite-character-input").value;
    if (favoriteCharacter) {
        user.set("favoriteCharacter", favoriteCharacter);
    }

    try {
        await user.save();
        alert("Profile updated successfully!");
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
    }
});
