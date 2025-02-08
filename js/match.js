async function submitMatch() {
    const Match = Parse.Object.extend("Matches");
    const match = new Match();

    const date = document.getElementById("date").value;
    const leagueCode = document.getElementById("league-code").value;
    const storyteller = document.getElementById("storyteller").value;
    const players = document.getElementById("players").value.split(",").map(p => p.trim());
    const team = document.getElementById("team").value;
    const role = document.getElementById("role").value;
    const gameOutcome = document.getElementById("game-outcome").value;
    const stMistake = document.getElementById("st-mistake").value;
    const scriptPlayed = document.getElementById("script-played").value;
    const customScript = scriptPlayed === "Custom Script" ? document.getElementById("custom-script").value : "";

    if (!date || !leagueCode || !storyteller || players.length === 0 || !team || !role || !gameOutcome || !stMistake) {
        alert("Please fill in all required fields.");
        return;
    }

    match.set("date", new Date(date));
    match.set("league_code", leagueCode);
    match.set("storyteller", storyteller);
    match.set("script_played", scriptPlayed);
    match.set("custom_script", customScript);
    match.set("players", players);
    match.set("team", team);
    match.set("role", role);
    match.set("game_outcome", gameOutcome);
    match.set("st_mistake", stMistake);

    try {
        await match.save();
        alert("Match submitted successfully!");
        document.getElementById("match-form").reset();
        toggleCustomScript(); // Hide custom script field after reset
    } catch (error) {
        console.error("Error submitting match:", error);
        alert("Failed to submit match. " + error.message);
    }
}

// ✅ Ensure form actually calls `submitMatch()` on submit
document.getElementById("match-form").addEventListener("submit", function(event) {
    event.preventDefault();
    submitMatch();
});
