export async function fetchTeamData(teamId: string) {
  const [teamRes, chipsRes] = await Promise.all([
    fetch(`http://localhost:8000/api/fpl/${teamId}`),
    fetch(`http://localhost:8000/api/fpl/${teamId}/available-chips`),
  ]);

  if (!teamRes.ok || !chipsRes.ok) {
    throw new Error("error fetching team data or chips");
  }

  const teamData = await teamRes.json();
  const chips = await chipsRes.json();

  return {
    picks: teamData.picks,
    gameweek: teamData.entry_history,
    availableChips: chips,
  };
}
