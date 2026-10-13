"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const translations: Record<string, any> = {
  en: {
    title: "LifePulse OS",
    subtitle: "Unified Premium Productivity & Health Suite",
    fitness: "Fitness & GPS Tracking",
    fitnessDesc: "Track workouts, active duration, and calories in real time.",
    schedule: "Schedule & Plans",
    scheduleDesc: "Manage daily tasks and keep track of your schedule seamlessly.",
    media: "Media Vault & Camera",
    mediaDesc: "Capture memories or store media files securely offline.",
    nutrition: "Nutrition & Diet",
    nutritionDesc: "Monitor your daily meals, macros, and calorie targets.",
    themeToggle: "Theme",
    open: "Explore Module →",
  },
  ka: {
    title: "LifePulse OS",
    subtitle: "პროდუქტიულობის და ჯანმრთელობის პრემიუმ სისტემა",
    fitness: "ფიტნესი & GPS ტრეკინგი",
    fitnessDesc: "აკონტროლეთ ვარჯიში, დრო და კალორიები რეალურ დროში.",
    schedule: "განრიგი & გეგმები",
    scheduleDesc: "მართეთ ყოველდღიური დავალებები მარტივად და ეფექტურად.",
    media: "მედია ვოლტი & კამერა",
    mediaDesc: "გადაიღეთ ფოტოები ან შეინახეთ ფაილები უსაფრთხოდ.",
    nutrition: "კვება & დიეტა",
    nutritionDesc: "აკონტროლეთ ყოველდღიური კვება და კალორიული ბალანსი.",
    themeToggle: "თემა",
    open: "მოდულის გახსნა →",
  },
  ru: {
    title: "LifePulse OS",
    subtitle: "Единая система продуктивности и здоровья",
    fitness: "Фитнес и GPS-трекинг",
    fitnessDesc: "Отслеживайте тренировки, время и калории в реальном времени.",
    schedule: "Расписание и планы",
    scheduleDesc: "Управляйте ежедневными задачами легко и эффективно.",
    media: "Хранилище и камера",
    mediaDesc: "Сохраняйте фото и файлы в надежном локальном хранилище.",
    nutrition: "Питание и диета",
    nutritionDesc: "Контролируйте свой рацион и суточную норму калорий.",
    themeToggle: "Тема",
    open: "Открыть модуль →",
  },
};

export default function Home() {
  const [lang, setLang] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lifepulse_lang");
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    } else {
      setLang("en");
      localStorage.setItem("lifepulse_lang", "en");
    }

    const savedTheme = localStorage.getItem("lifepulse_theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
    }

    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem("lifepulse_lang", newLang);
    setIsDropdownOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("lifepulse_theme", newTheme ? "dark" : "light");
  };

  const t = translations[lang] || translations.en;

  const localeMap: Record<string, string> = {
    en: "en-US",
    ka: "ka-GE",
    ru: "ru-RU",
  };

  const currentLocale = localeMap[lang] || "en-US";
  const formattedDate = currentTime ? currentTime.toLocaleDateString(currentLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }) : "";
  
  const formattedTime = currentTime ? currentTime.toLocaleTimeString(currentLocale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }) : "";

  const langNames: Record<string, string> = {
    en: "English",
    ka: "ქართული",
    ru: "Русский",
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-12 transition-colors duration-500 relative overflow-hidden ${
      isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#FDFBF7] text-[#2C221E]"
    }`}>
      
      {/* Background Glow */}
      <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-all duration-700 ${
        isDarkMode ? "bg-emerald-500/10" : "bg-amber-500/10"
      }`} />
      <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-all duration-700 ${
        isDarkMode ? "bg-purple-500/10" : "bg-orange-500/10"
      }`} />

      <div className="max-w-5xl mx-auto w-full space-y-12 animate-fade-in relative z-10">
        
        {/* Navigation Bar */}
        <div className={`flex justify-between items-center border-b pb-6 flex-wrap gap-4 glass-card ${
          isDarkMode ? "border-zinc-800/80" : "border-[#E5DFD3]"
        }`}>
          
          {/* Custom Dropdown Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold smooth-transition border cursor-pointer flex items-center gap-2 shadow-sm ${
                isDarkMode 
                  ? "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-800 hover:border-emerald-500/40" 
                  : "bg-white/80 hover:bg-[#EFECE6] text-[#2C221E] border-[#DCD6C8]"
              }`}
            >
              <span className="text-sm">🌐</span>
              <span>{langNames[lang]}</span>
              <span className={`text-[10px] opacity-60 smooth-transition ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
            </button>

            {isDropdownOpen && (
              <div className={`absolute left-0 mt-2 w-40 rounded-2xl border shadow-2xl overflow-hidden z-50 glass-card animate-fade-in ${
                isDarkMode ? "bg-zinc-900/95 border-zinc-800 text-zinc-100" : "bg-white/95 border-[#DCD6C8] text-[#2C221E]"
              }`}>
                {[
                  { code: "en", label: "English", flag: "🇬🇧" },
                  { code: "ka", label: "ქართული", flag: "🇬🇪" },
                  { code: "ru", label: "Русский", flag: "🌐" },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLangChange(item.code)}
                    className={`w-full text-left px-4 py-3 text-xs font-bold smooth-transition flex items-center gap-2 cursor-pointer ${
                      lang === item.code
                        ? "bg-emerald-600 text-white"
                        : isDarkMode 
                        ? "hover:bg-zinc-800/80" 
                        : "hover:bg-[#F4F0EA]"
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold smooth-transition border cursor-pointer flex items-center gap-2.5 shadow-sm ${
              isDarkMode 
                ? "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-800 hover:border-amber-500/40" 
                : "bg-white/80 hover:bg-[#EFECE6] text-[#2C221E] border-[#DCD6C8]"
            }`}
          >
            <span className="text-sm">{isDarkMode ? "🌙" : "☀️"}</span>
            <span>{t.themeToggle}</span>
          </button>
        </div>

        {/* Hero Section & Live DateTime Display */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 pb-1">
            {t.title}
          </h1>
          <p className={`text-sm sm:text-base font-medium max-w-lg mx-auto ${
            isDarkMode ? "text-zinc-400" : "text-[#7B6E63]"
          }`}>
            {t.subtitle}
          </p>

          <div className={`inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-3.5 rounded-2xl border shadow-lg mt-6 smooth-transition ${
            isDarkMode 
              ? "bg-zinc-900/60 border-zinc-800/80 text-emerald-400 shadow-emerald-950/20" 
              : "bg-white/80 border-[#E5DFD3] text-[#8C6D53]"
          }`}>
            <span className="text-xs font-bold capitalize flex items-center gap-1.5">
              <span>📅</span> {formattedDate || "Loading..."}
            </span>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="text-xs font-mono font-extrabold flex items-center gap-1.5">
              <span>⏰</span> {formattedTime || "--:--:--"}
            </span>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          
          {/* Fitness Module */}
          <Link
            href="/fitness"
            className={`group p-6 rounded-3xl border shadow-xl smooth-transition hover:-translate-y-1.5 flex flex-col justify-between space-y-6 glass-card ${
              isDarkMode 
                ? "bg-zinc-900/50 border-zinc-800/80 hover:border-emerald-500/50 hover:shadow-emerald-500/10" 
                : "bg-white/70 border-[#E5DFD3] hover:border-[#8C6D53]/50 hover:shadow-xl"
            }`}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 smooth-transition">
                🏃‍♂️
              </div>
              <h2 className="text-base font-bold group-hover:text-emerald-400 smooth-transition">{t.fitness}</h2>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-[#7B6E63]"}`}>
                {t.fitnessDesc}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 smooth-transition">
              {t.open}
            </span>
          </Link>

          {/* Schedule Module */}
          <Link
            href="/schedule"
            className={`group p-6 rounded-3xl border shadow-xl smooth-transition hover:-translate-y-1.5 flex flex-col justify-between space-y-6 glass-card ${
              isDarkMode 
                ? "bg-zinc-900/50 border-zinc-800/80 hover:border-indigo-500/50 hover:shadow-indigo-500/10" 
                : "bg-white/70 border-[#E5DFD3] hover:border-[#8C6D53]/50 hover:shadow-xl"
            }`}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl group-hover:scale-110 smooth-transition">
                ⏰
              </div>
              <h2 className="text-base font-bold group-hover:text-indigo-400 smooth-transition">{t.schedule}</h2>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-[#7B6E63]"}`}>
                {t.scheduleDesc}
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 smooth-transition">
              {t.open}
            </span>
          </Link>

          {/* Media Module */}
          <Link
            href="/media"
            className={`group p-6 rounded-3xl border shadow-xl smooth-transition hover:-translate-y-1.5 flex flex-col justify-between space-y-6 glass-card ${
              isDarkMode 
                ? "bg-zinc-900/50 border-zinc-800/80 hover:border-purple-500/50 hover:shadow-purple-500/10" 
                : "bg-white/70 border-[#E5DFD3] hover:border-[#8C6D53]/50 hover:shadow-xl"
            }`}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl group-hover:scale-110 smooth-transition">
                📸
              </div>
              <h2 className="text-base font-bold group-hover:text-purple-400 smooth-transition">{t.media}</h2>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-[#7B6E63]"}`}>
                {t.mediaDesc}
              </p>
            </div>
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 smooth-transition">
              {t.open}
            </span>
          </Link>

          {/* Nutrition Module */}
          <Link
            href="/nutrition"
            className={`group p-6 rounded-3xl border shadow-xl smooth-transition hover:-translate-y-1.5 flex flex-col justify-between space-y-6 glass-card ${
              isDarkMode 
                ? "bg-zinc-900/50 border-zinc-800/80 hover:border-amber-500/50 hover:shadow-amber-500/10" 
                : "bg-white/70 border-[#E5DFD3] hover:border-[#8C6D53]/50 hover:shadow-xl"
            }`}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl group-hover:scale-110 smooth-transition">
                🥗
              </div>
              <h2 className="text-base font-bold group-hover:text-amber-400 smooth-transition">{t.nutrition}</h2>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-[#7B6E63]"}`}>
                {t.nutritionDesc}
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 smooth-transition">
              {t.open}
            </span>
          </Link>

        </div>

      </div>

      <footer className="text-center text-xs text-zinc-500 py-6 relative z-10">
        LifePulse OS — Premium Edition.
      </footer>
    </div>
  );
}