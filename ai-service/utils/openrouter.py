"""
Shared OpenRouter API utility.
Sends structured prompts and parses JSON responses from OpenRouter-compatible LLMs.
"""

import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-001")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


async def call_openrouter(system_prompt: str, user_prompt: str, temperature: float = 0.3) -> dict | None:
    """
    Call OpenRouter API with a system prompt and user prompt.
    Returns the parsed JSON dict from the LLM response, or None on failure.
    """
    if not OPENROUTER_API_KEY:
        return None

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "PreventAI Nutrition Hub",
    }

    payload = {
        "model": OPENROUTER_MODEL,
        "temperature": temperature,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(OPENROUTER_URL, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()

        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        # Strip markdown code fences if present
        content = content.strip()
        if content.startswith("```"):
            # Remove opening fence (```json or ```)
            first_newline = content.index("\n")
            content = content[first_newline + 1:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        return json.loads(content)
    except Exception as e:
        print(f"[OpenRouter] Error: {e}")
        return None


async def call_openrouter_with_image(system_prompt: str, user_text: str, image_base64: str, temperature: float = 0.3) -> dict | None:
    """
    Call OpenRouter API with an image (base64) using multimodal vision capabilities.
    """
    if not OPENROUTER_API_KEY:
        return None

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "PreventAI Nutrition Hub",
    }

    payload = {
        "model": OPENROUTER_MODEL,
        "temperature": temperature,
        "messages": [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_text},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        },
                    },
                ],
            },
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(OPENROUTER_URL, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()

        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        content = content.strip()
        if content.startswith("```"):
            first_newline = content.index("\n")
            content = content[first_newline + 1:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        return json.loads(content)
    except Exception as e:
        print(f"[OpenRouter Vision] Error: {e}")
        return None
