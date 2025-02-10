
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

    await loadUserMatches(); // Load match history
    assignRowClasses(); // Assign classes to rows after loading matches
});

let currentPage = 1;
const matchesPerPage = 10;
let matchesData = [];

async function loadUserMatches() {
    const currentUser = Parse.User.current();
    if (!currentUser) {
        console.error("No logged-in user found.");
        return;
    }

    const userId = currentUser.id;
    const Match = Parse.Object.extend("Matches");
    const query = new Parse.Query(Match);
    query.equalTo("submitted_by", userId);
    query.descending("date"); // Sort by date first
    query.descending("createdAt"); // Sort by submission time within the same date

    try {
        matchesData = await query.find();

        // Ensure sorting is applied properly
        matchesData.sort((a, b) => {
            const dateA = new Date(a.get("date"));
            const dateB = new Date(b.get("date"));
            
            if (dateA.getTime() !== dateB.getTime()) {
                return dateB - dateA; // Sort by date (latest first)
            }
            return b.createdAt - a.createdAt; // Sort by submission time (latest first)
        });

        updateMatchTable();
    } catch (error) {
        console.error("Error loading match history:", error);
    }
}

function updateMatchTable() {
    const matchHistoryTable = document.querySelector("#match-history tbody");
    matchHistoryTable.innerHTML = "";

    const startIndex = (currentPage - 1) * matchesPerPage;
    const endIndex = startIndex + matchesPerPage;
    const paginatedMatches = matchesData.slice(startIndex, endIndex);

    if (paginatedMatches.length === 0) {
        matchHistoryTable.innerHTML = "<tr><td colspan='9' class='text-center'>No matches found.</td></tr>";
        return;
    }

    paginatedMatches.forEach(match => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${match.get("date") ? match.get("date").toISOString().split("T")[0] : "N/A"}</td>
            <td>${match.get("league_code") || "N/A"}</td>
            <td>${match.get("storyteller") || "N/A"}</td>
            <td>${match.get("script_played") || "N/A"}</td>
            <td>${match.get("players") ? match.get("players").join(", ") : "N/A"}</td>
            <td>${match.get("team") || "N/A"}</td>
            <td>${match.get("role") || "N/A"}</td>
            <td>${match.get("game_outcome") || "N/A"}</td>
            <td>${match.get("st_mistake") || "N/A"}</td>
        `;
        matchHistoryTable.appendChild(row);
    });

    assignRowClasses();

    document.getElementById("page-info").textContent = `Page ${currentPage}`;
    document.getElementById("prev-page").disabled = currentPage === 1;
    document.getElementById("next-page").disabled = endIndex >= matchesData.length;
}

function assignRowClasses() {
    document.querySelectorAll("#match-history tbody tr").forEach(row => {
        const team = row.querySelector("td:nth-child(6)").textContent.trim();
        const game_outcome = row.querySelector("td:nth-child(8)").textContent.trim();
        const st_mistake = row.querySelector("td:nth-child(9)").textContent.trim();

        if (team === "Good" && game_outcome === "Good Wins") {
            row.classList.add("win");
        } else if (team === "Good" && game_outcome !== "Good Wins") {
            row.classList.add("loss");
        } else if (team === "Evil" && game_outcome === "Evil Wins") {
            row.classList.add("win");
        } else if (team === "Evil" && game_outcome !== "Evil Wins") {
            row.classList.add("loss");
        } else if (team === "Storyteller" && st_mistake === "No") {
            row.classList.add("win");
        } else if (team === "Storyteller" && st_mistake === "Yes") {
            row.classList.add("mistake");
        }
    });
}

function nextPage() {
    if ((currentPage * matchesPerPage) < matchesData.length) {
        currentPage++;
        updateMatchTable();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateMatchTable();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("prev-page").addEventListener("click", prevPage);
    document.getElementById("next-page").addEventListener("click", nextPage);
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("#match-history tbody tr").forEach(row => {
        // Create Expand Button
        const expandBtn = document.createElement("button");
        expandBtn.textContent = "+";
        expandBtn.classList.add("expand-btn");

        // Append button to row
        row.appendChild(expandBtn);

        expandBtn.addEventListener("click", function () {
            row.classList.toggle("expanded");
            expandBtn.textContent = row.classList.contains("expanded") ? "-" : "+";
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    loadUserMatches();
});

async function loadUserMatches() {
    const currentUser = Parse.User.current();
    if (!currentUser) {
        console.error("No logged-in user found.");
        return;
    }

    const userId = currentUser.id;
    const Match = Parse.Object.extend("Matches");
    const query = new Parse.Query(Match);
    query.equalTo("submitted_by", userId);
    query.descending("date");
    query.descending("createdAt");

    try {
        const results = await query.find();
        renderMatches(results);
    } catch (error) {
        console.error("Error loading match history:", error);
    }
}

function renderMatches(matches) {
    const matchHistoryTable = document.querySelector("#match-history tbody");
    const matchHistoryMobile = document.querySelector("#match-history-mobile");

    matchHistoryTable.innerHTML = "";
    matchHistoryMobile.innerHTML = "";

    matches.forEach(match => {
        // Standard table row
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${match.get("date") ? match.get("date").toISOString().split("T")[0] : "N/A"}</td>
            <td>${match.get("league_code") || "N/A"}</td>
            <td>${match.get("team") || "N/A"}</td>
            <td><button class="expand-btn">+</button></td>
        `;
        matchHistoryTable.appendChild(row);

        // Expandable row for additional details
        const detailsRow = document.createElement("tr");
        detailsRow.classList.add("match-details");
        detailsRow.innerHTML = `<td colspan="4">
            <strong>Storyteller:</strong> ${match.get("storyteller") || "N/A"}<br>
            <strong>Script Played:</strong> ${match.get("script_played") || "N/A"}<br>
            <strong>Players:</strong> ${match.get("players") ? match.get("players").join(", ") : "N/A"}<br>
            <strong>Role:</strong> ${match.get("role") || "N/A"}<br>
            <strong>Game Outcome:</strong> ${match.get("game_outcome") || "N/A"}<br>
            <strong>ST Mistake:</strong> ${match.get("st_mistake") || "N/A"}
        </td>`;
        matchHistoryTable.appendChild(detailsRow);

        // Expand functionality
        row.querySelector(".expand-btn").addEventListener("click", function () {
            detailsRow.classList.toggle("expanded");
            this.textContent = detailsRow.classList.contains("expanded") ? "-" : "+";
        });

        // Mobile-friendly match card
        const matchCard = document.createElement("div");
        matchCard.classList.add("match-card");
        matchCard.innerHTML = `
            <div class="match-header">
                <div>
                    <strong>${match.get("date") ? match.get("date").toISOString().split("T")[0] : "N/A"}</strong>
                    - ${match.get("league_code") || "N/A"}
                </div>
                <button class="expand-btn">+</button>
            </div>
            <div class="match-details">
                <strong>Storyteller:</strong> ${match.get("storyteller") || "N/A"}<br>
                <strong>Script Played:</strong> ${match.get("script_played") || "N/A"}<br>
                <strong>Players:</strong> ${match.get("players") ? match.get("players").join(", ") : "N/A"}<br>
                <strong>Role:</strong> ${match.get("role") || "N/A"}<br>
                <strong>Game Outcome:</strong> ${match.get("game_outcome") || "N/A"}<br>
                <strong>ST Mistake:</strong> ${match.get("st_mistake") || "N/A"}
            </div>
        `;
        matchHistoryMobile.appendChild(matchCard);

        // Expand functionality for mobile
        matchCard.querySelector(".expand-btn").addEventListener("click", function () {
            matchCard.classList.toggle("expanded");
            this.textContent = matchCard.classList.contains("expanded") ? "-" : "+";
        });
    });
}
