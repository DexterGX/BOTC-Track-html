document.getElementById("match-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const user = Parse.User.current();
    if (!user) {
        alert("Please log in first.");
        return;
    }
    
    const Match = Parse.Object.extend("Match");
    const match = new Match();
    match.set("storyteller", document.getElementById("storyteller").value);
    match.set("date", document.getElementById("date").value);
    match.set("players", document.getElementById("players").value);
    match.set("winner", document.getElementById("winner").value);
    match.set("owner", user);
    
    await match.save();
    loadMatches();
});

async function loadMatches() {
    const user = Parse.User.current();
    if (!user) return;

    const Match = Parse.Object.extend("Match");
    const query = new Parse.Query(Match);
    query.equalTo("owner", user);
    query.descending("createdAt");

    const results = await query.find();
    const tableBody = document.querySelector('#match-history tbody');
    tableBody.innerHTML = '';
    results.forEach(match => {
        const row = `<tr>
            <td>${match.get("date")}</td>
            <td>${match.get("storyteller")}</td>
            <td>${match.get("players")}</td>
            <td>${match.get("winner")}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}
