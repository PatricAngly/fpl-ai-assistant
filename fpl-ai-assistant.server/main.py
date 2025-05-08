from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()  

from routers import fpl


app = FastAPI()

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  routes
app.include_router(fpl.router)

@app.get("/")
def root():
    return {"message": "FPL AI Assistant Backend är igång!"}
