import { Player } from "../types/Player";

export async function fetchTeamPicks(teamId: string): Promise<Player[]> {
  const res = await fetch(`http://localhost:8000/api/fpl/${teamId}`);
  if (!res.ok) throw new Error("Fel vid hämtning av lag");
  const data = await res.json();
  console.log("Hämtade data:", data); // Logga den hämtade datan
  return data.picks;
}
