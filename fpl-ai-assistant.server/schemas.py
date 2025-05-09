from pydantic import BaseModel
from typing import Optional

class PlayerData(BaseModel):
    element: int
    position: int
    multiplier: int
    is_captain: bool
    is_vice_captain: bool
    element_type: int
    name: Optional[str] = None
    team: Optional[str] = None
    web_name: Optional[str] = None
    team_code: Optional[int] = None
    team_id: Optional[int] = None
    opta_code: str | None = None
    points: Optional[int] = None

class PlayerRequest(BaseModel):
    element: int
    position: int
    multiplier: int
    is_captain: bool
    name: Optional[str] = None
    team: Optional[str] = None
    is_vice_captain: bool
    element_type: int
    points: Optional[int] = None

class AnalyzeRequest(BaseModel):
    players: list[PlayerRequest]
    gw: Optional[int] = None
    chips: Optional[list[str]] = None

class TeamResponse(BaseModel):
    picks: list[PlayerData]
    entry_history: dict

class AdviceResponse(BaseModel):
    advice: str


