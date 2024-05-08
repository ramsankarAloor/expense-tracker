const apiBaseUrl = BASE_URL;

document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  const { data: leaderboardArray } = await axios.get(
    `${apiBaseUrl}/premium/go-to-leaderboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  leaderboardArray.forEach((element) => {
    displayLeaderboardRecord(element);
  });
});

function displayLeaderboardRecord(leaderboard_obj) {
  const leaderboardList = document.getElementById("leaderboard-list");
  const leaderboardListElement = document.createElement("div");
  leaderboardListElement.className = "leaderboard-list-element";

  const nameDiv = document.createElement("div");
  const totalAmntDiv = document.createElement("div");
  nameDiv.textContent = leaderboard_obj.name;
  totalAmntDiv.textContent = leaderboard_obj.totalExpense || 0;
  nameDiv.className = "list-element-sub-50";
  totalAmntDiv.className = "list-element-sub-50";

  leaderboardList.appendChild(leaderboardListElement);
  leaderboardListElement.appendChild(nameDiv);
  leaderboardListElement.appendChild(totalAmntDiv);
}
