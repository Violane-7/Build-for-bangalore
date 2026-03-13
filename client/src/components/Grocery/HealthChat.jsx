import { useState, useRef, useEffect } from "react";
import "./HealthChat.css";

// Fallback health data when backend is unavailable
const FALLBACK_DATA = {
  headache: {
    condition: "Headache / Migraine",
    description: "Headaches can be caused by dehydration, tension, low blood sugar, or food triggers.",
    foodsToEat: [
      { name: "Water / Herbal Tea", reason: "Dehydration is the most common headache trigger. Staying hydrated can quickly relieve tension headaches.", icon: "💧" },
      { name: "Ginger Tea", reason: "Ginger has anti-inflammatory properties that reduce headache severity.", icon: "🫚" },
      { name: "Bananas", reason: "Rich in magnesium and potassium, which help relax blood vessels.", icon: "🍌" },
      { name: "Almonds", reason: "High in magnesium which is a natural muscle relaxant.", icon: "🥜" },
      { name: "Spinach / Leafy Greens", reason: "Rich in riboflavin (B2) which reduces migraine frequency.", icon: "🥬" },
    ],
    foodsToAvoid: [
      { name: "Aged Cheese", reason: "Contains tyramine which triggers migraines.", icon: "🧀" },
      { name: "Alcohol", reason: "Causes dehydration and contains histamines that trigger headaches.", icon: "🍷" },
      { name: "Chocolate", reason: "Contains caffeine that can trigger headaches in sensitive people.", icon: "🍫" },
      { name: "Processed Meats", reason: "Nitrates and nitrites dilate blood vessels and worsen headaches.", icon: "🥓" },
    ],
    generalAdvice: "Stay well-hydrated, eat regular meals, and keep a food diary to identify triggers.",
  },
  cold: {
    condition: "Common Cold / Flu",
    description: "When fighting a cold, your immune system needs extra support from nutrient-rich foods.",
    foodsToEat: [
      { name: "Chicken Soup", reason: "Contains cysteine which thins mucus, warm broth soothes throat.", icon: "🍲" },
      { name: "Citrus Fruits", reason: "Rich in Vitamin C which boosts immune cell production.", icon: "🍊" },
      { name: "Garlic", reason: "Allicin has antimicrobial and immune-boosting properties.", icon: "🧄" },
      { name: "Ginger Tea with Honey", reason: "Reduces inflammation, soothes throat, provides warmth.", icon: "🍵" },
      { name: "Turmeric Milk", reason: "Curcumin has powerful anti-inflammatory and antiviral properties.", icon: "🥛" },
    ],
    foodsToAvoid: [
      { name: "Sugary Drinks", reason: "Sugar suppresses immune function for hours.", icon: "🥤" },
      { name: "Fried Foods", reason: "Hard to digest and increase inflammation.", icon: "🍟" },
      { name: "Alcohol", reason: "Dehydrates and suppresses immune system.", icon: "🍺" },
      { name: "Dairy (if congested)", reason: "Can thicken mucus and worsen congestion.", icon: "🧈" },
    ],
    generalAdvice: "Rest, stay hydrated with warm fluids, and focus on nutrient-dense foods.",
  },
  tired: {
    condition: "Fatigue / Low Energy",
    description: "Persistent fatigue can stem from poor nutrition. The right foods provide sustained energy.",
    foodsToEat: [
      { name: "Oatmeal", reason: "Complex carbs provide slow-release energy without crashes.", icon: "🥣" },
      { name: "Bananas", reason: "Natural sugars provide quick energy, potassium prevents muscle fatigue.", icon: "🍌" },
      { name: "Eggs", reason: "Complete protein with B vitamins essential for energy conversion.", icon: "🥚" },
      { name: "Nuts & Seeds", reason: "Healthy fats and protein for sustained energy.", icon: "🥜" },
      { name: "Dark Leafy Greens", reason: "Rich in iron — iron deficiency is a common cause of fatigue.", icon: "🥬" },
    ],
    foodsToAvoid: [
      { name: "Sugary Snacks", reason: "Cause rapid blood sugar spikes followed by crashes.", icon: "🍬" },
      { name: "Energy Drinks", reason: "Temporary boost followed by worse fatigue.", icon: "🥫" },
      { name: "White Bread", reason: "High glycemic foods cause energy crashes.", icon: "🍞" },
      { name: "Heavy Meals", reason: "Divert blood flow to digestion, causing drowsiness.", icon: "🍝" },
    ],
    generalAdvice: "Eat smaller, frequent meals. Stay hydrated. Ensure adequate iron and B12 intake.",
  },
  stomach: {
    condition: "Digestive Issues / Bloating",
    description: "Digestive discomfort can be relieved by choosing easily digestible foods that support gut health.",
    foodsToEat: [
      { name: "Yogurt / Curd", reason: "Probiotics restore gut flora balance and improve digestion.", icon: "🥣" },
      { name: "Ginger", reason: "Stimulates digestive enzymes and reduces nausea.", icon: "🫚" },
      { name: "Papaya", reason: "Contains papain enzyme that breaks down proteins.", icon: "🍈" },
      { name: "Bananas", reason: "Easy to digest, contain pectin that aids digestion.", icon: "🍌" },
      { name: "Brown Rice", reason: "Gentle on stomach, provides fiber for regularity.", icon: "🍚" },
    ],
    foodsToAvoid: [
      { name: "Carbonated Drinks", reason: "CO₂ creates gas causing bloating.", icon: "🥤" },
      { name: "Fried Foods", reason: "Slow digestion and can cause acid reflux.", icon: "🍟" },
      { name: "Artificial Sweeteners", reason: "Poorly absorbed, cause bloating.", icon: "🍬" },
      { name: "Raw Cruciferous Vegetables", reason: "Raw broccoli/cabbage can cause gas.", icon: "🥦" },
    ],
    generalAdvice: "Eat slowly, chew thoroughly. Avoid eating late at night.",
  },
  stress: {
    condition: "Stress & Anxiety",
    description: "Chronic stress depletes nutrients. The right foods calm the nervous system.",
    foodsToEat: [
      { name: "Dark Chocolate (70%+)", reason: "Flavonoids reduce cortisol and trigger endorphins.", icon: "🍫" },
      { name: "Chamomile Tea", reason: "Apigenin promotes relaxation and reduces anxiety.", icon: "🍵" },
      { name: "Salmon", reason: "Omega-3s reduce inflammation linked to anxiety.", icon: "🐟" },
      { name: "Avocado", reason: "B vitamins and magnesium support stress response.", icon: "🥑" },
      { name: "Blueberries", reason: "Antioxidants combat oxidative stress.", icon: "🫐" },
    ],
    foodsToAvoid: [
      { name: "Excessive Caffeine", reason: "Stimulates cortisol production and worsens anxiety.", icon: "☕" },
      { name: "Alcohol", reason: "Disrupts sleep and worsens anxiety the next day.", icon: "🍷" },
      { name: "Refined Sugar", reason: "Blood sugar swings trigger cortisol release.", icon: "🍰" },
      { name: "Fast Food", reason: "Linked to higher rates of anxiety and depression.", icon: "🍔" },
    ],
    generalAdvice: "B vitamins, magnesium, and omega-3s are key for stress management. Exercise helps.",
  },
  sleep: {
    condition: "Insomnia / Sleep Issues",
    description: "Sleep quality is influenced by diet. Certain foods promote melatonin and serotonin production.",
    foodsToEat: [
      { name: "Warm Milk", reason: "Tryptophan is a precursor to sleep hormones melatonin and serotonin.", icon: "🥛" },
      { name: "Cherries", reason: "One of few natural sources of melatonin.", icon: "🍒" },
      { name: "Walnuts", reason: "Contain melatonin, serotonin, and magnesium for sleep.", icon: "🥜" },
      { name: "Chamomile Tea", reason: "Mild sedative effects promote relaxation.", icon: "🍵" },
      { name: "Kiwi", reason: "Studies show 2 kiwis before bed improve sleep by 35%.", icon: "🥝" },
    ],
    foodsToAvoid: [
      { name: "Coffee & Tea", reason: "Caffeine stays active 6-8 hours after consumption.", icon: "☕" },
      { name: "Spicy Foods", reason: "Cause heartburn and raise body temperature.", icon: "🌶️" },
      { name: "Heavy Meals", reason: "Digestion keeps the body active during winddown.", icon: "🍝" },
      { name: "Alcohol", reason: "Disrupts REM sleep despite initial drowsiness.", icon: "🍺" },
    ],
    generalAdvice: "Stop eating 2-3 hours before bed. Keep a consistent sleep schedule.",
  },
  skin: {
    condition: "Skin Problems / Acne",
    description: "Skin health is closely linked to nutrition. The right foods improve complexion and reduce acne.",
    foodsToEat: [
      { name: "Avocado", reason: "Healthy fats and Vitamin E moisturize skin from within.", icon: "🥑" },
      { name: "Sweet Potatoes", reason: "Beta-carotene converts to Vitamin A for skin cell repair.", icon: "🍠" },
      { name: "Tomatoes", reason: "Lycopene protects skin from sun damage.", icon: "🍅" },
      { name: "Green Tea", reason: "Catechins improve skin moisture and elasticity.", icon: "🍵" },
      { name: "Water (2-3L daily)", reason: "Hydration is the #1 factor for healthy, glowing skin.", icon: "💧" },
    ],
    foodsToAvoid: [
      { name: "Dairy (skim milk)", reason: "Hormones stimulate oil glands and trigger acne.", icon: "🥛" },
      { name: "High-Glycemic Foods", reason: "Spike insulin which increases sebum production.", icon: "🍰" },
      { name: "Fried Foods", reason: "Excess oil can increase sebum and clog pores.", icon: "🍟" },
      { name: "Alcohol", reason: "Dehydrates skin and triggers inflammatory conditions.", icon: "🍷" },
    ],
    generalAdvice: "Drink plenty of water, eat colorful fruits and vegetables for antioxidants.",
  },
  weight: {
    condition: "Weight Management",
    description: "Sustainable weight loss comes from nutrient-dense, filling foods that maintain a caloric deficit.",
    foodsToEat: [
      { name: "Eggs", reason: "High protein increases satiety by 40% and reduces calorie intake.", icon: "🥚" },
      { name: "Leafy Greens", reason: "Low calorie density — eat large volumes, few calories.", icon: "🥬" },
      { name: "Lean Chicken", reason: "Highest thermic effect — burns more calories during digestion.", icon: "🍗" },
      { name: "Beans & Lentils", reason: "High fiber + protein keeps you full for hours.", icon: "🫘" },
      { name: "Green Tea", reason: "EGCG boosts metabolism by 3-8%.", icon: "🍵" },
    ],
    foodsToAvoid: [
      { name: "Sugary Beverages", reason: "Liquid calories don't trigger satiety signals.", icon: "🥤" },
      { name: "Processed Snacks", reason: "Engineered to be hyperpalatable, impossible to stop.", icon: "🍿" },
      { name: "Creamy Sauces", reason: "Add 200-400 hidden calories to meals.", icon: "🫙" },
      { name: "Alcohol", reason: "Empty calories (7 cal/g) and lowers eating inhibitions.", icon: "🍺" },
    ],
    generalAdvice: "Focus on protein and fiber at every meal. Eat slowly — 20 min for fullness signals.",
  },
};

// Keyword matching
const KEYWORDS = {
  headache: ["headache", "migraine", "head pain", "head hurts", "head ache"],
  cold: ["cold", "flu", "fever", "cough", "sore throat", "runny nose", "sneezing"],
  tired: ["tired", "fatigue", "exhausted", "low energy", "no energy", "sleepy", "weak"],
  stomach: ["stomach", "digestion", "bloating", "bloated", "gas", "nausea", "acidity", "indigestion", "constipation"],
  stress: ["stress", "anxiety", "anxious", "worried", "nervous", "tense", "panic"],
  sleep: ["sleep", "insomnia", "sleepless", "can't sleep", "awake at night"],
  skin: ["skin", "acne", "pimple", "rash", "glow", "complexion"],
  weight: ["weight", "weight loss", "lose weight", "fat", "diet", "slim", "obesity"],
};

function matchCondition(question) {
  const q = question.toLowerCase();
  const sorted = Object.entries(KEYWORDS).sort((a, b) => {
    const aMax = Math.max(...a[1].map(k => k.length));
    const bMax = Math.max(...b[1].map(k => k.length));
    return bMax - aMax;
  });
  for (const [key, keywords] of sorted) {
    for (const kw of keywords) {
      if (q.includes(kw)) return key;
    }
  }
  return null;
}

const SUGGESTED_QUESTIONS = [
  "I have a headache",
  "What to eat for cold & flu?",
  "Feeling tired and low energy",
  "I have stomach issues",
  "Stressed and anxious lately",
  "Can't sleep well at night",
  "How to improve skin health?",
  "Foods for weight loss",
];

export default function HealthChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, typing]);

  const handleSend = async (text) => {
    const question = text || input.trim();
    if (!question) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setInput("");
    setTyping(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    // Try backend first, then fallback
    let aiResponse;
    try {
      const res = await fetch(
        `/api/health-qa/ask`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );
      if (res.ok) {
        aiResponse = await res.json();
      } else {
        throw new Error("API error");
      }
    } catch {
      // Fallback to local data
      const conditionKey = matchCondition(question);
      if (conditionKey && FALLBACK_DATA[conditionKey]) {
        const data = FALLBACK_DATA[conditionKey];
        aiResponse = {
          understood: true,
          condition: data.condition,
          description: data.description,
          foodsToEat: data.foodsToEat,
          foodsToAvoid: data.foodsToAvoid,
          generalAdvice: data.generalAdvice,
          disclaimer: "This is general nutritional guidance, not medical advice.",
        };
      } else {
        aiResponse = {
          understood: false,
          message: "I can help with food advice for conditions like headache, cold, fatigue, digestion, stress, sleep, skin, or weight management.",
          suggestedQuestions: SUGGESTED_QUESTIONS,
        };
      }
    }

    setTyping(false);
    setMessages((prev) => [...prev, { type: "ai", data: aiResponse }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="hc-container">
      {/* Messages */}
      <div className="hc-messages">
        {messages.length === 0 && (
          <div className="hc-welcome">
            <span className="hc-welcome-icon">🩺</span>
            <h3 className="hc-welcome-title">Health Food Advisor</h3>
            <p className="hc-welcome-subtitle">
              Ask me about any health condition and I'll tell you what foods to eat
              and what to avoid. Try one of these:
            </p>
            <div className="hc-suggestions">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} className="hc-suggestion-btn"
                  onClick={() => handleSend(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`hc-msg ${msg.type}`}>
            <div className="hc-msg-avatar">
              {msg.type === "user" ? "👤" : "🤖"}
            </div>
            <div className="hc-msg-bubble">
              {msg.type === "user" ? (
                msg.text
              ) : msg.data.understood ? (
                <div>
                  <div className="hc-response-title">
                    <span className="hc-condition-name">{msg.data.condition}</span>
                  </div>
                  <p className="hc-response-desc">{msg.data.description}</p>

                  <div className="hc-food-section">
                    <div className="hc-section-label eat">✅ Foods to Eat</div>
                    {msg.data.foodsToEat.map((f, j) => (
                      <div key={j} className="hc-food-card">
                        <span className="hc-food-emoji">{f.icon}</span>
                        <div className="hc-food-info">
                          <p className="hc-food-name">{f.name}</p>
                          <p className="hc-food-reason">{f.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hc-food-section">
                    <div className="hc-section-label avoid">❌ Foods to Avoid</div>
                    {msg.data.foodsToAvoid.map((f, j) => (
                      <div key={j} className="hc-food-card">
                        <span className="hc-food-emoji">{f.icon}</span>
                        <div className="hc-food-info">
                          <p className="hc-food-name">{f.name}</p>
                          <p className="hc-food-reason">{f.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hc-advice-box">
                    💡 {msg.data.generalAdvice}
                  </div>
                  <p className="hc-disclaimer">⚕️ {msg.data.disclaimer}</p>
                </div>
              ) : (
                <div className="hc-not-understood">
                  <p>{msg.data.message}</p>
                  {msg.data.suggestedQuestions && (
                    <div className="hc-try-suggestions">
                      {msg.data.suggestedQuestions.slice(0, 5).map((q, j) => (
                        <button key={j} className="hc-try-btn"
                          onClick={() => handleSend(q)}>
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="hc-typing">
            <div className="hc-msg-avatar" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>🤖</div>
            <div className="hc-typing-dots">
              <div className="hc-typing-dot" />
              <div className="hc-typing-dot" />
              <div className="hc-typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="hc-input-bar">
        <input
          className="hc-input"
          placeholder="Ask about a health condition... (e.g., I have a headache)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={typing}
        />
        <button
          className="hc-send-btn"
          onClick={() => handleSend()}
          disabled={!input.trim() || typing}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
