interface Props {
  onClick: () => void;
}

const AnalyzeButton = ({ onClick }: Props) => (
  <button onClick={onClick}>Analysera med AI</button>
);

export default AnalyzeButton;
