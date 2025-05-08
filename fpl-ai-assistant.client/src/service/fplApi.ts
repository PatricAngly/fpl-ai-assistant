import { Player } from "../types/Player";

export async function fetchTeamPicks(teamId: string): Promise<Player[]> {
  const res = await fetch(`http://localhost:8000/api/fpl/${teamId}`);
  if (!res.ok) throw new Error("Error fetching data from server");
  const data = await res.json();
  return data.picks;
}
