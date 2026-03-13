from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from utils.openrouter import call_openrouter_with_image, call_openrouter

router = APIRouter()

FOOD_PLATE_SYSTEM_PROMPT = """You are a professional nutritionist AI. The user will provide an image of a food plate.
Your task is to identify the food in the image and return a detailed nutritional analysis.

You MUST respond with ONLY valid JSON in this EXACT structure (no markdown, no explanation, just JSON):
{
  "name": "<food name>",
  "description": "<2-3 sentence description of the food>",
  "calories_per_serving": <integer>,
  "serving_size": "<e.g. 1 plate (300g)>",
  "macros": {
    "protein": <float in grams>,
    "carbs": <float in grams>,
    "fat": <float in grams>,
    "fiber": <float in grams>,
    "sugar": <float in grams>
  },
  "vitamins": {
    "<Vitamin Name>": "<percentage DV string>",
    "<Vitamin Name>": "<percentage DV string>",
    "<Vitamin Name>": "<percentage DV string>",
    "<Vitamin Name>": "<percentage DV string>",
    "<Vitamin Name>": "<percentage DV string>"
  },
  "minerals": {
    "<Mineral Name>": "<percentage DV string>",
    "<Mineral Name>": "<percentage DV string>",
    "<Mineral Name>": "<percentage DV string>",
    "<Mineral Name>": "<percentage DV string>",
    "<Mineral Name>": "<percentage DV string>"
  },
  "benefits": [
    "<benefit 1 - specific and detailed>",
    "<benefit 2>",
    "<benefit 3>",
    "<benefit 4>",
    "<benefit 5>"
  ],
  "health_score": <integer 1-10>
}

Guidelines:
- Identify the actual food in the image accurately
- Provide realistic, accurate nutritional values
- health_score: 1-3 (unhealthy), 4-6 (moderate), 7-8 (good), 9-10 (excellent)
- Always provide exactly 5 vitamins, 5 minerals, and 4-5 benefits
- Benefits should be specific and scientifically accurate
- If you cannot identify the food clearly, make your best guess based on visual appearance
"""

FOOD_NAME_SYSTEM_PROMPT = """You are a professional nutritionist AI. The user will provide the name of a food item.
Your task is to return a detailed nutritional analysis of that food.

You MUST respond with ONLY valid JSON in this EXACT structure (no markdown, no explanation, just JSON):
{
  "name": "<proper food name>",
  "description": "<2-3 sentence description of the food>",
  "calories_per_serving": <integer>,
  "serving_size": "<e.g. 1 plate (300g)>",
  "macros": {
    "protein": <float in grams>,
    "carbs": <float in grams>,
    "fat": <float in grams>,
    "fiber": <float in grams>,
    "sugar": <float in grams>
  },
  "vitamins": {
    "<Vitamin Name>": "<percentage DV string>",
    "<Vitamin Name>": "<percentage DV string>",
    "<Vitamin Name>": "<percentage DV string>",
    "<Vitamin Name>": "<percentage DV string>",
    "<Vitamin Name>": "<percentage DV string>"
  },
  "minerals": {
    "<Mineral Name>": "<percentage DV string>",
    "<Mineral Name>": "<percentage DV string>",
    "<Mineral Name>": "<percentage DV string>",
    "<Mineral Name>": "<percentage DV string>",
    "<Mineral Name>": "<percentage DV string>"
  },
  "benefits": [
    "<benefit 1 - specific and detailed>",
    "<benefit 2>",
    "<benefit 3>",
    "<benefit 4>",
    "<benefit 5>"
  ],
  "health_score": <integer 1-10>
}

Guidelines:
- Provide realistic, accurate nutritional values based on standard serving sizes
- health_score: 1-3 (unhealthy), 4-6 (moderate), 7-8 (good), 9-10 (excellent)
- Always provide exactly 5 vitamins, 5 minerals, and 4-5 benefits
- Benefits should be specific and scientifically accurate
"""


class FoodPlateRequest(BaseModel):
    image: Optional[str] = None  # base64 encoded image
    foodName: Optional[str] = None  # optional manual food name


# Fallback data for when API is unavailable
FALLBACK_FOOD = {
    "name": "Food Item",
    "description": "An identified food item. While specific nutritional data may vary, most whole foods provide essential macronutrients, vitamins, and minerals.",
    "calories_per_serving": 200,
    "serving_size": "1 serving (150g)",
    "macros": {"protein": 8.0, "carbs": 25.0, "fat": 8.0, "fiber": 2.0, "sugar": 5.0},
    "vitamins": {"Vitamin A": "10% DV", "Vitamin C": "8% DV", "Vitamin B6": "6% DV", "Vitamin B12": "4% DV", "Folate": "5% DV"},
    "minerals": {"Iron": "8% DV", "Calcium": "6% DV", "Potassium": "5% DV", "Zinc": "5% DV", "Selenium": "8% DV"},
    "benefits": [
        "Provides essential energy for daily activities",
        "Contains a mix of macro and micronutrients",
        "Part of a balanced diet when consumed in moderation",
        "Whole, unprocessed foods generally support overall health"
    ],
    "health_score": 6
}


@router.post("")
async def analyze_food_plate(body: FoodPlateRequest):
    """
    Analyze a food plate image or food name using OpenRouter AI
    to provide comprehensive nutritional information and health benefits.
    """
    food = None

    if body.image:
        # Use vision model to identify food from image
        food = await call_openrouter_with_image(
            system_prompt=FOOD_PLATE_SYSTEM_PROMPT,
            user_text="Identify the food in this image and provide its complete nutritional analysis. Be as accurate as possible.",
            image_base64=body.image,
        )
    elif body.foodName:
        # Use text model with food name
        food = await call_openrouter(
            system_prompt=FOOD_NAME_SYSTEM_PROMPT,
            user_prompt=f"Provide a complete nutritional analysis for: {body.foodName}",
        )

    if not food:
        food = FALLBACK_FOOD

    # Ensure all required fields exist
    food.setdefault("health_score", 6)
    food.setdefault("benefits", [])
    food.setdefault("macros", {})
    food.setdefault("vitamins", {})
    food.setdefault("minerals", {})

    return {
        "identified": True,
        "food": food,
        "healthRating": _get_health_rating(food["health_score"]),
        "dailyIntakeAdvice": _get_intake_advice(food),
    }


def _get_health_rating(score: int) -> dict:
    score = int(score) if score else 6
    if score >= 9:
        return {"score": score, "label": "Excellent", "color": "#22c55e"}
    elif score >= 7:
        return {"score": score, "label": "Good", "color": "#84cc16"}
    elif score >= 5:
        return {"score": score, "label": "Moderate", "color": "#eab308"}
    elif score >= 3:
        return {"score": score, "label": "Fair", "color": "#f97316"}
    else:
        return {"score": score, "label": "Poor", "color": "#ef4444"}


def _get_intake_advice(food: dict) -> str:
    cals = food.get("calories_per_serving", 200)
    if not isinstance(cals, (int, float)):
        cals = 200
    if cals < 150:
        return f"This is a low-calorie food at {cals} kcal per serving. You can enjoy this freely as part of a balanced diet."
    elif cals < 300:
        return f"At {cals} kcal per serving, this is a moderate-calorie food. Enjoy 1-2 servings as part of your meal plan."
    elif cals < 500:
        return f"This food contains {cals} kcal per serving. Consider portion control and balance with vegetables and fiber."
    else:
        return f"At {cals} kcal per serving, this is calorie-dense. Best consumed occasionally and in controlled portions."
