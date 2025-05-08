import { useState } from "react";
import { Player } from "./types/Player";
import { Chip } from "./types/Chip";
import { Advice } from "./types/Advice";
import { parseAdvice } from "./utils/parseAdvice";
import { formatChipName } from "./utils/formatChipName";
import { TeamScore } from "./types/TeamScore";
import { fetchTeamData } from "./service/fplApi";
import { getRandomBackground } from "./utils/getRandomBackground";
import Pitch from "./components/Pitch";
import TeamScoreCard from "./components/TeamScoreCard";

function App() {
  const [teamId, setTeamId] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameweek, setGameweek] = useState<TeamScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [availableChips, setAvailableChips] = useState<Chip[]>([]);

  const handleFetch = async (e: React.FormEvent) => {
    setAdvice(null);
    setAvailableChips([]);
    e.preventDefault();
    setLoading(true);
    setPlayers([]);
    setError("");
    try {
      const data = await fetchTeamData(teamId);

      setPlayers(data.picks);
      setGameweek(data.gameweek);
      setAvailableChips(data.availableChips);
      setTeamId("");
    } catch (err) {
      setError("Could not get team data. Please check the ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (players.length === 0 || !gameweek) {
      setError("Missing team data or gameweek.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/fpl/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          players,
          gw: gameweek.event,
          chips: availableChips,
        }),
      });

      const data = await res.json();
      const parsed = parseAdvice(data.advice);
      if (data.advice) {
        if (parsed) {
          setAdvice(parsed);
        } else {
          console.warn("Failed to parse advice:", data.advice);
        }
      } else {
        setError("No analysis data received.");
      }
    } catch (err) {
      setError("Error during analysis.");
      console.error("Error during analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  const randomBackground = getRandomBackground();

  return (
    <div className="lg:flex lg:flex-col lg:items-center min-h-screen bg-gradient-to-b text-[#37003c] p-4 w-full max-w-[95rem] mx-auto mb-20">
      <div className="w-full max-w-[95rem] mx-auto">
        <div className="relative w-full">
          <img
            src={randomBackground}
            alt="Background"
            className="w-full max-w-md mx-auto object-contain sm:object-cover"
          />
          <div className="absolute mt-50 lg:mt-60 inset-0 flex flex-col justify-center items-center bg-gradient-to-b from-transparent to-white">
            <div className="w-full mt-25 lg:mt-30 max-w-3xl mx-auto p-4 rounded-b-sm shadow-xl text-center">
              <h1 className="text-3xl font-bold text-[#37003c]">
                FPL AI-assistant
              </h1>
              <form className="" onSubmit={handleFetch}>
                <input
                  className="border border-gray-300 rounded p-2 mt-4 mb-2"
                  type="text"
                  placeholder="FPL Team ID"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                />
                <button
                  className="p-2 rounded-sm bg-[#00ff87] ml-6 text-[#37003c] font-semibold"
                  type="submit"
                >
                  Get team
                </button>
              </form>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </div>
        </div>
        {players.length < 1 && (
          <div className="bg-[url('/src/assets/pitch.svg')] bg-cover h-120 sm:h-190 bg-center border-white w-full p-4 max-w-3xl mx-auto rounded-b-smopacity-50 mt-30"></div>
        )}
      </div>
      <div className="lg:flex-auto text-center lg:mt-0 mx-auto w-full max-w-3xl ">
        {loading && (
          <div className="fixed inset-0 z-50 bg-black/50 bg-o flex items-center justify-center">
            <img
              src="/src/assets/fotball.png"
              alt="Loading..."
              className="w-20 h-20 lg:w-40 lg:h-40 animate-spin"
            />
          </div>
        )}
        {players.length > 0 && (
          <>
            <div className="shadow-lg rounded-sm fpl-bg mt-30 ">
              <h2 className="text-[#37003c] font-bold ">
                {gameweek && (
                  <TeamScoreCard
                    event={gameweek.event}
                    points={gameweek.points}
                    bank={gameweek.bank}
                  />
                )}
              </h2>
              <Pitch players={players} />
            </div>
            <div className="flex flex-col items-center mt-10">
              <h3>Available chips:</h3>
              <div className="flex flex-row gap-2 mt-2 flex-wrap justify-center">
                <ul className="flex gap-2 flex-wrap ">
                  {availableChips.length > 0 ? (
                    availableChips.map((chip, i) => (
                      <li key={i}>
                        <span className="bg-[#37003c] text-white text-xs font-semibold px-2 py-1 rounded shadow">
                          {formatChipName[chip] ?? chip}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-[#37003c]">None</li>
                  )}
                </ul>
              </div>
              <button
                className="p-2 rounded-sm bg-[linear-gradient(to_right,rgb(0,255,135),rgb(2,239,255))] mt-6"
                onClick={handleAnalyze}
              >
                Analyze with AI
              </button>
            </div>
          </>
        )}
      </div>
      {advice && (
        <div className="bg-white p-4 rounded shadow mt-10 max-w-3xl mx-auto lg:flex-auto">
          {advice.transfers && (
            <>
              <h3 className="text-[#37003c] mt-2 font-bold">Transfers</h3>
              <ul>
                {advice.transfers.map((t, i) => (
                  <li key={i} className="text-[#37003c] ">
                    Out: {t.out} ➝ In: {t.in}
                  </li>
                ))}
              </ul>
            </>
          )}
          {advice.captain && (
            <p className="text-[#37003c] mt-2">
              <strong>Captain:</strong> {advice.captain}
            </p>
          )}
          {advice.chips && (
            <ul className="mt-2 space-y-1">
              {advice.chips.map((c, i) => (
                <li key={i} className="text-[#37003c]">
                  <strong>{formatChipName[c.chip] ?? c.chip}:</strong>{" "}
                  {c.explanation}
                </li>
              ))}
            </ul>
          )}
          {advice.notes && (
            <p className="text-[#37003c] mt-2">
              <strong>Notes:</strong> {advice.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
