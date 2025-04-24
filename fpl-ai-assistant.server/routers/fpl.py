# routers/fpl.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import openai
import os
import sys

print("PYTHON PATH:", sys.path)

router = APIRouter(prefix="/api/fpl")

# Get OpenAI API key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise RuntimeError("OPENAI_API_KEY saknas i .env eller miljövariabler")

class Player(BaseModel):
    element: int
    position: int
    is_captain: bool
    is_vice_captain: bool
    element_type: int
    name: str | None = None

class Chips(BaseModel):
    wildcard: bool = False
    freehit: bool = False
    benchBoost: bool = False
    tripleCaptain: bool = False
    assistantManager: bool = False

class AnalyzeRequest(BaseModel):
    players: list[Player]
    gw: int | None = None  
    chips: Chips | None = None

def get_latest_played_gameweek():
    res = requests.get("https://fantasy.premierleague.com/api/bootstrap-static/")
    if not res.ok:
        raise HTTPException(status_code=500, detail="Could not fetch gameweek data.")
    data = res.json()
    finished_events = [event for event in data['events'] if event['finished']]
    if not finished_events:
        raise HTTPException(status_code=500, detail="No finished gameweeks found.")
    current_event = max(finished_events, key=lambda e: e['id'])
    return current_event['id']

def get_player_name_map():
    res = requests.get("https://fantasy.premierleague.com/api/bootstrap-static/")
    if not res.ok:
        raise HTTPException(status_code=500, detail="Could not fetch player data.")
    elements = res.json()['elements']
    return {player['id']: f"{player['first_name']} {player['second_name']}" for player in elements}

@router.get("/{team_id}")
def get_team(team_id: int):
    gw = get_latest_played_gameweek()
    url = f"https://fantasy.premierleague.com/api/entry/{team_id}/event/{gw}/picks/"
    response = requests.get(url)
    if not response.ok:
        raise HTTPException(status_code=500, detail="Could not fetch team data.")
    picks = response.json()
    name_map = get_player_name_map()
    for pick in picks.get("picks", []):
        pick["name"] = name_map.get(pick["element"], f"ID {pick['element']}")
    return picks

@router.post("/analyze")
def analyze_team(request: AnalyzeRequest):
    try:
        gw = request.gw or get_latest_played_gameweek()

        player_info = "\n".join([
        f"{p.name or f'ID {p.element}'}, Pos: {p.position}, Captain: {p.is_captain}"
        for p in request.players
        ])
        

        chip_info = ""
        if request.chips:
            used_chips = [name for name, used in request.chips.model_dump().items() if used]
            if used_chips:
                chip_info = f"\nAvailable chips: {', '.join(used_chips)}"

        prompt = (
            f"Here is my FPL team gameweek {gw}:\n"
            f"{player_info}{chip_info}\n\n"
            "Give improvement suggestions for the next gameweek. Format your response with the following keys as raw JSON, do not use Markdown or backticks. \n"
            "- 'transfers': List of suggested player transfers, { out: string; in: string }[];\n"
            "- 'captain': Suggested captain\n"
            "- 'chips': Suggested chip usage (if suggested, give short explanation)\n"
            "- 'notes': Additional tips or insights."
        )
        
        completion = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert in Fantasy Premier League. You provide detailed and actionable advice."},
                {"role": "user", "content": prompt},
            ]
        )

        return {"advice": completion.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
