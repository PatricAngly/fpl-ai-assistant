// utils/getShirtImageUrl.ts
import { Player } from "../types/Player";

export function getShirtImageUrl(player: Player): string {
  if (player.element_type === 5 && player.opta_code) {
    // Manager
    return `https://resources.premierleague.com/premierleague/photos/players/110x140/${player.opta_code}.png`;
  }

  if (player.element_type === 1) {
    // Goalkeeper
    return `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-66.webp`;
  }

  // Outfield players (defenders, midfielders, forwards)
  return `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-66.webp`;
}
