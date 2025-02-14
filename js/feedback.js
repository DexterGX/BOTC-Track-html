document.addEventListener("DOMContentLoaded", function () {
    Parse.initialize("s7C0Xt339QlyFlfufornKYww6AvgNPSjHgJ7rb5C", "WUHOoRAw4QUUwae5PVvDRE9MMAfPYyDUe1DRcJvY"); // Replace with your Back4App credentials
    Parse.serverURL = "https://parseapi.back4app.com/";

    const feedbackForm = document.getElementById("feedback-form");

    feedbackForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        const Feedback = Parse.Object.extend("Feedback");
        const feedback = new Feedback();
        feedback.set("name", name);
        feedback.set("email", email);
        feedback.set("message", message);

        try {
            await feedback.save();
            alert("Feedback submitted successfully!");
            feedbackForm.reset();
        } catch (error) {
            console.error("Error saving feedback:", error);
            alert("Failed to send feedback. Please try again.");
        }
    });
});
