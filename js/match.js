async function submitMatch() {
    const Match = Parse.Object.extend("Matches");
    const match = new Match();
    
    const currentUser = Parse.User.current();
    if (!currentUser) {
        alert("You must be logged in to submit a match.");
        return;
    }

    const userId = currentUser.id; // Get user ID from Back4App

    const date = document.getElementById("date").value;
    const leagueCode = document.getElementById("league-code").value;
    const storyteller = document.getElementById("storyteller").value;
    const players = document.getElementById("players").value.split(",").map(p => p.trim());
    const team = document.getElementById("team").value;
    const roleInput = document.getElementById("role");
    const role = team === "Storyteller" ? "" : roleInput.value; // Only require role if not Storyteller
    const gameOutcome = document.getElementById("game-outcome").value;
    const stMistake = document.getElementById("st-mistake").value;
    const scriptPlayed = document.getElementById("script-played").value;
    const customScript = scriptPlayed === "Custom Script" ? document.getElementById("custom-script").value : "";

    if (!date || !leagueCode || !storyteller || players.length === 0 || !team || !gameOutcome || !stMistake) {
        alert("Please fill in all required fields.");
        return;
    }

    // If not a storyteller, ensure the role is provided
    if (team !== "Storyteller" && !role) {
        alert("Please enter your role.");
        return;
    }

    match.set("date", new Date(date));
    match.set("league_code", leagueCode);
    match.set("storyteller", storyteller);
    match.set("script_played", scriptPlayed);
    match.set("custom_script", customScript);
    match.set("players", players);
    match.set("team", team);
    match.set("role", role); // Role will be empty if user is a storyteller
    match.set("game_outcome", gameOutcome);
    match.set("st_mistake", stMistake);
    match.set("submitted_by", userId); // Save User ID

    try {
        await match.save();
        alert("Match submitted successfully!");
        document.getElementById("match-form").reset();
        toggleCustomScript();
        window.location.href = "dashboard.html"; // Redirect back to dashboard after submission
    } catch (error) {
        console.error("Error submitting match:", error);
        alert("Failed to submit match.");
    }
}

document.getElementById("match-form").addEventListener("submit", function(event) {
    event.preventDefault();
    submitMatch();
});
