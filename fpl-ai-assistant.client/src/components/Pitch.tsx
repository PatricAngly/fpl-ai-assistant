import { Player } from "../types/Player";
import PlayerCard from "../components/PlayerCard";

type Props = {
  players: Player[];
};

const Pitch = ({ players }: Props) => {
  const getPlayersByType = (type: number) =>
    players
      .filter((p) => p.element_type === type && p.multiplier > 0)
      .slice(0, 5);

  const getBench = () => players.filter((p) => p.multiplier === 0).slice(0, 4);

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
          web_name={p.name?.split(" ").slice(-1).join(" ") ?? `ID ${p.element}`}
          team={p.team ?? ""}
          is_captain={p.is_captain}
          is_vice_captain={p.is_vice_captain}
          team_code={
            p.element_type === 1
              ? `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${p.team_code}_1-66.webp`
              : `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${p.team_code}-66.webp`
          }
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
              web_name={
                p.name?.split(" ").slice(-1).join(" ") ?? `ID ${p.element}`
              }
              team={p.team ?? ""}
              is_captain={p.is_captain}
              is_vice_captain={p.is_vice_captain}
              team_code={
                p.element_type === 1
                  ? `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${p.team_code}_1-66.webp`
                  : `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${p.team_code}-66.webp`
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pitch;
