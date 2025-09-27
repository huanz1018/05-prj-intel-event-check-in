document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("checkInForm");
  const nameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");
  const attendeeCountEl = document.getElementById("attendeeCount");
  const progressBar = document.getElementById("progressBar");
  const greeting = document.getElementById("greeting");
  const celebrationMessage = document.getElementById("celebrationMessage");
  const attendeeListEl = document.getElementById("attendeeList");
  const maxCount = 50;

  // Load from localStorage
  let count = parseInt(localStorage.getItem("attendanceCount")) || 0;
  let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
    water: 0,
    zero: 0,
    power: 0,
  };
  let attendeeList = JSON.parse(localStorage.getItem("attendeeList")) || [];

  // Update UI from storage
  function updateUI() {
    attendeeCountEl.textContent = count;
    progressBar.style.width = `${Math.round((count / maxCount) * 100)}%`;
    document.getElementById("waterCount").textContent = teamCounts.water;
    document.getElementById("zeroCount").textContent = teamCounts.zero;
    document.getElementById("powerCount").textContent = teamCounts.power;
    // Render attendee list
    attendeeListEl.innerHTML = "";
    attendeeList.forEach(function (attendee) {
      const li = document.createElement("li");
      li.textContent = `${attendee.name} (${attendee.teamName})`;
      attendeeListEl.appendChild(li);
    });
  }

  updateUI();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = nameInput.value;
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text;

    count++;
    teamCounts[team]++;
    attendeeList.push({ name: name, team: team, teamName: teamName });

    // Save to localStorage
    localStorage.setItem("attendanceCount", count);
    localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
    localStorage.setItem("attendeeList", JSON.stringify(attendeeList));

    updateUI();

    // Show welcome message with celebratory emojis
    greeting.textContent = `🎉 Welcome, ${name} from ${teamName}! 🥳`;
    greeting.style.display = "block";

    // Check for celebration
    if (count >= maxCount) {
      // Find winning team
      let winningTeam = "";
      let max = 0;
      for (let t in teamCounts) {
        if (teamCounts[t] > max) {
          max = teamCounts[t];
          winningTeam = t;
        }
      }
      let winningTeamName = "";
      if (winningTeam === "water") {
        winningTeamName = "Team Water Wise";
      } else if (winningTeam === "zero") {
        winningTeamName = "Team Net Zero";
      } else if (winningTeam === "power") {
        winningTeamName = "Team Renewables";
      }
      celebrationMessage.innerHTML = `🏆 <b>Goal reached!</b> The winning team is <span style="color:gold;">${winningTeamName}</span>! �🥇`;
      celebrationMessage.innerHTML = `🏆 <b>Goal reached!</b> The winning team is <span style="color:gold;">${winningTeamName}</span>! 🎉🥇`;
      celebrationMessage.style.display = "block";
    } else {
      celebrationMessage.style.display = "none";
    }

    form.reset();
  });
});
