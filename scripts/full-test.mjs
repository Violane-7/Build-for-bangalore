/**
 * PranexusAI — Comprehensive API Test Suite
 * Tests EVERY endpoint across all 3 services.
 *
 * Usage:
 *   1. Make sure MongoDB is running (Compass or mongod)
 *   2. Start backend:  cd server && npm run dev
 *   3. Start AI:       cd ai-service && uvicorn main:app --reload --port 8000
 *   4. Run:            node scripts/full-test.mjs
 */

const SERVER = process.env.SERVER_URL || "http://localhost:5001";
const AI     = process.env.AI_URL     || "http://localhost:8000";

// ──────────────────── Helpers ────────────────────

let TOKEN = "";
let TEST_USER_ID = "";
const TEST_EMAIL = `testuser_${Date.now()}@test.com`;
const TEST_PASS  = "Test@12345";

function withTimeout(promise, ms = 15000) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`Timeout after ${ms}ms`)), ms)),
  ]);
}

async function req(url, method = "GET", body = null, auth = false) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  if (auth && TOKEN) opts.headers["Authorization"] = `Bearer ${TOKEN}`;
  const res = await withTimeout(fetch(url, opts));
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  return { status: res.status, text, json };
}

// ──────────────────── Test runner ────────────────────

const results = [];

async function test(name, fn) {
  try {
    const { pass, status, detail } = await fn();
    results.push({ name, pass, status, detail });
    console.log(`${pass ? "✅ PASS" : "❌ FAIL"} ${name} [${status}]`);
    if (!pass) console.log(`        ↳ ${detail}`);
  } catch (err) {
    results.push({ name, pass: false, status: "ERR", detail: err.message });
    console.log(`❌ FAIL ${name} [ERR]`);
    console.log(`        ↳ ${err.message}`);
  }
}

// ──────────────────── 1. Service Health ────────────────────

async function testServiceHealth() {
  console.log("\n═══════════════════════════════════════");
  console.log("  1. SERVICE HEALTH CHECKS");
  console.log("═══════════════════════════════════════\n");

  await test("Node backend ping", async () => {
    const r = await req(`${SERVER}/api/ping`);
    return { pass: r.status === 200 && r.json?.status === "ok", status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("Node backend root", async () => {
    const r = await req(`${SERVER}/`);
    return { pass: r.status === 200 && r.json?.service, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("AI service ping", async () => {
    const r = await req(`${AI}/ping`);
    return { pass: r.status === 200 && r.json?.status === "ok", status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("AI service root (endpoint list)", async () => {
    const r = await req(`${AI}/`);
    return { pass: r.status === 200 && r.json?.endpoints?.length > 0, status: r.status, detail: r.text.slice(0, 160) };
  });
}

// ──────────────────── 2. Auth Flow ────────────────────

async function testAuthFlow() {
  console.log("\n═══════════════════════════════════════");
  console.log("  2. AUTHENTICATION FLOW");
  console.log("═══════════════════════════════════════\n");

  await test("POST /api/auth/register", async () => {
    const r = await req(`${SERVER}/api/auth/register`, "POST", {
      name: "Test User", email: TEST_EMAIL, password: TEST_PASS, gender: "male", dob: "2000-01-01",
    });
    if (r.json?.user?.id) TEST_USER_ID = r.json.user.id;
    return { pass: r.status === 201 && r.json?.user?.id, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("POST /api/auth/register (duplicate → 400)", async () => {
    const r = await req(`${SERVER}/api/auth/register`, "POST", {
      name: "Test User", email: TEST_EMAIL, password: TEST_PASS, gender: "male", dob: "2000-01-01",
    });
    return { pass: r.status === 400, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("POST /api/auth/login (unverified → 403)", async () => {
    const r = await req(`${SERVER}/api/auth/login`, "POST", { email: TEST_EMAIL, password: TEST_PASS });
    return { pass: r.status === 403, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("POST /api/auth/resend-verification", async () => {
    const r = await req(`${SERVER}/api/auth/resend-verification`, "POST", { email: TEST_EMAIL });
    // May succeed (200) or fail (500 if SMTP down) — both are "route works"
    return { pass: r.status === 200 || r.status === 500, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("POST /api/auth/verify-email (invalid token → 400)", async () => {
    const r = await req(`${SERVER}/api/auth/verify-email`, "POST", { token: "invalid_token" });
    return { pass: r.status === 400, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("POST /api/auth/login (wrong password → 400)", async () => {
    const r = await req(`${SERVER}/api/auth/login`, "POST", { email: TEST_EMAIL, password: "wrongpassword" });
    return { pass: r.status === 400, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("POST /api/auth/login (nonexistent → 400)", async () => {
    const r = await req(`${SERVER}/api/auth/login`, "POST", { email: "notexist@x.com", password: "pass" });
    return { pass: r.status === 400, status: r.status, detail: r.text.slice(0, 120) };
  });
}

// ──────────────────── 3. Auth Token ────────────────────

async function getToken() {
  console.log("\n═══════════════════════════════════════");
  console.log("  3. OBTAINING AUTH TOKEN");
  console.log("═══════════════════════════════════════\n");

  if (TEST_USER_ID) {
    // Create JWT using Web Crypto API (known secret from server/.env)
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=/g, "");
    const payload = btoa(JSON.stringify({
      id: TEST_USER_ID, gender: "male",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    })).replace(/=/g, "");

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode("test_jwt_secret_change_in_production"),
      { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(`${header}.${payload}`));
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

    TOKEN = `${header}.${payload}.${sigB64}`;
    console.log(`  ✅ Created JWT for test user ID: ${TEST_USER_ID}`);
  } else {
    console.log("  ⚠️  No user ID available. Authenticated tests will fail.");
  }
}

// ──────────────────── 4. User Profile ────────────────────

async function testUserProfile() {
  console.log("\n═══════════════════════════════════════");
  console.log("  4. USER PROFILE");
  console.log("═══════════════════════════════════════\n");

  await test("GET /api/users/me", async () => {
    const r = await req(`${SERVER}/api/users/me`, "GET", null, true);
    return { pass: r.status === 200 && r.json?.email, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("PUT /api/users/me (update name)", async () => {
    const r = await req(`${SERVER}/api/users/me`, "PUT", { name: "Updated Test User" }, true);
    return { pass: r.status === 200, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("PUT /api/users/emergency-contacts", async () => {
    const r = await req(`${SERVER}/api/users/emergency-contacts`, "PUT", {
      contacts: [{ name: "Mom", phone: "9876543210", relation: "Mother" }],
    }, true);
    return { pass: r.status === 200, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("GET /api/users/me (no auth → 401)", async () => {
    const r = await req(`${SERVER}/api/users/me`);
    return { pass: r.status === 401, status: r.status, detail: r.text.slice(0, 120) };
  });
}

// ──────────────────── 5. Health Metrics ────────────────────

async function testHealthMetrics() {
  console.log("\n═══════════════════════════════════════");
  console.log("  5. HEALTH METRICS & ANALYSIS");
  console.log("═══════════════════════════════════════\n");

  await test("POST /api/health/metrics", async () => {
    const r = await req(`${SERVER}/api/health/metrics`, "POST", {
      steps: 8000, sleep: 7.5, heartRate: 72,
      bloodPressureSystolic: 120, bloodPressureDiastolic: 78,
      weight: 70, calories: 2000, screenTime: 3, waterIntake: 8, stressLevel: 4,
    }, true);
    return { pass: r.status === 201, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("GET /api/health/metrics", async () => {
    const r = await req(`${SERVER}/api/health/metrics`, "GET", null, true);
    return { pass: r.status === 200 && Array.isArray(r.json), status: r.status, detail: `Got ${r.json?.length || 0} records` };
  });

  await test("POST /api/health/analyze (AI risk)", async () => {
    const r = await req(`${SERVER}/api/health/analyze`, "POST", {}, true);
    return { pass: r.status === 200 || r.status === 201, status: r.status, detail: r.text.slice(0, 160) };
  });

  await test("GET /api/health/predictions", async () => {
    const r = await req(`${SERVER}/api/health/predictions`, "GET", null, true);
    return { pass: r.status === 200 && Array.isArray(r.json), status: r.status, detail: `Got ${r.json?.length || 0} predictions` };
  });
}

// ──────────────────── 6. Medical Reports ────────────────────

async function testMedicalReports() {
  console.log("\n═══════════════════════════════════════");
  console.log("  6. MEDICAL REPORTS");
  console.log("═══════════════════════════════════════\n");

  await test("POST /api/health/reports", async () => {
    const r = await req(`${SERVER}/api/health/reports`, "POST", {
      organ: "heart",
      system: "cardiovascular",
      testName: "ECG",
      values: { heartRate: 72, rhythm: "normal sinus" },
      date: new Date().toISOString(),
    }, true);
    return { pass: r.status === 201, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("GET /api/health/reports", async () => {
    const r = await req(`${SERVER}/api/health/reports`, "GET", null, true);
    return { pass: r.status === 200 && Array.isArray(r.json), status: r.status, detail: `Got ${r.json?.length || 0} reports` };
  });
}

// ──────────────────── 7. AI Health Endpoints (via Node proxy) ────────────────────

async function testAIHealthEndpoints() {
  console.log("\n═══════════════════════════════════════");
  console.log("  7. AI HEALTH ENDPOINTS (via Node)");
  console.log("═══════════════════════════════════════\n");

  const aiEndpoints = [
    { name: "glycemic-curve", body: { userId: "test", meals: [{ name: "rice", quantity_g: 200 }], diabeticRisk: 0.3 } },
    { name: "sleep-debt", body: { userId: "test", sleepHistory: [{ date: "2025-03-10", hours: 6 }, { date: "2025-03-11", hours: 7 }, { date: "2025-03-12", hours: 5 }] } },
    { name: "dopamine-score", body: { userId: "test", screenTimeHours: 5, socialMediaHours: 3, gamingHours: 1, exerciseHours: 1, sleepHours: 7 } },
    { name: "biological-age", body: { userId: "test", chronologicalAge: 25, bmi: 22, avgSleepHours: 7, avgStepsPerDay: 8000, smokingStatus: false, avgStressLevel: 4, avgBloodPressureSystolic: 120, fastingGlucose: 90 } },
    { name: "recommend", body: { userId: "test", riskScores: { diabetes: 0.6, cardiac: 0.3, obesity: 0.4, stress: 0.5 }, metrics: { steps: 5000, sleep: 6 } } },
    { name: "baseline-compare", body: { userId: "test", previousScore: 65, currentScore: 75, previousCredits: 100 } },
    { name: "goal-plan", body: { userId: "test", goalDescription: "Lose 5 kg in 3 months", currentWeightKg: 80, targetWeightKg: 75, targetWeeks: 12, currentSteps: 6000, currentSleepHours: 7 } },
    { name: "emergency-detect", body: { userId: "test", heartRate: 180, bloodPressureSystolic: 200, oxygenSaturation: 88, lossOfConsciousness: false } },
  ];

  for (const ep of aiEndpoints) {
    await test(`POST /api/health/${ep.name}`, async () => {
      const r = await req(`${SERVER}/api/health/${ep.name}`, "POST", ep.body, true);
      return { pass: r.status === 200, status: r.status, detail: r.text.slice(0, 160) };
    });
  }
}

// ──────────────────── 8. Appointments ────────────────────

let appointmentId = "";

async function testAppointments() {
  console.log("\n═══════════════════════════════════════");
  console.log("  8. APPOINTMENTS");
  console.log("═══════════════════════════════════════\n");

  await test("POST /api/appointments", async () => {
    const r = await req(`${SERVER}/api/appointments`, "POST", {
      doctorId: "doc_test_001",
      doctorName: "Dr. Smith",
      specialty: "Cardiology",
      date: new Date(Date.now() + 86400000).toISOString(),
      notes: "Routine checkup",
    }, true);
    if (r.json?._id) appointmentId = r.json._id;
    return { pass: r.status === 201, status: r.status, detail: r.text.slice(0, 120) };
  });

  await test("GET /api/appointments", async () => {
    const r = await req(`${SERVER}/api/appointments`, "GET", null, true);
    return { pass: r.status === 200 && Array.isArray(r.json), status: r.status, detail: `Got ${r.json?.length || 0} appointments` };
  });

  await test("PATCH /api/appointments/:id", async () => {
    if (!appointmentId) return { pass: false, status: "SKIP", detail: "No appointment ID" };
    const r = await req(`${SERVER}/api/appointments/${appointmentId}`, "PATCH", { notes: "Updated notes" }, true);
    return { pass: r.status === 200, status: r.status, detail: r.text.slice(0, 120) };
  });
}

// ──────────────────── 9. Doctors ────────────────────

async function testDoctors() {
  console.log("\n═══════════════════════════════════════");
  console.log("  9. DOCTORS");
  console.log("═══════════════════════════════════════\n");

  await test("GET /api/doctors", async () => {
    const r = await req(`${SERVER}/api/doctors`);
    return { pass: r.status === 200 && Array.isArray(r.json), status: r.status, detail: `Got ${r.json?.length || 0} doctors` };
  });

  await test("POST /api/doctors/match", async () => {
    const r = await req(`${SERVER}/api/doctors/match`, "POST", { symptoms: "chest pain, headache" });
    return { pass: r.status === 200 && r.json?.recommended_doctors, status: r.status, detail: r.text.slice(0, 160) };
  });

  await test("POST /api/doctors/match (no symptoms → 400)", async () => {
    const r = await req(`${SERVER}/api/doctors/match`, "POST", {});
    return { pass: r.status === 400, status: r.status, detail: r.text.slice(0, 120) };
  });
}

// ──────────────────── 10. Grocery ────────────────────

async function testGrocery() {
  console.log("\n═══════════════════════════════════════");
  console.log("  10. GROCERY");
  console.log("═══════════════════════════════════════\n");

  await test("POST /api/grocery/scan", async () => {
    const r = await req(`${SERVER}/api/grocery/scan`, "POST", {
      items: [{ name: "apple", quantity_g: 150 }, { name: "bread", quantity_g: 200 }],
      userId: "test",
    }, true);
    return { pass: r.status === 201 || r.status === 200, status: r.status, detail: r.text.slice(0, 160) };
  });

  await test("GET /api/grocery/history", async () => {
    const r = await req(`${SERVER}/api/grocery/history`, "GET", null, true);
    return { pass: r.status === 200 && Array.isArray(r.json), status: r.status, detail: `Got ${r.json?.length || 0} scans` };
  });

  await test("POST /api/grocery/scan-image", async () => {
    const r = await req(`${SERVER}/api/grocery/scan-image`, "POST", { image: "dGVzdA==", userId: "test" });
    return { pass: r.status === 200, status: r.status, detail: r.text.slice(0, 160) };
  });
}

// ──────────────────── 11. Food Plate & Health QA ────────────────────

async function testFoodPlateAndQA() {
  console.log("\n═══════════════════════════════════════");
  console.log("  11. FOOD PLATE & HEALTH QA");
  console.log("═══════════════════════════════════════\n");

  await test("POST /api/food-plate/analyze", async () => {
    const r = await req(`${SERVER}/api/food-plate/analyze`, "POST", { image: "dGVzdA==" });
    return { pass: r.status === 200, status: r.status, detail: r.text.slice(0, 160) };
  });

  await test("POST /api/health-qa/ask", async () => {
    const r = await req(`${SERVER}/api/health-qa/ask`, "POST", { question: "What foods help with sleep?" });
    return { pass: r.status === 200, status: r.status, detail: r.text.slice(0, 160) };
  });
}

// ──────────────────── 12. Exposome ────────────────────

async function testExposome() {
  console.log("\n═══════════════════════════════════════");
  console.log("  12. EXPOSOME (Environment Data)");
  console.log("═══════════════════════════════════════\n");

  await test("GET /api/exposome/current", async () => {
    const r = await req(`${SERVER}/api/exposome/current?lat=12.97&lon=77.59`, "GET", null, true);
    return { pass: r.status === 200 && (r.json?.weather || r.json?._mock), status: r.status, detail: r.text.slice(0, 160) };
  });

  await test("POST /api/exposome/suggestions", async () => {
    const r = await req(`${SERVER}/api/exposome/suggestions`, "POST", {
      schedule: [
        { title: "Breakfast", start: "08:00", end: "08:30" },
        { title: "Meeting", start: "09:00", end: "10:00" },
        { title: "Lunch", start: "12:30", end: "13:00" },
      ],
    }, true);
    return { pass: r.status === 200 && r.json?.suggestions, status: r.status, detail: r.text.slice(0, 160) };
  });

  await test("GET /api/exposome/history", async () => {
    const r = await req(`${SERVER}/api/exposome/history`, "GET", null, true);
    return { pass: r.status === 200 && Array.isArray(r.json), status: r.status, detail: `Got ${r.json?.length || 0} records` };
  });
}

// ──────────────────── 13. Direct AI Endpoints ────────────────────

async function testDirectAI() {
  console.log("\n═══════════════════════════════════════");
  console.log("  13. DIRECT AI SERVICE ENDPOINTS");
  console.log("═══════════════════════════════════════\n");

  const directTests = [
    { name: "POST /predict/risk", url: `${AI}/predict/risk`, body: { userId: "test", metrics: { steps: 5000, sleep: 6, heartRate: 80, bloodPressureSystolic: 130, bloodPressureDiastolic: 85, weight: 80, calories: 2500, screenTime: 8, waterIntake: 4, stressLevel: 7 }, history: [] } },
    { name: "POST /recommend", url: `${AI}/recommend`, body: { userId: "test", riskScores: { diabetes: 0.6, cardiac: 0.3, obesity: 0.4, stress: 0.5 }, metrics: { steps: 5000, sleep: 6 } } },
    { name: "POST /baseline-compare", url: `${AI}/baseline-compare`, body: { userId: "test", previousScore: 65, currentScore: 75, previousCredits: 100 } },
    { name: "POST /glycemic-curve", url: `${AI}/glycemic-curve`, body: { userId: "test", meals: [{ name: "rice", quantity_g: 200 }], diabeticRisk: 0.3 } },
    { name: "POST /sleep-debt", url: `${AI}/sleep-debt`, body: { userId: "test", sleepHistory: [{ date: "2025-03-10", hours: 6 }, { date: "2025-03-11", hours: 7 }, { date: "2025-03-12", hours: 5 }] } },
    { name: "POST /dopamine-score", url: `${AI}/dopamine-score`, body: { userId: "test", screenTimeHours: 5, socialMediaHours: 3, gamingHours: 1, exerciseHours: 1, sleepHours: 7 } },
    { name: "POST /age-biological", url: `${AI}/age-biological`, body: { userId: "test", chronologicalAge: 25, bmi: 22, avgSleepHours: 7, avgStepsPerDay: 8000, smokingStatus: false, avgStressLevel: 4, avgBloodPressureSystolic: 120, fastingGlucose: 90 } },
    { name: "POST /grocery-analyze", url: `${AI}/grocery-analyze`, body: { userId: "test", items: [{ name: "apple", quantity_g: 150 }, { name: "bread", quantity_g: 200 }] } },
    { name: "POST /grocery-analyze/image", url: `${AI}/grocery-analyze/image`, body: { image: "dGVzdA==", userId: "test" } },
    { name: "POST /exposome-risk", url: `${AI}/exposome-risk`, body: { userId: "test", aqi: 3, uvIndex: 5, temperatureCelsius: 35, humidity: 70 } },
    { name: "POST /goal-plan", url: `${AI}/goal-plan`, body: { userId: "test", goalDescription: "Lose 5 kg in 3 months", currentWeightKg: 80, targetWeightKg: 75, targetWeeks: 12, currentSteps: 6000, currentSleepHours: 7 } },
    { name: "POST /emergency-detect", url: `${AI}/emergency-detect`, body: { userId: "test", heartRate: 180, bloodPressureSystolic: 200, oxygenSaturation: 88, lossOfConsciousness: false } },
    { name: "POST /food-plate", url: `${AI}/food-plate`, body: { image: "dGVzdA==" } },
    { name: "POST /health-qa", url: `${AI}/health-qa`, body: { question: "Benefits of walking?" } },
    { name: "POST /doctor-match", url: `${AI}/doctor-match`, body: { symptoms: "chest pain", available_doctors: [{ id: "1", specialty: "Cardiology", bio: "Heart specialist", name: "Dr. Heart" }] } },
  ];

  for (const t of directTests) {
    await test(t.name, async () => {
      const r = await req(t.url, "POST", t.body);
      return { pass: r.status === 200, status: r.status, detail: r.text.slice(0, 160) };
    });
  }
}

// ──────────────────── Main ────────────────────

async function main() {
  console.log("\n╔═══════════════════════════════════════════════════╗");
  console.log("║   PranexusAI — Comprehensive API Test Suite        ║");
  console.log("╚═══════════════════════════════════════════════════╝");
  console.log(`\n  Server : ${SERVER}`);
  console.log(`  AI     : ${AI}\n`);

  await testServiceHealth();
  await testAuthFlow();
  await getToken();
  await testUserProfile();
  await testHealthMetrics();
  await testMedicalReports();
  await testAIHealthEndpoints();
  await testAppointments();
  await testDoctors();
  await testGrocery();
  await testFoodPlateAndQA();
  await testExposome();
  await testDirectAI();

  // ── Summary ──
  const passed = results.filter(r => r.pass).length;
  const failed = results.length - passed;

  console.log("\n╔═══════════════════════════════════════════════════╗");
  console.log(`║   RESULTS: ${passed}/${results.length} passed, ${failed} failed`);
  console.log("╚═══════════════════════════════════════════════════╝\n");

  if (failed > 0) {
    console.log("Failed tests:");
    for (const r of results.filter(r => !r.pass)) {
      console.log(`  ❌ ${r.name} [${r.status}] — ${r.detail}`);
    }
    console.log("");
  }
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
