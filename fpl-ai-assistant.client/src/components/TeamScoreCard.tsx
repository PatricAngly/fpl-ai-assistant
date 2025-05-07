type TeamScoreCardProps = {
  event: number;
  points: number;
  bank: number;
};

function TeamScoreCard({ event, points, bank }: TeamScoreCardProps) {
  return (
    <div className="bg-white flex p-4 rounded shadow-lg max-w-sm mx-auto mt-4 text-center">
      <p className="flex-auto text-sm font-semibold text-gray-700">
        Final Points: {points}
      </p>
      <p className="flex-auto text-sm font-semibold text-gray-700">
        Gameweek: {event}
      </p>
      <p className="flex-auto text-sm font-semibold text-gray-700">
        Budget: {bank / 10}
      </p>
    </div>
  );
}

export default TeamScoreCard;
