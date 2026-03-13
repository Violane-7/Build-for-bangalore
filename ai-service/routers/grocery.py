from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from utils.openrouter import call_openrouter_with_image, call_openrouter

router = APIRouter()

GROCERY_IMAGE_SYSTEM_PROMPT = """You are a professional nutritionist AI. The user will provide an image of a grocery list, receipt, or grocery items.
Your task is to identify all the grocery items and provide a detailed nutritional and health analysis for each.

You MUST respond with ONLY valid JSON in this EXACT structure (no markdown, no explanation, just JSON):
{
  "items": [
    {
      "key": "<lowercase item key>",
      "name": "<proper item name>",
      "category": "<category: Fruit, Vegetable, Dairy, Protein, Grain, Snack, Beverage, Spice, etc.>",
      "description": "<1-2 sentence description>",
      "nutrition": {
        "calories": <integer per 100g>,
        "protein": <float>,
        "carbs": <float>,
        "fat": <float>,
        "fiber": <float>
      },
      "benefits": ["<benefit 1>", "<benefit 2>", "<benefit 3>"],
      "isHealthy": <true or false>,
      "healthVerdict": "<1 sentence health verdict>"
    }
  ],
  "combinations": [
    {
      "title": "<combination name>",
      "reason": "<why these items work well together, scientific reason>",
      "icon": "<relevant emoji>",
      "items": ["<item name 1>", "<item name 2>"]
    }
  ]
}

Guidelines:
- Identify ALL items visible in the image
- Be accurate about nutritional values per 100g
- isHealthy should be false only for highly processed or junk foods
- Provide 2-4 smart combination suggestions based on actual items found
- Combinations should highlight synergistic nutritional benefits (e.g., Vitamin C + Iron absorption)
- Each item should have exactly 3 benefits
"""

GROCERY_TEXT_SYSTEM_PROMPT = """You are a professional nutritionist AI. The user will provide a list of grocery items (as text).
Your task is to analyze each item and provide detailed nutritional and health information.

You MUST respond with ONLY valid JSON in this EXACT structure (no markdown, no explanation, just JSON):
{
  "items": [
    {
      "key": "<lowercase item key>",
      "name": "<proper item name>",
      "category": "<category: Fruit, Vegetable, Dairy, Protein, Grain, Snack, Beverage, Spice, etc.>",
      "description": "<1-2 sentence description>",
      "nutrition": {
        "calories": <integer per 100g>,
        "protein": <float>,
        "carbs": <float>,
        "fat": <float>,
        "fiber": <float>
      },
      "benefits": ["<benefit 1>", "<benefit 2>", "<benefit 3>"],
      "isHealthy": <true or false>,
      "healthVerdict": "<1 sentence health verdict>"
    }
  ],
  "combinations": [
    {
      "title": "<combination name>",
      "reason": "<why these items work well together, scientific reason>",
      "icon": "<relevant emoji>",
      "items": ["<item name 1>", "<item name 2>"]
    }
  ]
}

Guidelines:
- Analyze each item accurately
- Be accurate about nutritional values per 100g
- isHealthy should be false only for highly processed or junk foods
- Provide 2-4 smart combination suggestions based on the items
- Combinations should highlight synergistic nutritional benefits
- Each item should have exactly 3 benefits
"""


class GroceryRequest(BaseModel):
    items: Optional[List[dict]] = None
    groceryList: Optional[str] = None


class GroceryImageRequest(BaseModel):
    image: Optional[str] = None
    textList: Optional[str] = None


# Fallback data
FALLBACK_ITEMS = [
    {"key": "apple", "name": "Apple", "category": "Fruit", "description": "A crisp, fiber-rich fruit.", "nutrition": {"calories": 52, "protein": 0.3, "carbs": 14, "fat": 0.2, "fiber": 2.4}, "benefits": ["Rich in antioxidants", "Pectin fiber for gut health", "Low calorie"], "isHealthy": True, "healthVerdict": "Excellent daily choice."},
    {"key": "milk", "name": "Milk", "category": "Dairy", "description": "Complete nutritional beverage.", "nutrition": {"calories": 61, "protein": 3.2, "carbs": 5, "fat": 3.3, "fiber": 0}, "benefits": ["Outstanding calcium source", "Complete protein", "Vitamin D"], "isHealthy": True, "healthVerdict": "Excellent daily staple."},
    {"key": "bread", "name": "Bread", "category": "Grain", "description": "Staple carb source.", "nutrition": {"calories": 265, "protein": 9, "carbs": 49, "fat": 3.2, "fiber": 2.7}, "benefits": ["Complex carbs for energy", "B vitamins", "Iron"], "isHealthy": True, "healthVerdict": "Choose whole grain for best benefit."},
]
FALLBACK_COMBOS = [
    {"title": "Iron Boost", "reason": "Vitamin C improves iron absorption.", "icon": "💪", "items": ["apple", "spinach"]},
]


@router.post("")
async def grocery_analyze(body: GroceryRequest):
    """Analyze a list of grocery items using OpenRouter AI."""
    item_names = ""
    if body.items:
        item_names = ", ".join([i.get("name", "") for i in body.items if i.get("name")])
    elif body.groceryList:
        item_names = body.groceryList

    if not item_names:
        return {"items": [], "combinations": [], "overallAssessment": {"healthyItems": 0, "totalItems": 0, "healthPercentage": 0, "verdict": "No items provided."}}

    result = await call_openrouter(
        system_prompt=GROCERY_TEXT_SYSTEM_PROMPT,
        user_prompt=f"Analyze these grocery items: {item_names}",
    )

    if not result or "items" not in result:
        result = {"items": FALLBACK_ITEMS, "combinations": FALLBACK_COMBOS}

    # Add overall assessment
    items = result.get("items", [])
    healthy_count = sum(1 for i in items if i.get("isHealthy", True))
    total = len(items) or 1
    pct = round((healthy_count / total) * 100)

    result["overallAssessment"] = {
        "healthyItems": healthy_count,
        "totalItems": total,
        "healthPercentage": pct,
        "verdict": _get_verdict(pct),
    }
    return result


@router.post("/image")
async def grocery_analyze_image(body: GroceryImageRequest):
    """Analyze a grocery list image or text list using OpenRouter AI vision."""
    result = None

    if body.image:
        result = await call_openrouter_with_image(
            system_prompt=GROCERY_IMAGE_SYSTEM_PROMPT,
            user_text="Identify all grocery items in this image and provide detailed nutritional analysis for each item. Also suggest smart food combinations.",
            image_base64=body.image,
        )
    elif body.textList:
        result = await call_openrouter(
            system_prompt=GROCERY_TEXT_SYSTEM_PROMPT,
            user_prompt=f"Analyze these grocery items: {body.textList}",
        )

    if not result or "items" not in result:
        result = {"items": FALLBACK_ITEMS, "combinations": FALLBACK_COMBOS}

    # Add overall assessment
    items = result.get("items", [])
    healthy_count = sum(1 for i in items if i.get("isHealthy", True))
    total = len(items) or 1
    pct = round((healthy_count / total) * 100)

    result["overallAssessment"] = {
        "healthyItems": healthy_count,
        "totalItems": total,
        "healthPercentage": pct,
        "verdict": _get_verdict(pct),
    }
    return result


def _get_verdict(pct: int) -> str:
    if pct >= 80:
        return "Excellent! Your grocery list is packed with nutritious choices."
    elif pct >= 60:
        return "Good mix! Consider adding more vegetables and reducing processed items."
    elif pct >= 40:
        return "Fair. Try to replace some processed items with whole foods."
    else:
        return "Needs improvement. Consider adding more fruits, vegetables, and whole grains."
