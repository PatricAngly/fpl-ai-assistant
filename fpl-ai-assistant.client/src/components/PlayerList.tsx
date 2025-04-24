import { Player } from "../types/Player";

interface Props {
  players: Player[];
}

const PlayerList = ({ players }: Props) => (
  <>
    <h2>Ditt lag (GW33)</h2>
    <ul>
      {players.map((player) => (
        <li key={player.element}>
          Player: {player.name} | Position: {player.position}{" "}
          {player.is_captain && "🧢"}
        </li>
      ))}
    </ul>
  </>
);

export default PlayerList;
