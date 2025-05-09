# routers/fpl.py
from fastapi import APIRouter, HTTPException
from schemas import PlayerData, AnalyzeRequest, TeamResponse, AdviceResponse
from typing import Dict, Any
import requests
import openai
import os
import sys

print("PYTHON PATH:", sys.path)

router = APIRouter(prefix="/api/fpl")

# Get OpenAI API key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise RuntimeError("OPENAI_API_KEY missing in .env file.")  

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

def get_player_info_map() -> Dict[int, Dict[str, Any]]:
    res = requests.get("https://fantasy.premierleague.com/api/bootstrap-static/")
    if not res.ok:
        raise HTTPException(status_code=500, detail="Could not fetch player data.")

    data = res.json()
    team_map = get_team_map(data)
    elements = data.get('elements', [])

    player_map = {}
    for player in elements:
        player_id = player['id']
        player_map[player_id] = {
            "name": f"{player['first_name']} {player['second_name']}",
            "team": team_map.get(player['team'], "Unknown Team"),
            "web_name": player['web_name'],
            "team_id": player['team'],
            "team_code": player['team_code'],
            "opta_code": player.get("opta_code")
        }

    return player_map

def get_team_map(data: dict) -> Dict[int, str]:
    return {team["id"]: team["name"] for team in data.get("teams", [])}
    
def get_player_points_map(gw: int) -> dict[int, int]:
    url = f"https://fantasy.premierleague.com/api/event/{gw}/live/"
    res = requests.get(url)
    if not res.ok:
        raise HTTPException(status_code=500, detail="Could not fetch live points.")
    data = res.json()["elements"]
    return {player["id"]: player["stats"]["total_points"] for player in data}

@router.get(
    "/{team_id}/available-chips",
    response_model=list[str],
    summary="Get available chips",
    description="Returns a list of chips the user has not yet used."
)
def get_available_chips(team_id: int) -> list[str]:
    res = requests.get(f"https://fantasy.premierleague.com/api/entry/{team_id}/history/")
    if not res.ok:
        raise HTTPException(status_code=500, detail="Could not fetch chip data.")
    data = res.json()
    used = {chip["name"] for chip in data.get("chips", [])}
    all_chips = {"wildcard", "freehit", "bboost", "3xc", "manager"}
    return list(all_chips - used)


@router.get(
    "/{team_id}",
    response_model=TeamResponse,
    summary="Get team data",
    description="Returns picks, captain, bench and team details for the latest played gameweek."
)
def get_team(team_id: int):
    gw = get_latest_played_gameweek()

    res = requests.get(f"https://fantasy.premierleague.com/api/entry/{team_id}/event/{gw}/picks/")
    if not res.ok:
        raise HTTPException(status_code=500, detail="Could not fetch team data.")
    data = res.json()

    player_map = get_player_info_map()
    points_map = get_player_points_map(gw)

    enriched_picks = []
    for pick in data.get("picks", []):
        element_id = pick["element"]
        info = player_map.get(element_id)

        enriched_picks.append(PlayerData(
            element=element_id,
            position=pick["position"],
            multiplier=pick["multiplier"],
            is_captain=pick["is_captain"],
            is_vice_captain=pick["is_vice_captain"],
            element_type=pick["element_type"],
            name=info["name"],
            team=info["team"],
            web_name=info["web_name"],
            team_code=info["team_code"],
            team_id=info["team_id"],
            opta_code=info.get("opta_code"),
            points=points_map.get(element_id, 0)
        ))

    return TeamResponse(
        picks=enriched_picks,
        entry_history=data.get("entry_history", {})
    )

@router.post(
    "/analyze",
    response_model=AdviceResponse,
    summary="Analyze team",
    description="Send an FPL team to OpenAi and receive suggestions for transfers, captain choice, and chip usage."
)
def analyze_team(request: AnalyzeRequest):
    try:
        gw = request.gw or get_latest_played_gameweek()

        player_info = "\n".join([
        f"{p.name or f'ID {p.element}'}, Pos: {p.position}, Captain: {p.is_captain}, Points: {p.points}"
        for p in request.players
        ])
        
        chip_info = ""
        if request.chips:
            chip_info = f"\nAvailable chips: {', '.join(request.chips)}"
            

        prompt = (
        f"Here is my FPL team gameweek {gw}:\n"
        f"{player_info}{chip_info}\n\n"
        "Give improvement suggestions for the next gameweek. Respond only in raw JSON (no markdown, no backticks). "
        "Always use this format:\n"
        "{\n"
        "  \"transfers\": [{ \"out\": \"Player A\", \"in\": \"Player B\" }],\n"
        "  \"captain\": \"Player Name\",\n"
        "  \"chips\": [{ \"chip\": \"bench_boost\", \"explanation\": \"Why this chip is recommended.\" }],\n"
        "  \"notes\": \"Additional tips or insights.\"\n"
        "}"
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
