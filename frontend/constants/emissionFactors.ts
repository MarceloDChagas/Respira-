// Fatores de emissão (kg CO2e) replicados do backend para cálculo de preview local
// Mantém alinhamento com CarbonCalculator.EMISSION_FACTORS
export const EMISSION_FACTORS = {
  transportation: {
    car_gasoline_km: 0.192,
    car_diesel_km: 0.171,
    car_electric_km: 0.053,
    bus_km: 0.089,
    train_km: 0.041,
    plane_short_km: 0.255,
    plane_long_km: 0.195,
    bike_km: 0.0,
    walk_km: 0.0,
  },
  energy: {
    electricity_kwh: 0.233,
    natural_gas_kwh: 0.185,
    heating_oil_liter: 2.52,
  },
  food: {
    meat_heavy_day: 7.19,
    meat_medium_day: 5.63,
    meat_low_day: 4.67,
    pescatarian_day: 3.91,
    vegetarian_day: 3.81,
    vegan_day: 2.89,
  },
} as const;

export type TransportKey = keyof typeof EMISSION_FACTORS.transportation;
export type EnergyKey = keyof typeof EMISSION_FACTORS.energy;
export type FoodKey = keyof typeof EMISSION_FACTORS.food;
