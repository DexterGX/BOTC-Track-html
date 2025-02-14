document.addEventListener("DOMContentLoaded", async function () {
    const user = await Parse.User.current();
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Fetch and update the username and favorite character
    const userName = user.get("username") || "Not set";
    document.getElementById("username").innerText = `${userName}`;
    document.getElementById("favorite-character").innerText = user.get("favoriteCharacter") || "Not set";
    
    const profilePicture = user.get("profilePicture") || "../assets/default-profile.jpg";
    document.getElementById("profile-picture").src = profilePicture;

    await loadUserMatches(); // Load match history
});


async function uploadProfilePicture() {
    const user = await Parse.User.current();
    if (!user) {
        console.error("User not found");
        return;
    }

    const fileInput = document.getElementById("upload-profile-picture");
    if (fileInput.files.length === 0) {
        alert("Please select an image to upload.");
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
}

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
        updateProfileStats(); // Update additional profile stats

    } catch (error) {
        console.error("Error loading match history:", error);
    }
}

function updateMatchTable() {
    const matchHistoryTable = document.querySelector("#match-history tbody");
    matchHistoryTable.innerHTML = "";

    const totalPages = Math.max(1, Math.ceil(matchesData.length / matchesPerPage)); // Ensure at least 1 page

    // Prevent invalid page numbers
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
            // Check if script is custom
            let scriptPlayed = match.get("script_played") || "N/A";
            if (scriptPlayed.toLowerCase() === "custom script") {
                const customScriptName = match.get("custom_script") || "Unknown";
                scriptPlayed = `Custom Script - ${customScriptName}`;
            }
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${match.get("date") ? match.get("date").toISOString().split("T")[0] : "N/A"}</td>
                <td>${match.get("league_code") || "N/A"}</td>
                <td>${match.get("storyteller") || "N/A"}</td>
                <td>${scriptPlayed}</td>
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
    updateMatchCards(); // ✅ Update the mobile version at the same time

    // ✅ Always update the total pages correctly
    document.getElementById("page-info").textContent = `Page ${currentPage} of ${totalPages}`;

    // ✅ Enable or disable buttons properly
    document.getElementById("prev-page").disabled = (currentPage === 1);
    document.getElementById("next-page").disabled = (currentPage >= totalPages);
}

function nextPage() {
    const totalPages = Math.max(1, Math.ceil(matchesData.length / matchesPerPage));
    if (currentPage < totalPages) {
        currentPage += 1; // ✅ Move forward by exactly 1 page
        updateMatchTable();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage -= 1; // ✅ Move backward by exactly 1 page
        updateMatchTable();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("prev-page").removeEventListener("click", prevPage);
    document.getElementById("next-page").removeEventListener("click", nextPage);

    loadUserMatches(); // Ensure matches load on startup
});

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

function updateMatchCards() {
    const matchHistoryMobile = document.querySelector("#match-history-mobile");
    matchHistoryMobile.innerHTML = "";

    const totalPages = Math.max(1, Math.ceil(matchesData.length / matchesPerPage)); // Ensure at least 1 page

    // Prevent invalid page numbers
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
        matchHistoryMobile.innerHTML = "<p class='text-center'>No matches found.</p>";
        return;
    }

    paginatedMatches.forEach(match => {
        let scriptPlayed = match.get("script_played") || "N/A";
        if (scriptPlayed.toLowerCase() === "custom script") {
            const customScriptName = match.get("custom_script") || "Unknown";
            scriptPlayed = `Custom Script - ${customScriptName}`;
        }
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
                    <span>${match.get("date") ? match.get("date").toISOString().split("T")[0] : "N/A"}</span> - 
                    <span>${match.get("league_code") || "N/A"}</span>
                    <span>Team: ${match.get("team") || "N/A"}</span>
                </div>
                <button class="expand-btn">+</button>
            </div>
            <div class="match-details">
                <strong>League Code:</strong> ${match.get("league_code") || "N/A"}<br>
                <strong>Storyteller:</strong> ${match.get("storyteller") || "N/A"}<br>
                <strong>Script Played: </strong><span>${scriptPlayed}</span><br>
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

function updateProfileStats() {
    let gamesPlayed = matchesData.length;
    let storytellerGames = 0;
    let storytellerMistakes = 0;
    let wins = 0;

    matchesData.forEach(match => {
        const team = match.get("team");
        const gameOutcome = match.get("game_outcome");
        const stMistake = match.get("st_mistake");

        if (team === "Storyteller") {
            storytellerGames++;
            gamesPlayed--;
            if (stMistake === "Yes") {
                storytellerMistakes++;
            }
        }
        if ((team === "Good" && gameOutcome === "Good Wins") || (team === "Evil" && gameOutcome === "Evil Wins")) {
            wins++;
        }
    });

    document.getElementById("games-played").innerText = gamesPlayed;
    document.getElementById("win-rate").innerText = gamesPlayed > 0 ? ((wins / gamesPlayed) * 100).toFixed(2) + "%" : "0%";
    document.getElementById("st-games").innerText = storytellerGames;
    document.getElementById("st-mistake-rate").innerText = storytellerGames > 0 ? ((storytellerMistakes / storytellerGames) * 100).toFixed(2) + "%" : "0%";
}

async function monitorSession() {
    setInterval(async () => {
        const currentUser = await Parse.User.currentAsync();
        if (!currentUser) {
            alert("Session expired, please log in again.");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            window.location.href = "login.html";
        }
    }, 10 * 60 * 1000); // Check every 10 minutes
}

monitorSession();
