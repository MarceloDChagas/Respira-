from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...services.carbon_calculator import CarbonCalculator

router = APIRouter()

class TransportRequest(BaseModel):
    transport_type: str
    distance_km: float

class EnergyRequest(BaseModel):
    energy_type: str
    consumption: float

class FoodRequest(BaseModel):
    diet_type: str
    days: int

class CalculationResponse(BaseModel):
    emissions_kg: float
    category: str

@router.post("/transport", response_model=CalculationResponse)
def calculate_transport(request: TransportRequest):
    calculator = CarbonCalculator()
    try:
        emissions = calculator.calculate_transportation(request.transport_type, request.distance_km)
        return {"emissions_kg": emissions, "category": "transportation"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/energy", response_model=CalculationResponse)
def calculate_energy(request: EnergyRequest):
    calculator = CarbonCalculator()
    try:
        emissions = calculator.calculate_energy(request.energy_type, request.consumption)
        return {"emissions_kg": emissions, "category": "energy"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/food", response_model=CalculationResponse)
def calculate_food(request: FoodRequest):
    calculator = CarbonCalculator()
    try:
        emissions = calculator.calculate_food(request.diet_type, request.days)
        return {"emissions_kg": emissions, "category": "food"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
