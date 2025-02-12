function toggleCustomScript() {
    var scriptSelect = document.getElementById("script-played");
    var customScriptGroup = document.getElementById("custom-script-group");
    customScriptGroup.style.display = scriptSelect.value === "Custom Script" ? "block" : "none";
}

function toggleRoleField() {
    var teamSelect = document.getElementById("team");
    var roleGroup = document.getElementById("role-group");
    var roleInput = document.getElementById("role");
    roleGroup.style.display = teamSelect.value === "Storyteller" ? "none" : "block";
    if (teamSelect.value === "Storyteller") roleInput.value = "";
}

function populateDropdown(dropdownId, values) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = "<option value=''>Select an option</option>";
    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", async function() {
    const user = await Parse.User.current();
    if (user) {
        populateDropdown("league-code", user.get("league_code") || []);
        populateDropdown("players", user.get("players") || []);
    }
});

function addCustomPlayer() {
    const input = document.getElementById("custom-player");
    const playersDropdown = document.getElementById("players");
    const newPlayer = input.value.trim();
    if (newPlayer) {
        const option = document.createElement("option");
        option.value = newPlayer;
        option.textContent = newPlayer;
        option.selected = true;
        playersDropdown.appendChild(option);
        input.value = "";
    }
}

document.getElementById("match-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission to handle manually
    
    const selectedPlayers = Array.from(document.getElementById("players").selectedOptions).map(option => option.value);
    console.log("Selected Players:", selectedPlayers);
    
    const matchData = {
        date: document.getElementById("date").value,
        leagueCode: document.getElementById("league-code").value,
        storyteller: document.getElementById("storyteller").value,
        scriptPlayed: document.getElementById("script-played").value,
        customScript: document.getElementById("custom-script").value,
        players: selectedPlayers,
        team: document.getElementById("team").value,
        role: document.getElementById("role").value,
        gameOutcome: document.getElementById("game-outcome").value,
        stMistake: document.getElementById("st-mistake").value
    };
    
    console.log("Submitting Match:", matchData);
    alert("Match submitted successfully!");
    window.location.href = "dashboard.html";
});