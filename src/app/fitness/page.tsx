"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const translations: Record<string, any> = {
  ka: {
    back: "← მთავარზე დაბრუნება",
    title: "ფიტნესი, GPS ტრეკინგი & კალორიები",
    startTracking: "▶ ტრეკინგის დაწყება",
    stopTracking: "⏹ ვარჯიშის დასრულება & შენახვა",
    distance: "მანძილი",
    calories: "დაწვერილი კალორიები",
    time: "დრო",
    speed: "სიჩქარე",
    km: "კმ",
    m: "მ",
    kcal: "კკალ",
    kmh: "კმ/სთ",
    gpsStatus: "GPS: ტრეკინგი აქტიურია (მოძრაობა იწერება)",
    gpsWaiting: "GPS: დააჭირეთ დაწყებას სირბილის დასაწყებად",
    historyTitle: "🏃‍♂️ დასრულებული ვარჯიშები",
    noHistory: "ვარჯიშების ისტორია ცარიელია.",
    workout: "ვარჯიში",
    delete: "წაშლა",
  },
  en: {
    back: "← Back to Home",
    title: "Fitness, GPS Tracking & Calories",
    startTracking: "▶ Start Tracking",
    stopTracking: "⏹ Finish & Save Workout",
    distance: "Distance",
    calories: "Burned Calories",
    time: "Time",
    speed: "Speed",
    km: "km",
    m: "m",
    kcal: "kcal",
    kmh: "km/h",
    gpsStatus: "GPS: Tracking active",
    gpsWaiting: "GPS: Press start to begin workout",
    historyTitle: "🏃‍♂️ Completed Workouts",
    noHistory: "No workout history yet.",
    workout: "Workout",
    delete: "Delete",
  },
  es: {
    back: "← Volver al Inicio",
    title: "Fitness, Rastreo GPS y Calorías",
    startTracking: "▶ Iniciar Rastreo",
    stopTracking: "⏹ Terminar y Guardar",
    distance: "Distancia",
    calories: "Calorías",
    time: "Tiempo",
    speed: "Velocidad",
    km: "km",
    m: "m",
    kcal: "kcal",
    kmh: "km/h",
    gpsStatus: "GPS: Rastreo activo",
    gpsWaiting: "GPS: Presiona iniciar para entrenar",
    historyTitle: "🏃‍♂️ Entrenamientos Guardados",
    noHistory: "Sin historial.",
    workout: "Entrenamiento",
    delete: "Eliminar",
  },
  fr: {
    back: "← Retour à l'accueil",
    title: "Fitness, Suivi GPS & Calories",
    startTracking: "▶ Démarrer le suivi",
    stopTracking: "⏹ Terminer & Enregistrer",
    distance: "Distance",
    calories: "Calories",
    time: "Temps",
    speed: "Vitesse",
    km: "km",
    m: "m",
    kcal: "kcal",
    kmh: "km/h",
    gpsStatus: "GPS : Suivi actif",
    gpsWaiting: "GPS : Appuyez sur démarrer",
    historyTitle: "🏃‍♂️ Entraînements",
    noHistory: "Aucun historique.",
    workout: "Séance",
    delete: "Supprimer",
  },
  de: {
    back: "← Zurück zur Startseite",
    title: "Fitness, GPS-Tracking & Kalorien",
    startTracking: "▶ Tracking starten",
    stopTracking: "⏹ Beenden & Speichern",
    distance: "Distanz",
    calories: "Kalorien",
    time: "Zeit",
    speed: "Geschwindigkeit",
    km: "km",
    m: "m",
    kcal: "kcal",
    kmh: "km/h",
    gpsStatus: "GPS: Tracking aktiv",
    gpsWaiting: "GPS: Starten drücken zum Tracken",
    historyTitle: "🏃‍♂️ Abgeschlossene Workouts",
    noHistory: "Kein Verlauf.",
    workout: "Workout",
    delete: "Löschen",
  },
  ru: {
    back: "← На главную",
    title: "Фитнес, GPS-трекинг и калории",
    startTracking: "▶ Начать трекинг",
    stopTracking: "⏹ Завершить и сохранить",
    distance: "Дистанция",
    calories: "Калории",
    time: "Время",
    speed: "Скорость",
    km: "км",
    m: "м",
    kcal: "ккал",
    kmh: "км/ч",
    gpsStatus: "GPS: Трекинг активен",
    gpsWaiting: "GPS: Нажмите старт для тренировки",
    historyTitle: "🏃‍♂️ Завершенные тренировки",
    noHistory: "История пуста.",
    workout: "Тренировка",
    delete: "Удалить",
  },
};

interface WorkoutRecord {
  id: string;
  date: string;
  distance: number;
  calories: number;
  duration: string;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function FitnessPage() {
  const [lang, setLang] = useState("ka");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [calories, setCalories] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [speed, setSpeed] = useState(0);
  
  const [lastCoords, setLastCoords] = useState<[number, number] | null>(null);
  const [history, setHistory] = useState<WorkoutRecord[]>([]);

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("lifepulse_lang");
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }

    const savedTheme = localStorage.getItem("lifepulse_theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
    }

    const savedHistory = localStorage.getItem("lifepulse_workouts");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const t = translations[lang] || translations.ka;

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);

      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const newLat = position.coords.latitude;
            const newLng = position.coords.longitude;

            if (lastCoords) {
              const distStep = calculateDistance(lastCoords[0], lastCoords[1], newLat, newLng);

              if (distStep > 0.5 && distStep < 200) {
                setDistanceMeters((dPrev) => {
                  const totalDist = dPrev + distStep;
                  setCalories(Math.round((totalDist / 1000) * 65));
                  return totalDist;
                });
              }
            }

            setLastCoords([newLat, newLng]);

            if (position.coords.speed !== null && position.coords.speed >= 0) {
              setSpeed(position.coords.speed * 3.6);
            }
          },
          (error) => console.error("GPS Watch error:", error),
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
      }
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking, lastCoords]);

  const toggleTracking = () => {
    if (!isTracking) {
      setIsTracking(true);
      setDistanceMeters(0);
      setCalories(0);
      setSeconds(0);
      setSpeed(0);
      setLastCoords(null);
    } else {
      setIsTracking(false);

      const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}მ ${s}წმ`;
      };

      const newRecord: WorkoutRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        distance: parseFloat((distanceMeters / 1000).toFixed(2)),
        calories: calories,
        duration: formatTime(seconds),
      };

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("lifepulse_workouts", JSON.stringify(updatedHistory));
    }
  };

  const deleteWorkout = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("lifepulse_workouts", JSON.stringify(updatedHistory));
  };

  const formatDisplayTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-8 transition-colors duration-300 ${
      isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#FDFBF7] text-[#2C221E]"
    }`}>
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className={`flex justify-between items-center border-b pb-6 flex-wrap gap-4 ${
          isDarkMode ? "border-zinc-800" : "border-[#E5DFD3]"
        }`}>
          <Link 
            href="/" 
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              isDarkMode 
                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700" 
                : "bg-[#EFECE6] hover:bg-[#E5DFD3] text-[#2C221E] border-[#DCD6C8]"
            }`}
          >
            {t.back}
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xl">🏃‍♂️</span>
            <h1 className="text-xl font-extrabold tracking-tight">{t.title}</h1>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className={`p-5 rounded-3xl border shadow-md space-y-1 ${
            isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-[#F4F0EA] border-[#E5DFD3]"
          }`}>
            <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-[#5C4F46]"}`}>{t.distance}</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">
              {distanceMeters >= 1000 ? (distanceMeters / 1000).toFixed(2) : Math.round(distanceMeters)} 
              <span className="text-xs font-normal ml-1">{distanceMeters >= 1000 ? t.km : t.m}</span>
            </p>
          </div>

          <div className={`p-5 rounded-3xl border shadow-md space-y-1 ${
            isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-[#F4F0EA] border-[#E5DFD3]"
          }`}>
            <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-[#5C4F46]"}`}>{t.calories}</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-400">{calories} <span className="text-xs font-normal">{t.kcal}</span></p>
          </div>

          <div className={`p-5 rounded-3xl border shadow-md space-y-1 ${
            isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-[#F4F0EA] border-[#E5DFD3]"
          }`}>
            <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-[#5C4F46]"}`}>{t.time}</p>
            <p className="text-2xl sm:text-3xl font-black text-purple-400">{formatDisplayTime(seconds)}</p>
          </div>

          <div className={`p-5 rounded-3xl border shadow-md space-y-1 ${
            isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-[#F4F0EA] border-[#E5DFD3]"
          }`}>
            <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-[#5C4F46]"}`}>{t.speed}</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-400">{speed.toFixed(1)} <span className="text-xs font-normal">{t.kmh}</span></p>
          </div>
        </div>

        {/* Control Button */}
        <div className="text-center py-6">
          <button
            onClick={toggleTracking}
            className={`px-10 py-5 rounded-2xl font-black text-base transition-all shadow-xl cursor-pointer ${
              isTracking
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse"
                : isDarkMode
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                : "bg-[#8C6D53] hover:bg-[#725741] text-white shadow-[#8C6D53]/30"
            }`}
          >
            {isTracking ? t.stopTracking : t.startTracking}
          </button>
          <p className={`text-xs mt-4 ${isDarkMode ? "text-zinc-500" : "text-[#7B6E63]"}`}>
            {isTracking ? t.gpsStatus : t.gpsWaiting}
          </p>
        </div>

        {/* Workout History */}
        <div className={`p-6 rounded-3xl border shadow-md space-y-4 ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-[#F4F0EA] border-[#E5DFD3]"
        }`}>
          <h2 className="text-base font-bold">{t.historyTitle}</h2>

          {history.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="text-3xl">📭</div>
              <p className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-[#7B6E63]"}`}>{t.noHistory}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div key={item.id} className={`p-4 rounded-2xl border flex justify-between items-center ${
                  isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-[#DCD6C8]"
                }`}>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-emerald-400">{t.workout} #{history.length - idx}</p>
                    <p className={`text-[11px] ${isDarkMode ? "text-zinc-400" : "text-[#5C4F46]"}`}>📅 {item.date}</p>
                    <p className="text-xs font-bold">
                      📏 {item.distance} {t.km} | ⏱️ {item.duration} | 🔥 {item.calories} {t.kcal}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteWorkout(item.id)}
                    className="text-xs text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-rose-500/40"
                  >
                    🗑️ {t.delete}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <footer className="text-center text-xs text-zinc-500 py-6">
        LifePulse OS — Global Edition.
      </footer>
    </div>
  );
}