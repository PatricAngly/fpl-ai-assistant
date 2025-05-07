import { Player } from "../types/Player";
import PlayerCard from "../components/PlayerCard";
import { getShirtImageUrl } from "../utils/getShirtImageUrl";

type Props = {
  players: Player[];
};

const Pitch = ({ players }: Props) => {
  console.log("Players in Pitch:", players);
  const getPlayersByType = (type: number) =>
    players
      .slice(0, 11)
      .filter((p) => p.element_type === type)
      .slice(0, 5);

  const getBench = () => players.slice(11);

  const gk = getPlayersByType(1);
  const def = getPlayersByType(2);
  const mid = getPlayersByType(3);
  const fwd = getPlayersByType(4);
  const bench = getBench();

  const renderLine = (line: Player[]) => (
    <div className="flex justify-center gap-2 mb-2 sm:mb-8">
      {line.map((p) => (
        <PlayerCard
          key={p.element}
          web_name={p.web_name}
          points={p.points * p.multiplier}
          is_captain={p.is_captain}
          is_vice_captain={p.is_vice_captain}
          team_code={getShirtImageUrl(p)}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-[url('/src/assets/pitch.svg')] bg-cover h-120 sm:h-190 bg-center border-4 border-white w-full p-4 max-w-3xl mx-auto mt-8 shadow-lg">
      {renderLine(gk)}
      {renderLine(def)}
      {renderLine(mid)}
      {renderLine(fwd)}

      <div className="mt-10 sm:mt-22">
        <h3 className="text-center text-white font-bold mb-2 text-sm">Bench</h3>
        <div className="flex justify-center gap-4">
          {bench.map((p) => (
            <PlayerCard
              key={p.element}
              web_name={p.web_name}
              points={p.points}
              is_captain={p.is_captain}
              is_vice_captain={p.is_vice_captain}
              team_code={getShirtImageUrl(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pitch;
