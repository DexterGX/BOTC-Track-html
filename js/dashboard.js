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

async function loadMatches() {
    const Match = Parse.Object.extend("Matches");
    const query = new Parse.Query(Match);
    query.descending("date");

    try {
        const results = await query.find();
        const matchList = document.getElementById("match-history");
        matchList.innerHTML = "";

        results.forEach(match => {
            const row = `<tr>
                <td>${match.get("date").iso.split("T")[0]}</td>
                <td>${match.get("league_code")}</td>
                <td>${match.get("storyteller")}</td>
                <td>${match.get("players").join(", ")}</td>
                <td>${match.get("team")}</td>
                <td>${match.get("role")}</td>
                <td>${match.get("game_outcome")}</td>
                <td>${match.get("st_mistake")}</td>
            </tr>`;
            matchList.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching matches:", error);
    }
}

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
