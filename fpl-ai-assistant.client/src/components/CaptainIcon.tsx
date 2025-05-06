type CaptainIconProps = {
  className?: string;
};

const CaptainIcon = ({
  className = " w-2 h-2 text-white",
}: CaptainIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    className={className}
  >
    <circle cx="12" cy="12" r="12" />
    <path
      d="M 15.077 14.3703 C 14.4472 15.2781 13.4066 15.8124 12.302 15.7953 C 10.438 15.7953 8.92697 14.2843 8.92697 12.4203 C 8.92697 10.5564 10.438 9.04534 12.302 9.04534 C 13.3988 9.06062 14.4255 9.58781 15.077 10.4703 L 17.252 8.29534 C 15.3644 6.02402 12.1615 5.35094 9.51934 6.67031 C 6.87713 7.98968 5.49079 10.9543 6.17226 13.8279 C 6.85373 16.7015 9.42367 18.7279 12.377 18.7203 C 14.2708 18.7263 16.0646 17.8708 17.252 16.3953 L 15.077 14.3703 Z"
      fill="currentColor"
    />
  </svg>
);

export default CaptainIcon;
