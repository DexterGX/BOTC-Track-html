document.addEventListener("DOMContentLoaded", async function () {
    const userName = localStorage.getItem("userName");
    if (!userName) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("username").innerText = userName;

    // Fetch user profile data
    const user = await Parse.User.current();
    if (user) {
        document.getElementById("favorite-character").innerText = user.get("favoriteCharacter") || "Not set";
        document.getElementById("games-played").innerText = user.get("gamesPlayed") || 0;
        document.getElementById("win-rate").innerText = user.get("winRate") ? user.get("winRate") + "%" : "0%";
    }

    await loadUserMatches(); // Load match history
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

        currentPage = 1; // Always reset to first page when loading new data
        updateMatchTable();
        updateMatchCards();
    } catch (error) {
        console.error("Error loading match history:", error);
    }
}

function updateMatchTable() {
    const matchHistoryTable = document.querySelector("#match-history tbody");
    matchHistoryTable.innerHTML = "";

    const totalPages = Math.ceil(matchesData.length / matchesPerPage);

    // Ensure the page number does not exceed the total available pages
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }

    const startIndex = (currentPage - 1) * matchesPerPage;
    const endIndex = Math.min(startIndex + matchesPerPage, matchesData.length);
    const paginatedMatches = matchesData.slice(startIndex, endIndex);

    if (paginatedMatches.length === 0) {
        matchHistoryTable.innerHTML = "<tr><td colspan='9' class='text-center'>No matches found.</td></tr>";
    } else {
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
    }

    assignRowClasses();

    // Update the page info display
    document.getElementById("page-info").textContent = `Page ${currentPage} of ${totalPages > 0 ? totalPages : 1}`;

    // Enable or disable buttons based on page
    document.getElementById("prev-page").disabled = (currentPage === 1);
    document.getElementById("next-page").disabled = (currentPage >= totalPages);
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
        } else if (team === "Storyteller" && st_mistake === "Yes") {
            row.classList.add("mistake");
        } else if (team === "Storyteller" && st_mistake === "No") {
            row.classList.add("win");
        }
    });
}

function nextPage() {
    const totalPages = Math.ceil(matchesData.length / matchesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateMatchTable();
        //document.getElementById("page-info").textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateMatchTable();
        //document.getElementById("page-info").textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("prev-page").addEventListener("click", prevPage);
    document.getElementById("next-page").addEventListener("click", nextPage);
    loadUserMatches(); // Ensure the first page is properly loaded
});

function updateMatchCards() {
    const matchHistoryMobile = document.querySelector("#match-history-mobile");
    matchHistoryMobile.innerHTML = "";

    matchesData.forEach(match => {
        const matchCard = document.createElement("div");
        matchCard.classList.add("match-card");

        // Assign class based on match outcome
        if (match.get("team") === "Good" && match.get("game_outcome") === "Good Wins") {
            matchCard.classList.add("win");
        } else if (match.get("team") === "Good" && match.get("game_outcome") !== "Good Wins") {
            matchCard.classList.add("loss");
        } else if (match.get("team") === "Evil" && match.get("game_outcome") === "Evil Wins") {
            matchCard.classList.add("win");
        } else if (match.get("team") === "Evil" && match.get("game_outcome") !== "Evil Wins") {
            matchCard.classList.add("loss");
        } else if (match.get("team") === "Storyteller" && match.get("st_mistake") === "Yes") {
            matchCard.classList.add("mistake");
        } else if (match.get("team") === "Storyteller" && match.get("st_mistake") === "No") {
            matchCard.classList.add("win");
        }

        matchCard.innerHTML = `
            <div class="match-header">
                <div>
                    <strong>${match.get("date") ? match.get("date").toISOString().split("T")[0] : "N/A"}</strong> - 
                    ${match.get("league_code") || "N/A"}
                    <strong>Team: </strong>${match.get("team") || "N/A"}
                </div>
                <button class="expand-btn">+</button>
            </div>
            <div class="match-details">
                <strong>League Code:</strong> ${match.get("league_code") || "N/A"}<br>
                <strong>Storyteller:</strong> ${match.get("storyteller") || "N/A"}<br>
                <strong>Script Played:</strong> ${match.get("script_played") || "N/A"}<br>
                <strong>Players:</strong> ${match.get("players") ? match.get("players").join(", ") : "N/A"}<br>
                <strong>Team: </strong>${match.get("team") || "N/A"}<br>
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

