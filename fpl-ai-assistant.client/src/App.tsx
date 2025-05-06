import { useState } from "react";
import { Player } from "./types/Player";
import { Chip } from "./types/Chip";
import { Advice } from "./types/Advice";
import { parseAdvice } from "./utils/parseAdvice";
import { formatChipName } from "./utils/formatChipName";
import Pitch from "./components/Pitch";

function App() {
  const [teamId, setTeamId] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameweek, setGameweek] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [availableChips, setAvailableChips] = useState<Chip[]>([]);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const [teamRes, chipsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/fpl/${teamId}`),
        fetch(`http://localhost:8000/api/fpl/${teamId}/available-chips`),
      ]);

      if (!teamRes.ok || !chipsRes.ok) {
        throw new Error("Något gick fel vid hämtning");
      }

      const teamData = await teamRes.json();
      const chips = await chipsRes.json();

      setPlayers(teamData.picks);
      setGameweek(teamData.entry_history.event);
      setAvailableChips(chips);
    } catch (err) {
      setError("Kunde inte hämta lag och chips.");
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
          gw: gameweek,
          chips: availableChips,
        }),
      });

      const data = await res.json();
      const parsed = parseAdvice(data.advice);
      if (data.advice) {
        if (parsed) {
          setAdvice(parsed);
        } else {
          setAdvice({ notes: data.advice });
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

  return (
    <div className="App">
      <h1 className="text-3xl font-bold text-green-500">FPL AI-assistant</h1>
      <form onSubmit={handleFetch}>
        <input
          type="text"
          placeholder="FPL Team ID"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />
        <button type="submit">Get team</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {players.length > 0 && (
        <>
          <h2>Your team GW:{gameweek}</h2>
          <Pitch players={players} />
          <div className="flex flex-col items-center mt-10">
            <h3>Available chips:</h3>
            <div className="flex flex-row gap-2 mb-4 flex-wrap justify-center">
              <ul className="flex gap-2 flex-wrap">
                {availableChips.map((chip, i) => (
                  <li key={i}>
                    <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded shadow">
                      {formatChipName[chip] ?? chip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={handleAnalyze}>Analyze with AI</button>
          </div>
        </>
      )}

      {advice && (
        <div>
          {advice.transfers && (
            <>
              <h3>Transfers</h3>
              <ul>
                {advice.transfers.map((t, i) => (
                  <li key={i}>
                    Out: {t.out} ➝ In: {t.in}
                  </li>
                ))}
              </ul>
            </>
          )}
          {advice.captain && (
            <p>
              <strong>Captain:</strong> {advice.captain}
            </p>
          )}
          {advice.chips && (
            <p>
              <strong>Chips:</strong>{" "}
              {Array.isArray(advice.chips)
                ? advice.chips.join(", ")
                : advice.chips}
            </p>
          )}
          {advice.notes && (
            <p>
              <strong>Notes:</strong> {advice.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
