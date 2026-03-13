from fastapi import APIRouter
from pydantic import BaseModel
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from utils.openrouter import call_openrouter

router = APIRouter()

HEALTH_QA_SYSTEM_PROMPT = """You are a professional nutritionist and health food advisor AI.
The user will ask a question about a health condition or symptom.
Your task is to recommend foods to eat and foods to avoid for that specific condition.

You MUST respond with ONLY valid JSON in this EXACT structure (no markdown, no explanation, just JSON):
{
  "understood": true,
  "condition": "<name of the health condition>",
  "description": "<1-2 sentence description of the condition and how food affects it>",
  "foodsToEat": [
    {
      "name": "<food or drink name>",
      "reason": "<specific scientific reason why this food helps>",
      "icon": "<relevant food emoji>"
    }
  ],
  "foodsToAvoid": [
    {
      "name": "<food or drink name>",
      "reason": "<specific reason why this food should be avoided>",
      "icon": "<relevant food emoji>"
    }
  ],
  "generalAdvice": "<1-2 sentences of general dietary advice for this condition>",
  "disclaimer": "This is general nutritional guidance, not medical advice. Consult a healthcare professional for persistent symptoms."
}

Guidelines:
- Provide 4-6 foods to eat and 3-5 foods to avoid
- All reasons must be scientifically accurate and specific
- Use appropriate food emojis (🍌🥬🍵🧄🥜🍊🐟🥛🍫🧀🍷🍟☕🌶️🥤 etc.)
- generalAdvice should be actionable and practical
- If the question is NOT about a health condition or food/nutrition topic, respond with:
  {"understood": false, "message": "I can help with food and nutrition advice for health conditions. Try asking about headaches, colds, fatigue, digestion, stress, sleep, skin health, or weight management.", "suggestedQuestions": ["I have a headache", "What to eat for cold & flu?", "Feeling tired and low energy", "I have stomach issues", "How to improve skin health?"]}
"""


class HealthQARequest(BaseModel):
    question: str


# Fallback for when API is unavailable
FALLBACK_RESPONSE = {
    "understood": True,
    "condition": "General Health",
    "description": "A balanced diet with whole, unprocessed foods supports overall health and well-being.",
    "foodsToEat": [
        {"name": "Leafy Greens", "reason": "Rich in vitamins A, C, K and minerals like iron and calcium.", "icon": "🥬"},
        {"name": "Fruits", "reason": "Packed with antioxidants, vitamins, and natural fiber.", "icon": "🍎"},
        {"name": "Nuts & Seeds", "reason": "Healthy fats, protein, and essential minerals.", "icon": "🥜"},
        {"name": "Water", "reason": "Essential for every bodily function including digestion and detox.", "icon": "💧"},
    ],
    "foodsToAvoid": [
        {"name": "Processed Foods", "reason": "High in sodium, preservatives, and unhealthy fats.", "icon": "🍟"},
        {"name": "Sugary Drinks", "reason": "Empty calories that spike blood sugar and offer no nutrition.", "icon": "🥤"},
        {"name": "Excessive Alcohol", "reason": "Damages liver, dehydrates body, and suppresses immunity.", "icon": "🍷"},
    ],
    "generalAdvice": "Eat a variety of colorful whole foods, stay hydrated, and maintain regular meal times.",
    "disclaimer": "This is general nutritional guidance, not medical advice.",
}


@router.post("")
async def health_qa(body: HealthQARequest):
    """
    Answer health questions with food recommendations using OpenRouter AI.
    """
    if not body.question or not body.question.strip():
        return {
            "understood": False,
            "message": "Please ask a health-related question.",
            "suggestedQuestions": [
                "I have a headache",
                "What to eat for cold & flu?",
                "Feeling tired and low energy",
                "I have stomach issues",
                "Stressed and anxious lately",
                "Can't sleep well at night",
                "How to improve skin health?",
                "Foods for weight loss",
            ],
        }

    result = await call_openrouter(
        system_prompt=HEALTH_QA_SYSTEM_PROMPT,
        user_prompt=body.question.strip(),
    )

    if not result:
        result = FALLBACK_RESPONSE

    # Ensure the response has the required structure
    if result.get("understood") is not False:
        result.setdefault("understood", True)
        result.setdefault("condition", "General Health")
        result.setdefault("description", "")
        result.setdefault("foodsToEat", [])
        result.setdefault("foodsToAvoid", [])
        result.setdefault("generalAdvice", "Maintain a balanced diet with whole foods.")
        result.setdefault("disclaimer", "This is general nutritional guidance, not medical advice.")

    return result
