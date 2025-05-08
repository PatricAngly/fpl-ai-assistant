type TeamScoreCardProps = {
  event: number;
  points: number;
  bank: number;
};

function TeamScoreCard({ event, points, bank }: TeamScoreCardProps) {
  return (
    <div className="flex p-4 mx-auto mt-4 text-center w-full max-w-3xl">
      <p className="flex-auto text-sm font-semibold text-[#37003c]">
        Final Points: {points}
      </p>
      <p className="flex-auto text-sm font-semibold text-[#37003c]">
        Gameweek: {event}
      </p>
      <p className="flex-auto text-sm font-semibold text-[#37003c]">
        Budget: {bank / 10}
      </p>
    </div>
  );
}

export default TeamScoreCard;
