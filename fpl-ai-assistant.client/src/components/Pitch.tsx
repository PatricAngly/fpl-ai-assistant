import { Player } from "../types/Player";

type Props = {
  players: Player[];
};

const Pitch = ({ players }: Props) => {
  const getPlayersByType = (type: number) =>
    players
      .filter((p) => p.element_type === type && p.multiplier > 0)
      .slice(0, 5);

  const getBench = () => players.filter((p) => p.multiplier === 0).slice(0, 4); // max 4 bänkspelare

  const gk = getPlayersByType(1);
  const def = getPlayersByType(2);
  const mid = getPlayersByType(3);
  const fwd = getPlayersByType(4);
  const bench = getBench();

  const renderLine = (line: Player[]) => (
    <div className="flex justify-center gap-2 mb-4 sm:mb-8">
      {line.map((p) => (
        <div
          key={p.element}
          className={`min-w-[68px] h-[72px] flex items-center justify-center bg-white/90 text-black font-semibold px-3 py-2 rounded-lg shadow-md relative text-xs md:text-sm`}
        >
          {p.name?.split(" ").slice(-1).join(" ")}
          {p.is_captain && (
            <span className="absolute top-0 right-1 text-xs">🧢</span>
          )}
          {p.is_vice_captain && (
            <span className="absolute top-0 right-1 text-xs">⭐</span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[url('/src/assets/pitch.svg')] bg-cover h-120 sm:h-160 bg-center border-4 border-white w-full p-4 max-w-3xl mx-auto mt-8 shadow-lg">
      {renderLine(gk)}
      {renderLine(def)}
      {renderLine(mid)}
      {renderLine(fwd)}

      <div className="mt-10 sm:mt-22">
        <h3 className="text-center text-white font-bold mb-2 text-sm">Bench</h3>
        <div className="flex justify-center gap-4">
          {bench.map((p) => (
            <div
              key={p.element}
              className="min-w-[68px] h-[72px] flex items-center justify-center bg-gray-300 text-black font-semibold px-3 py-2 rounded-lg text-xs md:text-sm shadow-sm"
            >
              {p.name?.split(" ").slice(-1).join(" ")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pitch;
