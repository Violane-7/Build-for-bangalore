import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const VitalsContext = createContext(null);

// Scenario presets for demo mode
const SCENARIOS = {
  normal: {
    heartRate: () => 68 + Math.floor(Math.random() * 12),
    spo2: () => 96 + Math.floor(Math.random() * 3),
    bloodPressure: () => ({
      systolic: 115 + Math.floor(Math.random() * 10),
      diastolic: 72 + Math.floor(Math.random() * 8),
    }),
    temperature: () => 36.5 + Math.random() * 0.5,
    respiratoryRate: () => 14 + Math.floor(Math.random() * 4),
  },
  'heart-attack': {
    heartRate: () => 155 + Math.floor(Math.random() * 15),
    spo2: () => 88 + Math.floor(Math.random() * 3),
    bloodPressure: () => ({
      systolic: 175 + Math.floor(Math.random() * 10),
      diastolic: 100 + Math.floor(Math.random() * 10),
    }),
    temperature: () => 36.8 + Math.random() * 0.3,
    respiratoryRate: () => 22 + Math.floor(Math.random() * 6),
  },
  'cardiac-arrest': {
    heartRate: () => Math.floor(Math.random() * 12),
    spo2: () => 70 + Math.floor(Math.random() * 10),
    bloodPressure: () => ({ systolic: 60, diastolic: 30 }),
    temperature: () => 35.5 + Math.random() * 0.5,
    respiratoryRate: () => 4 + Math.floor(Math.random() * 4),
  },
  fainting: {
    heartRate: () => 45 + Math.floor(Math.random() * 10),
    spo2: () => 87 + Math.floor(Math.random() * 4),
    bloodPressure: () => ({
      systolic: 80 + Math.floor(Math.random() * 10),
      diastolic: 45,
    }),
    temperature: () => 36.2 + Math.random() * 0.3,
    respiratoryRate: () => 10 + Math.floor(Math.random() * 4),
  },
  'heat-stroke': {
    heartRate: () => 110 + Math.floor(Math.random() * 20),
    spo2: () => 93 + Math.floor(Math.random() * 3),
    bloodPressure: () => ({
      systolic: 100 + Math.floor(Math.random() * 15),
      diastolic: 60 + Math.floor(Math.random() * 10),
    }),
    temperature: () => 40.2 + Math.random() * 0.8,
    respiratoryRate: () => 24 + Math.floor(Math.random() * 6),
  },
  hypotension: {
    heartRate: () => 100 + Math.floor(Math.random() * 15),
    spo2: () => 94 + Math.floor(Math.random() * 3),
    bloodPressure: () => ({
      systolic: 65 + Math.floor(Math.random() * 5),
      diastolic: 38,
    }),
    temperature: () => 36.4 + Math.random() * 0.3,
    respiratoryRate: () => 18 + Math.floor(Math.random() * 4),
  },
  'low-spo2': {
    heartRate: () => 95 + Math.floor(Math.random() * 15),
    spo2: () => 82 + Math.floor(Math.random() * 4),
    bloodPressure: () => ({
      systolic: 120 + Math.floor(Math.random() * 10),
      diastolic: 80 + Math.floor(Math.random() * 8),
    }),
    temperature: () => 36.6 + Math.random() * 0.3,
    respiratoryRate: () => 26 + Math.floor(Math.random() * 6),
  },
  'high-hr': {
    heartRate: () => 165 + Math.floor(Math.random() * 20),
    spo2: () => 94 + Math.floor(Math.random() * 3),
    bloodPressure: () => ({
      systolic: 150 + Math.floor(Math.random() * 15),
      diastolic: 95 + Math.floor(Math.random() * 10),
    }),
    temperature: () => 37.2 + Math.random() * 0.5,
    respiratoryRate: () => 22 + Math.floor(Math.random() * 6),
  },
};

function generateVitals(scenario = 'normal') {
  const s = SCENARIOS[scenario] || SCENARIOS.normal;
  return {
    heartRate: s.heartRate(),
    spo2: s.spo2(),
    bloodPressure: s.bloodPressure(),
    temperature: s.temperature(),
    respiratoryRate: s.respiratoryRate(),
    timestamp: Date.now(),
  };
}

export function VitalsProvider({ children }) {
  const [vitals, setVitals] = useState(() => generateVitals('normal'));
  const [scenario, setScenario] = useState('normal');
  const [isWearableConnected, setIsWearableConnected] = useState(false);
  const intervalRef = useRef(null);

  // Update vitals based on current scenario
  const updateVitals = useCallback(() => {
    setVitals(generateVitals(scenario));
  }, [scenario]);

  // Start/stop automatic vitals updates
  useEffect(() => {
    if (isWearableConnected) {
      // Update immediately when scenario changes
      updateVitals();
      // Then update every 2 seconds
      intervalRef.current = setInterval(updateVitals, 2000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isWearableConnected, updateVitals]);

  // Simulate a specific scenario (for demo/presentation)
  const simulateScenario = useCallback((newScenario) => {
    setScenario(newScenario);
    // Immediately generate new vitals for the scenario
    setVitals(generateVitals(newScenario));
  }, []);

  // Connect/disconnect wearable
  const connectWearable = useCallback(() => {
    setIsWearableConnected(true);
    setVitals(generateVitals(scenario));
  }, [scenario]);

  const disconnectWearable = useCallback(() => {
    setIsWearableConnected(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Push custom vitals (for direct control)
  const pushVitals = useCallback((customVitals) => {
    setVitals((prev) => ({
      ...prev,
      ...customVitals,
      timestamp: Date.now(),
    }));
  }, []);

  const value = {
    vitals,
    scenario,
    isWearableConnected,
    simulateScenario,
    connectWearable,
    disconnectWearable,
    pushVitals,
    SCENARIOS: Object.keys(SCENARIOS),
  };

  return (
    <VitalsContext.Provider value={value}>
      {children}
    </VitalsContext.Provider>
  );
}

export function useVitals() {
  const context = useContext(VitalsContext);
  if (!context) {
    throw new Error('useVitals must be used within a VitalsProvider');
  }
  return context;
}

export default VitalsContext;
