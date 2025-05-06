export interface Player {
  element: number;
  position: number;
  is_captain: boolean;
  is_vice_captain: boolean;
  element_type: number;
  name?: string;
  multiplier: number;
  team: string;
  web_name: string;
  photo: string;
  team_code: number;
  points: number;
}
