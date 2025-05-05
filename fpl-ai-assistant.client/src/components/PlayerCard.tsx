type PlayerCardProps = {
  team: string;
  is_captain?: boolean;
  is_vice_captain?: boolean;
  web_name: string;
  team_code?: string;
};

function PlayerCard({
  web_name,
  team,
  is_captain,
  is_vice_captain,
  team_code,
}: PlayerCardProps) {
  return (
    <div className="relative w-[60px] h-[78px] bg-[linear-gradient(to_right_bottom,rgb(13,147,86),rgb(16,199,115))]  text-black text-xs md:text-sm font-semibold rounded-sm shadow-md flex flex-col items-center justify-center text-center p-1">
      {team_code && (
        <img
          src={team_code}
          alt={web_name}
          className="absolute inset-0 size-18 object-contain z-0 p-1"
        />
      )}
      <div className="absolute bottom-2 left-0 right-0 bg-white font-bold text-[10px] md:text-sm z-10 px-1 py-0.5  ">
        <div className="leading-tight truncate overflow-hidden whitespace-nowrap">
          {web_name}
          {is_captain && " 👑"}
          {is_vice_captain && " 💡"}
        </div>
      </div>
      {/* <div className="text-[10px] text-gray-600">{team}</div> */}
    </div>
  );
}

export default PlayerCard;
