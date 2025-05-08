export function getRandomBackground(): string {
  const backgrounds = [
    "https://fantasy.premierleague.com/static/media/player-comp-5-1x.c05172fa.png",
    "https://fantasy.premierleague.com/static/media/player-comp-4-1x.966f0e57.png",
    "https://fantasy.premierleague.com/static/media/player-comp-3-1x.60201890.png",
  ];
  return backgrounds[Math.floor(Math.random() * backgrounds.length)];
}
