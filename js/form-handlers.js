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
