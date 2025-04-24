interface Props {
  teamId: string;
  setTeamId: (id: string) => void;
  onFetch: () => void;
}

const TeamInput = ({ teamId, setTeamId, onFetch }: Props) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onFetch();
    }}
  >
    <input
      type="text"
      placeholder="Ange ditt FPL Team ID"
      value={teamId}
      onChange={(e) => setTeamId(e.target.value)}
    />
    <button type="submit">Hämta lag</button>
  </form>
);

export default TeamInput;
