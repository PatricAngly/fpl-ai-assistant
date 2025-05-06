type ViceCaptainProps = {
  className?: string;
};

const ViceCaptaonIcon = ({
  className = "w-2 h-2 text-white",
}: ViceCaptainProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    className={className}
  >
    <circle cx="12" cy="12" r="12" />
    <polygon
      points="13.5 .375 8.925 12.375 4.65 12.375 0 .375 3.15 .375 6.75 10.05 10.35 .375"
      transform="translate(5.25 6)"
      fill="currentColor"
    ></polygon>
  </svg>
);

export default ViceCaptaonIcon;
