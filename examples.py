"""
Example usage scenarios for Respira+ application
"""

from respira_plus.carbon_calculator import CarbonCalculator
from respira_plus.tips_missions import TipsMissionsManager
from respira_plus.user_profile import UserProfile
from datetime import datetime


def example_1_basic_calculation():
    """Example 1: Basic carbon footprint calculation"""
    print("\n" + "="*60)
    print("EXAMPLE 1: Basic Carbon Footprint Calculation")
    print("="*60)
    
    calculator = CarbonCalculator()
    
    # Daily commute: 30km by car
    car_emissions = calculator.calculate_transportation('car_gasoline_km', 30)
    print(f"Daily car commute (30km): {car_emissions:.2f} kg CO2e")
    
    # Daily electricity: 10 kWh
    energy_emissions = calculator.calculate_energy('electricity_kwh', 10)
    print(f"Daily electricity (10 kWh): {energy_emissions:.2f} kg CO2e")
    
    # Daily food: vegetarian diet
    food_emissions = calculator.calculate_food('vegetarian_day', 1)
    print(f"Daily food (vegetarian): {food_emissions:.2f} kg CO2e")
    
    print(f"\nTotal daily emissions: {calculator.get_total_emissions():.2f} kg CO2e")


def example_2_comparison():
    """Example 2: Compare different transportation modes"""
    print("\n" + "="*60)
    print("EXAMPLE 2: Transportation Mode Comparison")
    print("="*60)
    
    distance = 20  # km per day
    
    modes = [
        ('car_gasoline_km', 'Car (Gasoline)'),
        ('car_electric_km', 'Car (Electric)'),
        ('bus_km', 'Bus'),
        ('train_km', 'Train'),
        ('bike_km', 'Bicycle')
    ]
    
    print(f"\nWeekly commute emissions for {distance}km/day:")
    for mode, name in modes:
        calc = CarbonCalculator()
        emissions = calc.calculate_transportation(mode, distance * 5)  # 5 workdays
        print(f"  {name:20s}: {emissions:6.2f} kg CO2e")


def example_3_diet_impact():
    """Example 3: Compare diet choices over a month"""
    print("\n" + "="*60)
    print("EXAMPLE 3: Monthly Diet Impact Comparison")
    print("="*60)
    
    diets = [
        ('meat_heavy_day', 'Heavy Meat Eater'),
        ('meat_medium_day', 'Medium Meat Eater'),
        ('meat_low_day', 'Low Meat Eater'),
        ('pescatarian_day', 'Pescatarian'),
        ('vegetarian_day', 'Vegetarian'),
        ('vegan_day', 'Vegan')
    ]
    
    days = 30
    print(f"\nMonthly food emissions ({days} days):")
    for diet, name in diets:
        calc = CarbonCalculator()
        emissions = calc.calculate_food(diet, days)
        print(f"  {name:20s}: {emissions:6.2f} kg CO2e")
        
    # Show potential savings
    calc_heavy = CarbonCalculator()
    calc_vegan = CarbonCalculator()
    heavy = calc_heavy.calculate_food('meat_heavy_day', days)
    vegan = calc_vegan.calculate_food('vegan_day', days)
    savings = heavy - vegan
    print(f"\nPotential monthly savings switching from heavy meat to vegan:")
    print(f"  {savings:.2f} kg CO2e ({(savings/heavy*100):.1f}% reduction)")


def example_4_user_journey():
    """Example 4: Complete user journey with missions"""
    print("\n" + "="*60)
    print("EXAMPLE 4: User Journey with Missions")
    print("="*60)
    
    # Create user
    user = UserProfile("user123", "Maria Silva")
    print(f"\nUser created: {user.name}")
    
    # Week 1: Regular habits
    print("\n--- Week 1: Regular Habits ---")
    calc = CarbonCalculator()
    calc.calculate_transportation('car_gasoline_km', 100)  # 20km/day * 5 days
    calc.calculate_energy('electricity_kwh', 50)
    calc.calculate_food('meat_medium_day', 7)
    
    week1_emissions = calc.get_total_emissions()
    user.add_emission_record(
        datetime.now().isoformat(),
        week1_emissions,
        calc.get_breakdown()
    )
    print(f"Week 1 emissions: {week1_emissions:.2f} kg CO2e")
    
    # Start mission
    tips_manager = TipsMissionsManager()
    mission = tips_manager.get_mission_by_id(1)  # Public transport challenge
    user.start_mission(mission)
    print(f"\nMission started: {mission['title']}")
    
    # Week 2: With mission (using public transport)
    print("\n--- Week 2: Using Public Transport (Mission Active) ---")
    calc2 = CarbonCalculator()
    calc2.calculate_transportation('bus_km', 100)  # Switched to bus
    calc2.calculate_energy('electricity_kwh', 50)
    calc2.calculate_food('meat_medium_day', 7)
    
    week2_emissions = calc2.get_total_emissions()
    user.add_emission_record(
        datetime.now().isoformat(),
        week2_emissions,
        calc2.get_breakdown()
    )
    print(f"Week 2 emissions: {week2_emissions:.2f} kg CO2e")
    print(f"Reduction: {week1_emissions - week2_emissions:.2f} kg CO2e")
    
    # Complete mission
    user.complete_mission(1)
    print(f"\n✓ Mission completed!")
    print(f"Points earned: {mission['points']}")
    print(f"CO2 saved from mission: {mission['co2_savings_kg']} kg")
    
    # Show statistics
    print("\n--- User Statistics ---")
    stats = user.get_statistics()
    print(f"Total emissions: {stats['total_emissions_kg']:.2f} kg CO2e")
    print(f"Total CO2 saved: {stats['total_co2_saved_kg']:.2f} kg CO2e")
    print(f"Net impact: {stats['net_impact_kg']:.2f} kg CO2e")
    print(f"Total points: {stats['total_points']}")


def example_5_tips_by_category():
    """Example 5: Get tips by category"""
    print("\n" + "="*60)
    print("EXAMPLE 5: Sustainable Tips by Category")
    print("="*60)
    
    manager = TipsMissionsManager()
    
    categories = ['transportation', 'energy', 'food']
    
    for category in categories:
        tips = manager.get_tips_by_category(category)
        print(f"\n{category.upper()} TIPS:")
        for tip in tips:
            print(f"  • {tip['title']} ({tip['impact'].upper()} impact)")
            print(f"    {tip['description']}")


if __name__ == "__main__":
    # Run all examples
    example_1_basic_calculation()
    example_2_comparison()
    example_3_diet_impact()
    example_4_user_journey()
    example_5_tips_by_category()
    
    print("\n" + "="*60)
    print("Examples completed!")
    print("="*60 + "\n")
