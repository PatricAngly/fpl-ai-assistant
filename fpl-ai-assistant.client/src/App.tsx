import { useState } from "react";
import { Player } from "./types/Player";
import { Chip } from "./types/Chip";
import { Advice } from "./types/Advice";
import { parseAdvice } from "./utils/parseAdvice";

function App() {
  const [teamId, setTeamId] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameweek, setGameweek] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [chips, setChips] = useState<Chip>({
    wildcard: false,
    freehit: false,
    benchBoost: false,
    tripleCaptain: false,
    assistantManager: false,
  });

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:8000/api/fpl/${teamId}`);
      const data = await res.json();
      setPlayers(data.picks);
      setGameweek(data.entry_history.event);
      console.log("Fetched data:", data); // Logga den hämtade datan
    } catch (err) {
      setError("Could not fetch data.");
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
          chips,
        }),
      });

      const data = await res.json();
      const parsed = parseAdvice(data.advice);
      if (data.advice) {
        if (parsed) {
          setAdvice(parsed);
          console.log("Parsed advice:", parsed); // Logga den parserade advicen
        } else {
          setAdvice({ notes: data.advice }); // fallback
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
          <ul>
            {players.map((p) => (
              <li key={p.element}>
                {p.name || `ID: ${p.element}`} | Position: {p.position}{" "}
                {p.is_captain && "🧢"}
              </li>
            ))}
          </ul>
          <h3>Available chips:</h3>
          <div className="chip-options">
            {Object.keys(chips).map((key) => (
              <label key={key} style={{ marginRight: "1rem" }}>
                <input
                  type="checkbox"
                  checked={chips[key as keyof Chip]}
                  onChange={() =>
                    setChips((prev) => ({
                      ...prev,
                      [key]: !prev[key as keyof Chip],
                    }))
                  }
                />
                {key}
              </label>
            ))}
          </div>
          <button onClick={handleAnalyze}>Analyze with AI</button>
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
