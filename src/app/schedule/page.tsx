"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const translations: Record<string, any> = {
  en: {
    back: "← Back to Home",
    title: "Schedule & Calendar Management",
    enableNotif: "🔔 Enable Lock-Screen Notifications",
    notifEnabled: "✅ Notifications Active",
    selectDate: "📅 Date Selection:",
    selectTime: "⏰ Time Selection:",
    year: "Year",
    month: "Month",
    day: "Day",
    hours: "Hours",
    minutes: "Minutes",
    addPlan: "➕ Add Plan",
    planTitle: "📅 Planned Schedule & Tasks",
    noPlans: "No plans added yet",
    delete: "Delete",
    placeholder: "Enter plan details...",
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
  },
  ka: {
    back: "← მთავარზე დაბრუნება",
    title: "განრიგი & კალენდარული მართვა",
    enableNotif: "🔔 შეტყობინებების ჩართვა (Lock Screen)",
    notifEnabled: "✅ შეტყობინებები აქტიურია",
    selectDate: "📅 თარიღის არჩევა:",
    selectTime: "⏰ დროის არჩევა:",
    year: "წელი",
    month: "თვე",
    day: "დღე",
    hours: "საათი",
    minutes: "წუთი",
    addPlan: "➕ გეგმის დამატება",
    planTitle: "📅 დაგეგმილი განრიგი & დავალებები",
    noPlans: "გეგმები ჯერ არ არის დამატებული",
    delete: "წაშლა",
    placeholder: "შეიყვანეთ გეგმის დეტალები...",
    months: [
      "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
      "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"
    ]
  },
  ru: {
    back: "← На главную",
    title: "Расписание и календарный план",
    enableNotif: "🔔 Включить уведомления (Lock Screen)",
    notifEnabled: "✅ Уведомления активны",
    selectDate: "📅 Выбор даты:",
    selectTime: "⏰ Выбор времени:",
    year: "Год",
    month: "Месяц",
    day: "День",
    hours: "Часы",
    minutes: "Минуты",
    addPlan: "➕ Добавить план",
    planTitle: "📅 Запланированные задачи",
    noPlans: "Планов пока нет",
    delete: "Удалить",
    placeholder: "Введите детали плана...",
    months: [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ]
  },
};

interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  text: string;
}

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export default function SchedulePage() {
  const [lang, setLang] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const [text, setText] = useState("");
  const [plans, setPlans] = useState<ScheduleItem[]>([]);
  const [hasNotifPermission, setHasNotifPermission] = useState(false);

  const hoursContainerRef = useRef<HTMLDivElement>(null);
  const minutesContainerRef = useRef<HTMLDivElement>(null);

  const loadSettings = () => {
    const savedLang = localStorage.getItem("lifepulse_lang");
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
    const savedTheme = localStorage.getItem("lifepulse_theme");
    setIsDarkMode(savedTheme !== "light");
  };

  useEffect(() => {
    loadSettings();
    const handleLangChange = () => loadSettings();
    window.addEventListener("lifepulse_lang_change", handleLangChange);
    return () => window.removeEventListener("lifepulse_lang_change", handleLangChange);
  }, []);

  useEffect(() => {
    const savedPlans = localStorage.getItem("lifepulse_schedule");
    if (savedPlans) {
      try {
        setPlans(JSON.parse(savedPlans));
      } catch (e) {
        console.error(e);
      }
    }

    if (typeof window !== "undefined" && "Notification" in window) {
      setHasNotifPermission(Notification.permission === "granted");
    }
  }, []);

  // background notification tracker
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window === "undefined" || Notification.permission !== "granted") return;

      const now = new Date();
      const currentDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      plans.forEach((item) => {
        if (item.date === currentDateStr && item.time === currentTimeStr) {
          // Trigger Notification on Lock Screen / System
          new Notification("LifePulse OS — " + item.time, {
            body: item.text,
            icon: "/favicon.ico",
          });
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [plans]);

  const requestNotifPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setHasNotifPermission(true);
      }
    }
  };

  const t = translations[lang] || translations.en;

  const daysInCurrentMonth = getDaysInMonth(selectedYear, selectedMonth);
  useEffect(() => {
    if (selectedDay > daysInCurrentMonth) {
      setSelectedDay(daysInCurrentMonth);
    }
  }, [selectedYear, selectedMonth, daysInCurrentMonth, selectedDay]);

  const addPlan = () => {
    if (!text.trim()) return;

    const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    const formattedTime = `${String(selectedHour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`;

    const newPlan: ScheduleItem = {
      id: Date.now().toString(),
      date: formattedDate,
      time: formattedTime,
      text,
    };

    const updated = [newPlan, ...plans];
    setPlans(updated);
    localStorage.setItem("lifepulse_schedule", JSON.stringify(updated));
    setText("");
  };

  const deletePlan = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    localStorage.setItem("lifepulse_schedule", JSON.stringify(updated));
  };

  const yearsList = Array.from({ length: 12 }, (_, i) => 2024 + i);
  const hoursList = Array.from({ length: 24 }, (_, i) => i);
  const minutesList = Array.from({ length: 60 }, (_, i) => i);

  const handleScroll = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    setSelected: (val: number) => void
  ) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const itemHeight = 40;
    const scrollTop = container.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (index >= 0) {
      setSelected(index);
    }
  };

  const selectHourAndScroll = (h: number) => {
    setSelectedHour(h);
    if (hoursContainerRef.current) {
      hoursContainerRef.current.scrollTo({
        top: h * 40,
        behavior: "smooth",
      });
    }
  };

  const selectMinuteAndScroll = (m: number) => {
    setSelectedMinute(m);
    if (minutesContainerRef.current) {
      minutesContainerRef.current.scrollTo({
        top: m * 40,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-12 transition-colors duration-300 relative overflow-hidden ${
      isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#FDFBF7] text-[#2C221E]"
    }`}>
      <div className="max-w-5xl mx-auto w-full space-y-8 animate-fade-in relative z-10">
        
        {/* Header */}
        <div className={`flex justify-between items-center border-b pb-6 flex-wrap gap-4 glass-card ${
          isDarkMode ? "border-zinc-800/80" : "border-[#E5DFD3]"
        }`}>
          <Link 
            href="/" 
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold smooth-transition flex items-center gap-2 border cursor-pointer ${
              isDarkMode 
                ? "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-800" 
                : "bg-white/80 hover:bg-[#EFECE6] text-[#2C221E] border-[#DCD6C8]"
            }`}
          >
            {t.back}
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={requestNotifPermission}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                hasNotifPermission
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500"
              }`}
            >
              {hasNotifPermission ? t.notifEnabled : t.enableNotif}
            </button>
            <span className="text-xl">📅</span>
            <h1 className="text-xl font-extrabold tracking-tight">{t.title}</h1>
          </div>
        </div>

        {/* Input Panel */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 glass-card ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white/80 border-[#E5DFD3]"
        }`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Date Selectors */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">{t.selectDate}</label>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 block">{t.year}</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className={`w-full px-3 py-2.5 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                      isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
                    }`}
                  >
                    {yearsList.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 block">{t.month}</span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className={`w-full px-3 py-2.5 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                      isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
                    }`}
                  >
                    {t.months.map((mName: string, idx: number) => (
                      <option key={idx} value={idx}>{mName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 block">{t.day}</span>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className={`w-full px-3 py-2.5 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                      isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
                    }`}
                  >
                    {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3D Transparent Time Scroller */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">{t.selectTime}</label>
              
              <div className={`flex justify-center items-center gap-6 p-4 rounded-2xl border backdrop-blur-md relative overflow-hidden h-36 ${
                isDarkMode ? "bg-zinc-950/80 border-zinc-800 shadow-inner" : "bg-zinc-100/80 border-[#DCD6C8]"
              }`}>
                
                {/* Active Highlight Band */}
                <div className="absolute inset-x-4 h-10 top-1/2 -translate-y-1/2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 pointer-events-none shadow-lg shadow-indigo-500/10" />

                {/* Hours Wheel Scroller */}
                <div className="flex flex-col items-center space-y-1 z-10">
                  <span className="text-[10px] font-bold text-zinc-400">{t.hours}</span>
                  <div
                    ref={hoursContainerRef}
                    onScroll={() => handleScroll(hoursContainerRef, setSelectedHour)}
                    className="h-24 overflow-y-auto snap-y snap-mandatory scrollbar-none py-7 w-20 text-center select-none"
                  >
                    {hoursList.map((h) => (
                      <div
                        key={h}
                        onClick={() => selectHourAndScroll(h)}
                        className={`snap-center cursor-pointer transition-all duration-200 text-base font-extrabold h-10 flex items-center justify-center ${
                          selectedHour === h
                            ? "text-indigo-400 scale-125 font-black drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                            : "text-zinc-600 hover:text-zinc-400 scale-90 opacity-40"
                        }`}
                      >
                        {String(h).padStart(2, "0")}
                      </div>
                    ))}
                  </div>
                </div>

                <span className="text-2xl font-black text-indigo-400 z-10 pt-4">:</span>

                {/* Minutes Wheel Scroller */}
                <div className="flex flex-col items-center space-y-1 z-10">
                  <span className="text-[10px] font-bold text-zinc-400">{t.minutes}</span>
                  <div
                    ref={minutesContainerRef}
                    onScroll={() => handleScroll(minutesContainerRef, setSelectedMinute)}
                    className="h-24 overflow-y-auto snap-y snap-mandatory scrollbar-none py-7 w-20 text-center select-none"
                  >
                    {minutesList.map((m) => (
                      <div
                        key={m}
                        onClick={() => selectMinuteAndScroll(m)}
                        className={`snap-center cursor-pointer transition-all duration-200 text-base font-extrabold h-10 flex items-center justify-center ${
                          selectedMinute === m
                            ? "text-indigo-400 scale-125 font-black drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                            : "text-zinc-600 hover:text-zinc-400 scale-90 opacity-40"
                        }`}
                      >
                        {String(m).padStart(2, "0")}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Text Input and Add Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder={t.placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`flex-1 px-4 py-3.5 rounded-2xl border text-xs font-medium transition-all ${
                isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
              }`}
            />
            <button
              onClick={addPlan}
              className="px-8 py-3.5 rounded-2xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg cursor-pointer smooth-transition shrink-0"
            >
              {t.addPlan}
            </button>
          </div>

        </div>

        {/* Schedule List */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 glass-card ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white/80 border-[#E5DFD3]"
        }`}>
          <h2 className="text-base font-bold">{t.planTitle}</h2>

          {plans.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="text-3xl">📅</div>
              <p className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-[#7B6E63]"}`}>{t.noPlans}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {plans.map((item) => (
                <div key={item.id} className={`p-4 rounded-2xl border flex justify-between items-center flex-wrap gap-3 ${
                  isDarkMode ? "bg-zinc-950 border-zinc-800/80" : "bg-[#F4F0EA] border-[#DCD6C8]"
                }`}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 flex items-center gap-1">
                      <span>📅</span> {item.date}
                    </span>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1">
                      <span>⏰</span> {item.time}
                    </span>
                    <p className="text-xs sm:text-sm font-medium">{item.text}</p>
                  </div>
                  
                  <button
                    onClick={() => deletePlan(item.id)}
                    className="text-xs text-zinc-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-rose-500/40 cursor-pointer"
                  >
                    🗑️ {t.delete}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <footer className="text-center text-xs text-zinc-500 py-6 relative z-10">
        LifePulse OS — Premium Edition.
      </footer>
    </div>
  );
}