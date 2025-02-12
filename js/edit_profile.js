async function showInput(fieldId) {
    document.getElementById(fieldId).style.display = 'none';
    const inputField = document.getElementById(fieldId + '-input');
    inputField.style.display = 'inline-block';
    inputField.value = document.getElementById(fieldId).innerText !== "Not set" ? document.getElementById(fieldId).innerText : "";
    inputField.focus();
}

document.addEventListener("DOMContentLoaded", async function() {
    const user = await Parse.User.current();
    if (user) {
        document.getElementById("user-name").innerText = user.get("username") || "Not set";
        document.getElementById("favorite-character").innerText = user.get("favoriteCharacter") || "Not set";
        document.getElementById("profile-picture").src = user.get("profilePicture") || "../assets/default-profile.jpg";
        document.getElementById("league-code").innerText = user.get("league_code") ? user.get("league_code").join(", ") : "Not set";
        document.getElementById("players").innerText = user.get("players") ? user.get("players").join(", ") : "Not set";
    
        // Populate dropdowns in match submission form
        populateDropdown("league-code-dropdown", user.get("league_code") || []);
        populateDropdown("players-dropdown", user.get("players") || []);
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

function populateDropdown(dropdownId, values) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = "";
    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}

document.getElementById("save-profile").addEventListener("click", async function() {
    const user = await Parse.User.current();
    if (!user) {
        alert("No user found.");
        return;
    }

    // Fetch existing data to avoid overwriting other fields
    await user.fetch();

    const userName = document.getElementById("user-name-input").value;
    if (userName) {
        user.set("username", userName);
    }

    const favoriteCharacter = document.getElementById("favorite-character-input").value;
    if (favoriteCharacter) {
        user.set("favoriteCharacter", favoriteCharacter);
    }

    const leagueCodes = document.getElementById("league-code-input").value.split(",").map(code => code.trim()).filter(code => code);
    if (leagueCodes.length > 0) {
        user.set("league_code", leagueCodes);
    }

    const players = document.getElementById("players-input").value.split(",").map(player => player.trim()).filter(player => player);
    if (players.length > 0) {
        user.set("players", players);
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
