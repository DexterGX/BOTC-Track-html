document.addEventListener("DOMContentLoaded", async function () {
    const userName = localStorage.getItem("userName");
    if (!userName) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("username").innerText = userName;

    // Simulate fetching user profile data from Back4App
    const user = await Parse.User.current();
    if (user) {
        document.getElementById("favorite-character").innerText = user.get("favoriteCharacter") || "Not set";
        document.getElementById("games-played").innerText = user.get("gamesPlayed") || 0;
        document.getElementById("win-rate").innerText = user.get("winRate") ? user.get("winRate") + "%" : "0%";
    }
});

async function loadUserMatches() {
    const currentUser = Parse.User.current();
    if (!currentUser) {
        console.error("No logged-in user found.");
        return;
    }

    const userId = currentUser.id; // Get the user's Back4App ID

    const Match = Parse.Object.extend("Matches");
    const query = new Parse.Query(Match);
    query.equalTo("submitted_by", userId); // Fetch matches where the user submitted them
    query.descending("date");

    try {
        const results = await query.find();
        const matchHistoryTable = document.querySelector("#match-history tbody");
        matchHistoryTable.innerHTML = "";

        if (results.length === 0) {
            matchHistoryTable.innerHTML = "<tr><td colspan='8' class='text-center'>No matches found.</td></tr>";
            return;
        }

        results.forEach(match => {
            const row = `<tr>
                <td>${match.get("date") ? match.get("date").toISOString().split("T")[0] : "N/A"}</td>
                <td>${match.get("league_code") || "N/A"}</td>
                <td>${match.get("storyteller") || "N/A"}</td>
                <td>${match.get("script_played") || "N/A"}</td>
                <td>${match.get("players") ? match.get("players").join(", ") : "N/A"}</td>
                <td>${match.get("team") || "N/A"}</td>
                <td>${match.get("role") || "N/A"}</td>
                <td>${match.get("game_outcome") || "N/A"}</td>
                <td>${match.get("st_mistake") || "N/A"}</td>
            </tr>`;
            matchHistoryTable.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading match history:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadUserMatches);

function toggleCustomScript() {
    var scriptSelect = document.getElementById("script-played");
    var customScriptGroup = document.getElementById("custom-script-group");
    if (scriptSelect.value === "Custom Script") {
        customScriptGroup.style.display = "block";
    } else {
        customScriptGroup.style.display = "none";
    }
}

// Ensure the function is loaded
document.addEventListener("DOMContentLoaded", function () {
    var scriptSelect = document.getElementById("script-played");
    if (scriptSelect) {
        scriptSelect.addEventListener("change", toggleCustomScript);
    }
});
