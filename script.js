async function getMatchData() {
  try {
    const response = await fetch("https://api.cricapi.com/v1/currentMatches?apikey=20f072ef-eba3-441b-b14f-6f49608a6b3b&offset=0");
    if (!response.ok) {
      throw new Error(Failed to fetch data: ${response.status} - ${response.statusText});
    }

    const data = await response.json();
    if (data.status !== "success") return;

    const matchesList = data.data;
    if (!matchesList) return;

    // Define a date object for the current time
    const currentDate = new Date().toISOString().split('T')[0];

    const relevantData = matchesList
      .filter(match => match.series_id === "24c36b5a-0ae1-40cf-8cf5-dd0b9d1be6bd")
      .filter(match => {
        // Filter out past matches (assumes "date" is a property in the API response)
        return match.date > currentDate;
      })
      .map(match => {
        const scores = match.score;
        const teams = match.teamInfo;

        if (scores && scores.length >= 2 && teams && teams.length >= 2) {
          const team1 = scores[0];
          const team2 = scores[1];
          const team3 = teams[0];
          const team4 = teams[1];

          return `
            <p>${match.name}</p>
            <p>${match.status}</p>
            <p>${team3.shortname}: Runs - ${team1.r}, Wickets - ${team1.w}, Overs - ${team1.o}</p>
            <p>${team4.shortname}: Runs - ${team2.r}, Wickets - ${team2.w}, Overs - ${team2.o}</p>
          `;
        } else {
          return ${match.name}, ${match.status}, Score data not available;
        }
      });

    console.log(relevantData);

    document.getElementById("matches").innerHTML = relevantData.map(match => <li>${match}</li>).join('<hr>');

    return relevantData;
  } catch (error) {
    console.error(error);
  }
}

getMatchData();