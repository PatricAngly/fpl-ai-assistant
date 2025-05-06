import CaptainIcon from "./CaptainIcon";
import ViceCaptaonIcon from "./ViceCaptainIcon";

type PlayerCardProps = {
  is_captain?: boolean;
  is_vice_captain?: boolean;
  web_name: string;
  team_code?: string;
  points?: number;
};

function PlayerCard({
  web_name,
  is_captain,
  is_vice_captain,
  team_code,
  points,
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
      <span className="absolute top-1 left-1">
        {is_captain && <CaptainIcon />}
        {is_vice_captain && <ViceCaptaonIcon />}
      </span>
      <div className="absolute bottom-0 left-0 right-0 font-bold text-[10px] lg:text-[12px] z-10   ">
        <div className="leading-tight truncate overflow-hidden whitespace-nowrap  bg-white">
          {web_name}
        </div>
        <div className="leading-tight truncate overflow-hidden whitespace-nowrap bg-[#37003c] rounded-b-sm">
          <span className="text-white">{points}</span>
        </div>
      </div>
      {/* <div className="text-[10px] text-gray-600">{team}</div> */}
    </div>
  );
}

export default PlayerCard;
